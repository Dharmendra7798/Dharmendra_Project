#!/usr/bin/env bash
# automate-aws.sh — Full AWS DevOps automation (ECR + Terraform + EC2 + Docker Compose)

set -euo pipefail
IFS=$'\n\t'

### ---------- CONFIG ----------
AWS_REGION="ap-south-1"
KEY_NAME="devops-key"
INSTANCE_USER="ubuntu"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TF_DIR="$ROOT_DIR/terraform"

ECR_FRONTEND_NAME="sports-frontend"
ECR_BACKEND_NAME="sports-backend"

### ---------- CHECKS ----------
command -v aws >/dev/null || { echo "Install AWS CLI"; exit 1; }
command -v terraform >/dev/null || { echo "Install Terraform"; exit 1; }
command -v docker >/dev/null || { echo "Install Docker"; exit 1; }

aws sts get-caller-identity >/dev/null || { echo "Run aws configure"; exit 1; }

### ---------- PUBLIC IP ----------
MY_IP="$(curl -s https://checkip.amazonaws.com)/32"
echo "Detected public IP: $MY_IP"

### ---------- ECR ----------
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
ECR_URL="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

aws ecr describe-repositories --repository-names "$ECR_FRONTEND_NAME" >/dev/null 2>&1 || \
aws ecr create-repository --repository-name "$ECR_FRONTEND_NAME"

aws ecr describe-repositories --repository-names "$ECR_BACKEND_NAME" >/dev/null 2>&1 || \
aws ecr create-repository --repository-name "$ECR_BACKEND_NAME"

aws ecr get-login-password --region "$AWS_REGION" | \
docker login --username AWS --password-stdin "$ECR_URL"

IMAGE_FRONTEND="$ECR_URL/$ECR_FRONTEND_NAME:latest"
IMAGE_BACKEND="$ECR_URL/$ECR_BACKEND_NAME:latest"

### ---------- BUILD + PUSH ----------
echo "🐳 Building frontend..."
docker build -t "$IMAGE_FRONTEND" "$ROOT_DIR/app/frontend"

echo "🐳 Building backend..."
docker build -t "$IMAGE_BACKEND" "$ROOT_DIR/app/backend"

echo "📤 Pushing images to ECR..."
docker push "$IMAGE_FRONTEND"
docker push "$IMAGE_BACKEND"

### ---------- TERRAFORM ----------
pushd "$TF_DIR" >/dev/null
terraform init -input=false
terraform apply -auto-approve \
  -var="aws_region=$AWS_REGION" \
  -var="key_name=$KEY_NAME" \
  -var="my_ip=$MY_IP"

EC2_IP="$(terraform output -raw ec2_public_ip)"
EC2_DNS="$(terraform output -raw ec2_public_dns)"
popd >/dev/null

echo "EC2 IP  : $EC2_IP"
echo "EC2 DNS : $EC2_DNS"

### ---------- docker-compose.prod.yml ----------
cat > /tmp/docker-compose.prod.yml <<EOF
version: "3.8"
services:
  backend:
    image: $IMAGE_BACKEND
    container_name: sports_backend
    restart: always
    ports:
      - "5000:5000"

  frontend:
    image: $IMAGE_FRONTEND
    container_name: sports_frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
EOF

### ---------- DEPLOY ----------
scp -o StrictHostKeyChecking=no /tmp/docker-compose.prod.yml \
"$INSTANCE_USER@$EC2_IP:/home/$INSTANCE_USER/docker-compose.yml"

ssh -o StrictHostKeyChecking=no "$INSTANCE_USER@$EC2_IP" <<EOF
sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker

cd ~
sudo docker login -u AWS -p \$(aws ecr get-login-password --region $AWS_REGION) $ECR_URL
sudo docker-compose pull
sudo docker-compose up -d
sudo docker ps
EOF

echo "✅ Application deployed at: http://$EC2_DNS"
