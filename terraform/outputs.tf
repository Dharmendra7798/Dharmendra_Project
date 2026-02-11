output "ec2_public_ip" {
  value = aws_eip.eip.public_ip
}

output "ec2_public_dns" {
  value = aws_instance.ec2.public_dns
}

output "frontend_ecr_url" {
  value = aws_ecr_repository.frontend.repository_url
}

output "backend_ecr_url" {
  value = aws_ecr_repository.backend.repository_url
}
