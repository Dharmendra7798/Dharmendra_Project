variable "aws_region" {
  description = "AWS region"
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t3.micro"
}

variable "key_name" {
  description = "EC2 SSH key pair name"
  default     = "devops-key"
}

variable "my_ip" {
  description = "Your public IP for SSH access"
  type        = string
}
