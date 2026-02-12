#!/usr/bin/env bash
# Fully automated CI/CD script: Build -> Push to ECR -> Deploy to EC2

set -euo pipefail
IFS=$'\n\t'

### ---------- CONFIG ----------
AWS_REGION="${AWS_REGION:-ap-south-1}"
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"

ECR_FRONTEND_NAME="sports-frontend"
ECR_BACKEND_NAME="sports-backend"

ECR_URL="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
IMAGE_FRONTEND="$ECR_URL/$ECR_FRONTEND_NAME:latest"
IMAGE_BACKEND="$ECR_URL/$ECR_BACKEND_NAME:latest"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/app/frontend"
BACKEND_DIR="$ROOT_DIR/app/backend"

EC2_USER="ubuntu"
EC2_IP="${EC2_IP:?❌ EC2_IP not set}"
EC2_DNS="${EC2_DNS:?❌ EC2_DNS not set}"

SSH_KEY="$HOME/.ssh/devops-key"

echo "🚀 Starting deployment pipeline..."
echo "🌍 AWS Region : $AWS_REGION"
echo "🖥 EC2 IP     : $EC2_IP"
echo "🌐 EC2 DNS    : $EC2_DNS"

### ---------- CHECKS ----------
command -v aws >/dev/null || { echo "❌ AWS CLI not found"; exit 1; }
command -v docker >/dev/null || { echo "❌ Docker not found"; exit 1; }

### ---------- ECR LOGIN (CI Runner) ----------
echo "🔐 Logging into AWS ECR..."
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_URL"

### ---------- BUILD IMAGES ----------
echo "🐳 Building frontend image..."
docker build -t "$IMAGE_FRONTEND" "$FRONTEND_DIR"

echo "🐳 Building backend image..."
docker build -t "$IMAGE_BACKEND" "$BACKEND_DIR"

### ---------- PUSH IMAGES ----------
echo "📤 Pushing images to ECR..."
docker push "$IMAGE_FRONTEND"
docker push "$IMAGE_BACKEND"

### ---------- CREATE docker-compose.prod.yml ----------
echo "📝 Generating docker-compose.prod.yml..."

cat > /tmp/docker-compose.prod.yml <<EOF
version: "3.8"

services:
  mongo:
    image: mongo:6
    container_name: mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    image: $IMAGE_BACKEND
    container_name: sports_backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/sportsdb
    depends_on:
      - mongo

  frontend:
    image: $IMAGE_FRONTEND
    container_name: sports_frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo_data:
EOF

### ---------- COPY COMPOSE TO EC2 ----------
echo "📡 Copying docker-compose to EC2..."
scp -o StrictHostKeyChecking=no -i "$SSH_KEY" /tmp/docker-compose.prod.yml \
  "$EC2_USER@$EC2_IP:/home/$EC2_USER/docker-compose.yml"

### ---------- DEPLOY ON EC2 ----------
echo "🛠 Deploying on EC2..."

ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "$EC2_USER@$EC2_IP" <<EOF
sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose awscli
sudo systemctl start docker
sudo systemctl enable docker

cd ~

# Login to ECR from EC2
aws ecr get-login-password --region $AWS_REGION \
  | sudo docker login --username AWS --password-stdin $ECR_URL

sudo docker-compose pull
sudo docker-compose down
sudo docker-compose up -d

sudo docker ps
EOF

echo "✅ Deployment completed successfully!"
echo "🌐 Frontend URL: http://$EC2_DNS"
echo "🔗 Backend URL : http://$EC2_DNS:5000"
