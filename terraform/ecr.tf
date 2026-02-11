############################################
# ECR Repository – Frontend
############################################
resource "aws_ecr_repository" "frontend" {
  name = "sports-frontend"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project = "dops09"
    Service = "frontend"
  }
}

############################################
# ECR Repository – Backend
############################################
resource "aws_ecr_repository" "backend" {
  name = "sports-backend"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project = "dops09"
    Service = "backend"
  }
}

