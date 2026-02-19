🏏 Sports Accessories – Azure to AWS DevOps Migration & Remediation Project

🔎 Project Overview

This project demonstrates a real-world DevOps migration and remediation scenario, where an application originally deployed on Microsoft Azure with intentional DevOps misconfigurations was analyzed, fixed, and successfully re-architected and deployed on AWS using industry best practices.

The goal of this project is to showcase hands-on skills in:

Cloud migration (Azure → AWS)

CI/CD automation

Containerization & deployment

Infrastructure as Code

Security scanning & remediation

Monitoring & observability

🎯 Objectives

Identify DevOps misconfigurations in Azure setup

Fix networking, CI/CD, container, and security issues

Rebuild the same architecture on AWS Free Tier

Implement end-to-end CI/CD pipeline

Secure container images using Trivy

Add monitoring using Prometheus & Grafana

Provide proof via screenshots and video walkthrough

🏗️ Architecture (AWS Deployment)

📷 Architecture Diagram

![Architecture Diagram](./docs/architecture.png)

User Browser
     |
     v
Frontend (React - Docker)
     |
     v
Backend API (Node.js - Docker)
     |
     v
MongoDB (Docker)
     |
------------------------------------------------
AWS EC2 (Docker Host)
------------------------------------------------
     |
     v
Monitoring Stack:
Prometheus → Grafana
Node Exporter + cAdvisor
     |
     v
CI/CD:
GitHub → GitHub Actions → AWS ECR → EC2


🧰 Tech Stack
Layer	Tools
Cloud	AWS EC2, ECR, VPC, Security Groups
IaC	Terraform
CI/CD	GitHub Actions
Containers	Docker, Docker Compose
Frontend	React
Backend	Node.js
Database	MongoDB
Security	Trivy
Monitoring	Prometheus, Grafana, Node Exporter, cAdvisor
OS	Ubuntu 24.04
🔁 CI/CD Pipeline (GitHub Actions)

📷 CI/CD Pipeline Screenshots

![CI/CD Pipeline](./docs/cicd-1.png)
![CI/CD Logs](./docs/cicd-2.png)

Pipeline Steps:

Developer pushes code to GitHub

GitHub Actions workflow triggered

Docker images built (frontend & backend)

Trivy vulnerability scan executed

Images pushed to AWS ECR

SSH into EC2

Containers deployed using Docker Compose

📦 AWS ECR – Image Registry

📷 AWS ECR Screenshot

![AWS ECR](./docs/ecr.png)


Repositories:

sports-frontend

sports-backend

Images are versioned and securely pulled by EC2 during deployment.

🚀 Live Application (AWS EC2)

📷 Live Application Screenshots

![Frontend Live](./docs/frontend.png)
![Backend API Live](./docs/backend.png)


Public URLs:

Frontend: http://<EC2_PUBLIC_IP>

Backend: http://<EC2_PUBLIC_IP>:5000

🖥️ Running Containers on EC2

📷 Docker Containers Screenshot

![Running Containers](./docs/docker-ps.png)


Running services:

Frontend

Backend

MongoDB

Prometheus

Grafana

Node Exporter

cAdvisor

📊 Monitoring & Observability

📷 Monitoring Dashboards

![Prometheus Targets](./docs/prometheus.png)
![Grafana Node Exporter](./docs/grafana-node.png)
![Grafana Docker Monitoring](./docs/grafana-docker.png)

Monitoring Coverage:

EC2 CPU, RAM, Disk

Docker container resource usage

Application uptime

Container health

🔐 Security – Trivy Vulnerability Scanning

📷 Trivy Scan Screenshot

![Trivy Scan](./docs/trivy.png)

Security Practices:

Image scanning before deployment

Ignored non-runtime CVEs via .trivyignore

No hardcoded secrets in code

IAM least privilege

Restricted Security Group rules

❌ Misconfigurations Identified (Azure – Before Fix)
Category	Misconfiguration	Impact
Networking	Ports open to 0.0.0.0/0	Security exposure
CI/CD	No security scanning	Vulnerable images deployed
Docker	No restart policy	App down after reboot
Secrets	Credentials in config	Security risk
Monitoring	No observability	Blind to failures

📷 Azure Misconfiguration Proof

![Azure Misconfig](./docs/azure-misconfig.png)

✅ Remediation Implemented (AWS – After Fix)
Area	Fix Implemented
Security Groups	Restricted inbound rules
CI/CD	Trivy scanning added
Docker	Restart policies added
Secrets	Environment variables used
Monitoring	Prometheus + Grafana integrated
IAM	Least privilege roles

📷 AWS Fixed Deployment Proof

![AWS Fixed](./docs/aws-fixed.png)

📁 Repository Structure
.
├── app/
│   ├── frontend/
│   └── backend/
├── docker-compose.yml
├── terraform/
├── .github/workflows/deploy.yml
├── README.md

📽️ Walkthrough Vid
