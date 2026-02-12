#!/usr/bin/env bash
# automate-aws.sh — Full AWS DevOps automation (ECR + Terraform + EC2 + Docker)

set -euo pipefail
IFS=$'\n\t'

### ---------- CONFIG ----------
AWS_REGION="${AWS_REGION:-ap-south-1}"
KEY_NAME="devops-key"
INSTANCE_USER="ubuntu"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TF_DIR="$ROOT_DIR/terraform"

ECR_FRONTEND_NAME="sports-frontend"
ECR_BACKEND_NAME="sports-backend"

### ---------- INPUT ----------
MY_IP="${1:-}"
if [[ -z "$MY_IP" ]]; then
  echo "❌ ERROR: my_ip not provided to script."
  echo "Usage: ./scripts/automate-aws.sh <YOUR_PUBLIC_IP/32>"
  exit 1
fi

echo "🌍 Using MY_IP = $MY_IP"

### ---------- CHECKS ----------
command -v aws >/dev/null || { echo "❌ AWS CLI not installed"; exit 1; }
command -v terraform >/dev/null || { echo "❌ Terraform not installed"; exit 1; }
command -v docker >/dev/null || { echo "❌ Docker not installed"; exit 1; }

aws sts get-caller-identity >/dev/null || { echo "❌ AWS credentials not configured"; exit 1; }

### ---------- ECR ----------
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
ECR_URL="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

echo "📦 Ensuring ECR repositories exist..."
aws ecr describe-repositories --repository-names "$ECR_FRONTEND_NAME" >/dev/null 2>&1 || \
aws ecr create-repository --repository-name "$ECR_FRONTEND_NAME"

aws ecr describe-repositories --repository-names "$ECR_BACKEND_NAME" >/dev/null 2>&1 || \
aws ecr create-repository --repository-name "$ECR_BACKEND_NAME"

echo "🔐 Logging into ECR..."
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_URL"

IMAGE_FRONTEND="$ECR_URL/$ECR_FRONTEND_NAME:latest"
IMAGE_BACKEND="$ECR_URL/$ECR_BACKEND_NAME:latest"

### ---------- BUILD + PUSH ----------
echo "🐳 Building frontend image..."
docker build -t "$IMAGE_FRONTEND" "$ROOT_DIR/app/frontend"

echo "🐳 Building backend image..."
docker build -t "$IMAGE_BACKEND" "$ROOT_DIR/app/backend"

echo "📤 Pushing images to ECR..."
docker push "$IMAGE_FRONTEND"
docker push "$IMAGE_BACKEND"

### ---------- TERRAFORM ----------
echo "🌱 Running Terraform..."
cd "$TF_DIR"
terraform init -input=false

terraform apply -auto-approve \
  -var="aws_region=$AWS_REGION" \
  -var="key_name=$KEY_NAME" \
  -var="my_ip=$MY_IP"

EC2_IP="$(terraform output -raw ec2_public_ip)"
EC2_DNS="$(terraform output -raw ec2_public_dns)"

echo "🖥 EC2 Public IP  : $EC2_IP"
echo "🌐 EC2 Public DNS : $EC2_DNS"

### ---------- WAIT FOR EC2 SSH ----------
echo "⏳ Waiting for EC2 SSH..."
for i in {1..30}; do
  if ssh -o StrictHostKeyChecking=no "$INSTANCE_USER@$EC2_IP" "echo ok" >/dev/null 2>&1; then
    break
  fi
  sleep 10
done

### ---------- DEPLOY ON EC2 ----------
echo "🚀 Deploying application on EC2..."

ssh -o StrictHostKeyChecking=no "$INSTANCE_USER@$EC2_IP" <<EOF
sudo docker login -u AWS -p \$(aws ecr get-login-password --region $AWS_REGION) $ECR_URL

sudo docker pull $IMAGE_FRONTEND
sudo docker pull $IMAGE_BACKEND

sudo docker stop frontend || true
sudo docker stop backend || true
sudo docker rm frontend || true
sudo docker rm backend || true

sudo docker run -d --name backend -p 5000:5000 $IMAGE_BACKEND
sudo docker run -d --name frontend -p 80:80 $IMAGE_FRONTEND

sudo docker ps
EOF

echo "✅ Deployment complete!"
echo "🌍 Application URL: http://$EC2_DNS"
