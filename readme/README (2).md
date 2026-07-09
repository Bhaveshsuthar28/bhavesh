# AAI Pass System - Deployment & Setup Guide

This repository contains the complete codebase for the AAI Pass System, containerized using Docker and orchestrated via Docker Compose.

---

## System Architecture
* **Frontend**: React application built with Vite, served via Nginx (port `80`).
* **Backend**: Fastify Node.js server using Prisma ORM (port `5000`).
* **Database**: PostgreSQL 15 database container (port `5432`).

---

## 1. How to Transfer the Code (For You)
When transferring this project to the handover SSD, **do not copy temporary build files or local dependencies** to keep the folder size minimal and clean. 

Copy the following files and directories:
* `/CLIENT` (Exclude `/CLIENT/node_modules` and `/CLIENT/dist`)
* `/SERVER` (Exclude `/SERVER/node_modules` and `/SERVER/uploads` files, keeping just the empty folders)
* `docker-compose.yml` (Root)
* `.env.example` (Root)
* `README.md` (This file)
* `.gitignore` (Root)

Your final folder structure on the SSD should look like this:
```text
/AAI-VARANASI
  ├── CLIENT/
  │    ├── src/
  │    ├── public/
  │    ├── Dockerfile
  │    ├── nginx.conf
  │    └── package.json
  ├── SERVER/
  │    ├── src/
  │    ├── prisma/
  │    ├── uploads/       # Empty directories
  │    ├── Dockerfile
  │    └── package.json
  ├── .env.example
  ├── docker-compose.yml
  └── README.md
```

---

## 2. Setup & Execution Instructions (For the Receiving Team)

### Prerequisites
Make sure the target system has **Docker** and **Docker Compose** installed:
* [Docker Desktop (Windows/macOS)](https://www.docker.com/products/docker-desktop/)
* [Docker Engine (Linux)](https://docs.docker.com/engine/install/)

---

### Step 1: Set up the Environment Variables
1. In the root project directory (`/AAI-VARANASI`), copy `.env.example` to create a `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your production credentials, ports, and initial admin accounts:
   * **`DB_PORT`**: The port to expose PostgreSQL on the host (default `5432`).
   * **`POSTGRES_USER` / `POSTGRES_PASSWORD`**: Database username and password.
   * **`JWT_SECRET`**: A secure, random string used for generating auth tokens.
   * **`ADMIN_EMAIL` / `ADMIN_PASS`**: The credentials for the initial System Administrator account.

---

### Step 2: Build and Start the Services
Run the following command from the root directory to build and spin up all services in the background:
```bash
docker compose up --build -d
```
During this process, Docker Compose will:
1. Start the PostgreSQL database and wait for it to be healthy.
2. Build and launch the Fastify backend server.
3. Automatically run database migrations (`npx prisma migrate deploy`).
4. Automatically seed the initial admin account (`npx prisma db seed`).
5. Build and serve the React client on Nginx.

---

### Step 3: Access the Application
* **Frontend Web Application**: [http://localhost](http://localhost) (or the server's IP address).
* **Backend Health Check**: [http://localhost/health](http://localhost/health) or [http://localhost:5000/health](http://localhost:5000/health) (to verify backend status).

---

## 3. Useful Commands

### View Service Logs
To monitor application logs (e.g. database logs or server execution stack):
```bash
docker compose logs -f
```

### Stop Services
To stop all running containers without losing database records:
```bash
docker compose down
```

### Reset / Clear Data
To stop services and completely wipe out the PostgreSQL database volume (e.g. for a clean database reset):
```bash
docker compose down -v
```

---

## 4. Deploying to the Public Internet (Production & HTTPS)

To host the application globally on the internet so that users can access it from outside the local network, follow these steps:

### Step A: Set up a Cloud Server (VPS)
1. Provision a Virtual Private Server (VPS) (e.g. AWS EC2, DigitalOcean Droplet, GCP) running a stable Linux OS (such as Ubuntu 22.04 LTS).
2. Install Docker and Docker Compose on the instance.
3. Extract your project ZIP file onto the server.

### Step B: Configure DNS (Domain Name)
1. Register a domain name (e.g., `pass.varanasi-airport.in` or `varanasiairportpass.com`).
2. Add an **A Record** in your domain registrar's DNS dashboard (GoDaddy, Route 53, Cloudflare, etc.) pointing your domain (or a subdomain like `pass.yourdomain.com`) to the **Public IP Address** of your cloud server.

### Step C: Configure the Firewall (Security)
For security, you must restrict direct public access to your database and backend API. Configure the server's firewall (using UFW or Cloud Security Groups) as follows:
* **ALLOW**: Port `80` (HTTP) and Port `443` (HTTPS) to allow public web traffic.
* **DENY / BLOCK**: Port `5432` (PostgreSQL) and Port `5000` (Fastify API) from public access. These ports do not need to be open to the internet since Docker handles communication between containers internally.

### Step D: Enable SSL/HTTPS Encryption
To secure sensitive applicant data (such as Aadhaar numbers and photos) in transit, you must enable HTTPS:
1. **Using a Reverse Proxy Manager (Recommended)**: Spin up an **Nginx Proxy Manager** container alongside your app. It provides a simple web interface to request and automatically renew free **Let's Encrypt SSL Certificates** and route traffic to the React frontend.
2. **Manual Nginx Config with Certbot**: Install Certbot on the host machine, request a certificate for your domain (`sudo certbot certonly --standalone -d pass.yourdomain.com`), and mount the certificate directory `/etc/letsencrypt` into the frontend container's Nginx configuration to enable port 443 SSL termination.

