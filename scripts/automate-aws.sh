#!/usr/bin/env bash
# automate-aws.sh — Full AWS DevOps automation (ECR + Terraform + EC2 + Docker Compose)

set -euo pipefail
IFS=$'\n\t'

### ---------- CONFIG ----------
AWS_REGION="ap-south-1"
KEY_NAME="devops-key"
INSTANCE_USER="ubuntu"
TF_DIR="$(cd "$(dirname "$0")/terraform" && pwd)"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

ECR_FRONTEND_NAME="sports-frontend"
ECR_BACKEND_NAME="sports-backend"

SSH_KEY_PATH="$HOME/.ssh/${KEY_NAME}"

### ---------- CHECKS ----------
command -v aws >/dev/null || { echo "Install AWS CLI"; exit 1; }
command -v terraform >/dev/null || { echo "Install Terraform"; exit 1; }
command -v docker >/dev/null || { echo "Install Docker"; exit 1; }

aws sts get-caller-identity >/dev/null || { echo "Run aws configure"; exit 1; }

### ---------- SSH KEY ----------
if [[ ! -f "$SSH_KEY_PATH" ]]; then
  ssh-keygen -t rsa -b 4096 -f "$SSH_KEY_PATH" -N ""
fi

### ---------- ECR ----------
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
ECR_URL="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

aws ecr describe-repositories --repository-names "$ECR_FRONTEND_NAME" >/dev/null 2>&1 || \
aws ecr create-repository --repository-name "$ECR_FRONTEND_NAME"

aws ecr describe-repositories --repository-names "$ECR_BACKEND_NAME" >/dev/null 2>&1 || \
aws ecr create-repository --repository-name "$ECR_BACKEND_NAME"

aws ecr get-login-password --region "$AWS_REGION" \
| docker login --username AWS --password-stdin "$ECR_URL"

IMAGE_FRONTEND="$ECR_URL/$ECR_FRONTEND_NAME:latest"
IMAGE_BACKEND="$ECR_URL/$ECR_BACKEND_NAME:latest"

### ---------- BUILD + PUSH ----------
docker build -t "$IMAGE_FRONTEND" "$ROOT_DIR/app/frontend"
docker build -t "$IMAGE_BACKEND" "$ROOT_DIR/app/backend"

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

echo "EC2 IP  : $EC2_IP"
echo "EC2 DNS : $EC2_DNS"

### ---------- ENV FILES ----------
cat > "$ROOT_DIR/app/backend/.env" <<EOF
PORT=5000
SERVER_URL=http://$EC2_DNS
EOF

cat > "$ROOT_DIR/app/frontend/.env" <<EOF
REACT_APP_API_URL=http://$EC2_DNS:5000
EOF

### ---------- docker-compose ----------
cat > /tmp/docker-compose.yml <<EOF
version: "3.8"
services:
  backend:
    image: $IMAGE_BACKEND
    ports:
      - "5000:5000"
    restart: always

  frontend:
    image: $IMAGE_FRONTEND
    ports:
      - "80:80"
    restart: always
EOF

### ---------- WAIT FOR SSH ----------
echo "Waiting for SSH..."
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

sudo curl -L https://github.com/docker/compose/releases/download/v2.27.1/docker-compose-linux-x86_64 \
-o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

cd ~
sudo docker-compose pull
sudo docker-compose up -d
sudo docker ps
EOF

echo "✅ Application deployed at http://$EC2_DNS"
