# Advance IDE

Advance IDE is a comprehensive, web-based integrated development environment (IDE) that allows users to create, edit, and deploy projects. The platform provides isolated environments for each user, supports multiple programming languages, and offers advanced features like auto-scaling, one-click GitHub integration, and long-running backend support. This ensures that both beginners and professionals can efficiently write, test, and deploy their code without any constraints.

![Untitled-2024-06-28-1550](https://github.com/user-attachments/assets/0c3d9eb1-c6e7-4612-8eea-ef8fed888688)

- **Doc:** [Google Doc Link](https://docs.google.com/document/d/1EinFHr_a-_MAPCQmhV1VUGwbOyy4fmreMzm0lJWHhNs/edit)
- **View Demo** [Demo](https://drive.google.com/file/d/1q6cs_bOna6zD4aUsrZDDQEtRB4mC_NRP/view)

## Unique Features

- **One-Click Push to GitHub:** Seamless integration with GitHub for pushing code to repositories with a single click.
- **Dedicated Deployment Server:** Each project is deployed to a dedicated server, providing optimal performance and isolation.
- **Long-Running Backend Support:** Ability to handle both short and long-running processes for backend/frontend apps.
- **Auto-Scaling Environments:** Automatically scales based on load, ensuring performance even under heavy traffic.
- **Isolated Code Execution:** Each user gets a separate Docker container to run their code, ensuring full isolation and security.
- **Live Collaboration:** Real-time collaboration using WebSocket for multiple users to work together on the same project.
- **Integrated Terminal:** Built-in terminal using Xterm.js, connected to the backend via node-pty for executing shell commands.
- **Code Preview:** Real-time live preview of the code running on a dedicated port.
- **Persistent File Storage:** All files are stored in AWS S3 for persistence, allowing users to access their projects anytime.

## Tech Stack

- **Frontend:** Next.js, React.js, Monaco Editor
- **Backend:** Node.js, Express
- **Containerization**: Docker, Kubernetes  
- **Storage:** AWS S3 for file storage, PostgreSQL for user and project data, MongoDB for playground data
- **Authentication:** Clerk for managing user authentication and event-based webhooks
- **Real-Time Communication:** Socket.io for managing WebSocket connections
- **Orchestration:** Custom container orchestration service with reverse proxy for user-specific containers

## Prerequisites

- **Node.js** (latest LTS)
- **Docker**
- **AWS S3**: Set up an S3 bucket to store project files and starter code.
- **PostgreSQL** and **MongoDB** for database needs.
- **Clerk** account for user authentication management.
- **GitHub** for repository management (for the one-click push feature).

## One-Click Push to GitHub

Advance IDE allows users to push their code to a GitHub repository with a single click:

1. Connect your GitHub account via OAuth.
2. Select the project you want to push.
3. Click on the "Push to GitHub" button to create a new repository or update an existing one.

## Deployment Process

1. **Dedicated Deployment Servers:** Each project is deployed to a dedicated server, ensuring that your backend can handle long-running processes without interference from other users.
2. **Auto-Scaling Infrastructure:** Using AWS EC2 and Elastic Load Balancing, the platform can automatically scale resources based on traffic and usage demands.
3. **Live Preview:** Each project has a live URL (e.g., `http://projectID.92lottery.com`) where users can view their running code.

## Architecture Overview

- **Frontend (Next.js):** Deployed using Vercel for optimal performance with automatic CI/CD pipelines.
- **Backend (Node.js + Express):** Deployed on AWS EC2 with Docker containers managing isolated environments for users.
- **Orchestration:** A custom orchestration service creates, manages, and maps containers to users based on their playground IDs.
- **Real-Time Collaboration:** Using WebSockets to allow multiple users to collaborate and view changes in real-time.
- **Load Balancing:** AWS Elastic Load Balancer distributes traffic between multiple EC2 instances to manage a high volume of users effectively.

## Contributing

We welcome contributions from the community! If you'd like to contribute:

1. Fork the project.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

![Screenshot (1592)](https://github.com/user-attachments/assets/e6acd902-83c6-4528-b55c-b26a8d2892fe)
![Screenshot (1508)](https://github.com/user-attachments/assets/9d07e086-291c-4a97-855e-e0d56db2cd63)

