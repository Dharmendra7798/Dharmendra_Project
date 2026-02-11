############################################
# Security Group
############################################
resource "aws_security_group" "app_sg" {
  name   = "devops-app-sg"
  vpc_id = aws_vpc.this.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = [var.my_ip]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "devops-app-sg"
    Project = "dops09"
  }
}

############################################
# EC2 Instance (Infra only)
############################################
resource "aws_instance" "ec2" {
  ami                    = "ami-019715e0d74f695be" # Ubuntu 22.04 ap-south-1
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  key_name               = var.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  user_data = <<EOF
#!/bin/bash
apt-get update -y
apt-get install -y docker.io docker-compose
systemctl start docker
systemctl enable docker
EOF

  tags = {
    Name    = "devops-ec2"
    Project = "dops09"
  }
}

############################################
# Elastic IP
############################################
resource "aws_eip" "eip" {
  instance = aws_instance.ec2.id

  tags = {
    Name    = "devops-eip"
    Project = "dops09"
  }
}
