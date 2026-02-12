#!/usr/bin/env bash
set -euo pipefail

AWS_REGION="${AWS_REGION:-ap-south-1}"
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
ECR_URL="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

IMAGE_FRONTEND="$ECR_URL/sports-frontend:latest"
IMAGE_BACKEND="$ECR_URL/sports-backend:latest"

EC2_USER="ubuntu"
EC2_IP="${EC2_IP:?EC2_IP not set}"
EC2_DNS="${EC2_DNS:?EC2_DNS not set}"
SSH_KEY="$HOME/.ssh/devops-key"

echo "🚀 Starting secure deployment pipeline..."

# ---------- Push Images ----------
echo "📤 Pushing images to ECR..."
docker push "$IMAGE_FRONTEND"
docker push "$IMAGE_BACKEND"

# ---------- Create docker-compose ----------
cat > /tmp/docker-compose.prod.yml <<EOF
version: "3.8"
services:
  mongo:
    image: mongo:6
    container_name: mongo
    restart: always
    ports:
      - "27017:27017"

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
EOF

# ---------- Deploy to EC2 ----------
echo "📡 Deploying on EC2..."
scp -i "$SSH_KEY" /tmp/docker-compose.prod.yml $EC2_USER@$EC2_IP:/home/$EC2_USER/docker-compose.yml

ssh -i "$SSH_KEY" $EC2_USER@$EC2_IP <<EOF
  aws ecr get-login-password --region $AWS_REGION | sudo docker login --username AWS --password-stdin $ECR_URL
  cd ~
  sudo docker-compose pull
  sudo docker-compose down
  sudo docker-compose up -d
  sudo docker ps
EOF

echo "✅ Secure deployment completed!"
echo "🌐 App URL: http://$EC2_DNS"
