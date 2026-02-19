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

![Architecture Diagram]<img width="1361" height="342" alt="Architecture Diagram" src="https://github.com/user-attachments/assets/33cc29cb-e493-4876-a875-dd07fb435570" />


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

![CI/CD Pipeline]<img width="1918" height="1068" alt="CICD Pipeline_1" src="https://github.com/user-attachments/assets/154474d5-0c8e-455d-ae9c-ddcf2b4930aa" />

![CI/CD Logs]<img width="1916" height="1069" alt="CICD Pipeline_2" src="https://github.com/user-attachments/assets/c7fd460f-35fb-4f25-b52a-5088527d4816" />


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

![AWS ECR]<img width="1567" height="320" alt="EC2_instance" src="https://github.com/user-attachments/assets/69404ed5-147a-4794-96dd-70a613bd0b0d" />


Repositories:

sports-frontend

sports-backend

Images are versioned and securely pulled by EC2 during deployment.

🚀 Live Application (AWS EC2)

📷 Live Application Screenshots

![Frontend Live]<img width="1915" height="1068" alt="Live Application_1" src="https://github.com/user-attachments/assets/48db88ec-cace-4b35-899d-cfb2bf4b6490" />
![Backend API Live]<img width="1914" height="1032" alt="Live Application_2" src="https://github.com/user-attachments/assets/1766709e-73d1-402b-a68b-a2eccb475d25" />


Public URLs:

Frontend: http://<EC2_PUBLIC_IP>

Backend: http://<EC2_PUBLIC_IP>:5000

🖥️ Running Containers on EC2

📷 Docker Containers Screenshot

![Running Containers]<img width="1918" height="1067" alt="Running Containers on EC2" src="https://github.com/user-attachments/assets/e82aaca1-b88f-4913-925f-006cbab6faee" />


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

![Prometheus Targets]<img width="1919" height="1068" alt="Monitoring_1" src="https://github.com/user-attachments/assets/b6dc4727-cd02-4608-b6af-91cf6de4010a" />
![Grafana Node Exporter]<img width="1919" height="1071" alt="Monitoring_2" src="https://github.com/user-attachments/assets/d92aa329-5b50-4ffc-abaa-f8924de52ef9" />
![Grafana Docker Monitoring]<img width="1918" height="1067" alt="Monitoring_3" src="https://github.com/user-attachments/assets/b71074e5-4ff7-441b-8d60-bade6098cd6e" />

Monitoring Coverage:

EC2 CPU, RAM, Disk

Docker container resource usage

Application uptime

Container health

🔐 Security – Trivy Vulnerability Scanning

📷 Trivy Scan Screenshot

<img width="1918" height="1072" alt="Trivy Security Scan" src="https://github.com/user-attachments/assets/0227cb80-e2b1-4ba5-838d-8f9c1a2f0d84" />


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
