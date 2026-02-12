#!/usr/bin/env bash
# scripts/automate-aws.sh — Full AWS DevOps automation (ECR + Terraform + EC2 + Docker Compose)

set -euo pipefail
IFS=$'\n\t'

### ---------- PATHS (robust for CI & local) ----------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TF_DIR="$ROOT_DIR/terraform"
APP_DIR="$ROOT_DIR/app"

### ---------- CONFIG ----------
AWS_REGION="ap-south-1"
KEY_NAME="devops-key"
INSTANCE_USER="ubuntu"

ECR_FRONTEND_NAME="sports-frontend"
ECR_BACKEND_NAME="sports-backend"

SSH_KEY_PATH="$HOME/.ssh/${KEY_NAME}"

### ---------- CHECKS ----------
command -v aws >/dev/null || { echo "❌ Install AWS CLI"; exit 1; }
command -v terraform >/dev/null || { echo "❌ Install Terraform"; exit 1; }
command -v docker >/dev/null || { echo "❌ Install Docker"; exit 1; }

aws sts get-caller-identity >/dev/null || { echo "❌ Run aws configure / set AWS creds"; exit 1; }

### ---------- SSH KEY ----------
if [[ ! -f "$SSH_KEY_PATH" ]]; then
  echo "🔑 Generating SSH key at $SSH_KEY_PATH"
  ssh-keygen -t rsa -b 4096 -f "$SSH_KEY_PATH" -N ""
fi

### ---------- ECR ----------
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
ECR_URL="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

aws ecr describe-repositories --repository-names "$ECR_FRONTEND_NAME" >/dev/null 2>&1 || \
  aws ecr create-repository --repository-name "$ECR_FRONTEND_NAME" --region "$AWS_REGION"

aws ecr describe-repositories --repository-names "$ECR_BACKEND_NAME" >/dev/null 2>&1 || \
  aws ecr create-repository --repository-name "$ECR_BACKEND_NAME" --region "$AWS_REGION"

aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_URL"

IMAGE_FRONTEND="$ECR_URL/$ECR_FRONTEND_NAME:latest"
IMAGE_BACKEND="$ECR_URL/$ECR_BACKEND_NAME:latest"

### ---------- BUILD + PUSH ----------
echo "🐳 Building frontend image..."
docker build -t "$IMAGE_FRONTEND" "$APP_DIR/frontend"

echo "🐳 Building backend image..."
docker build -t "$IMAGE_BACKEND" "$APP_DIR/backend"

echo "📤 Pushing images to ECR..."
docker push "$IMAGE_FRONTEND"
docker push "$IMAGE_BACKEND"

### ---------- TERRAFORM ----------
pushd "$TF_DIR" >/dev/null
terraform init -input=false
terraform apply -auto-approve \
  -var="aws_region=$AWS_REGION" \
  -var="key_name=$KEY_NAME" \
  -var="public_key_path=${SSH_KEY_PATH}.pub"

EC2_IP="$(terraform output -raw ec2_public_ip)"
EC2_DNS="$(terraform output -raw ec2_public_dns)"
popd >/dev/null

echo "🖥 EC2 IP  : $EC2_IP"
echo "🌐 EC2 DNS : $EC2_DNS"

### ---------- docker-compose (prod) ----------
cat > /tmp/docker-compose.yml <<EOF
version: "3.8"
services:
  mongo:
    image: mongo:6
    restart: always
    volumes:
      - mongo-data:/data/db

  backend:
    image: $IMAGE_BACKEND
    container_name: sports_backend
    restart: always
    ports:
      - "5000:4000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/electromart
      - PORT=4000
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
  mongo-data:
EOF

### ---------- WAIT FOR SSH ----------
echo "⏳ Waiting for SSH on EC2..."
for i in {1..30}; do
  if ssh -o StrictHostKeyChecking=no -i "$SSH_KEY_PATH" "$INSTANCE_USER@$EC2_IP" "echo ok" >/dev/null 2>&1; then
    break
  fi
  sleep 5
done

### ---------- DEPLOY ----------
scp -o StrictHostKeyChecking=no -i "$SSH_KEY_PATH" /tmp/docker-compose.yml \
  "$INSTANCE_USER@$EC2_IP:/home/$INSTANCE_USER/docker-compose.yml"

ssh -o StrictHostKeyChecking=no -i "$SSH_KEY_PATH" "$INSTANCE_USER@$EC2_IP" <<'EOF'
sudo apt-get update -y
sudo apt-get install -y docker.io

sudo systemctl start docker
sudo systemctl enable docker

if ! command -v docker-compose >/dev/null 2>&1; then
  sudo curl -L https://github.com/docker/compose/releases/download/v2.27.1/docker-compose-linux-x86_64 \
    -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
fi

cd ~
sudo docker-compose pull
sudo docker-compose up -d
sudo docker ps
EOF

echo "✅ Application deployed at: http://$EC2_DNS"
