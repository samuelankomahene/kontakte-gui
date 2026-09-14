# Kontakte GUI - Frontend Presentation Layer

## Overview
This repository contains the frontend presentation layer for a complete decoupled software ecosystem built during my IT-Praktikum at Hamann Solutions. It serves as the graphical user interface (GUI) designed to interact asynchronously with a Python/Flask backend and an SQLite database.

## System Architecture
As a System Integrator in training, I engineered this frontend to be completely independent of the backend server. 
* **Network Pipelines:** Utilizes native JavaScript `fetch()` to execute RESTful API operations (GET, POST, PUT, DELETE).
* **State Management:** Dynamically renders UI components based on the JSON payload received from the server.
* **CORS Compliance:** Configured to securely communicate across different local network ports during development.

## Tech Stack
| Component | Technology |
| :--- | :--- |
| **Markup & Styling** | HTML5, CSS3 (Vanilla) |
| **Logic & Networking** | JavaScript (ES6+) |
| **Version Control** | Git & GitHub |

## Development Setup
Because this is a decoupled static frontend, no complex build tools are required for local testing.

1. Clone the repository:
   ```bash
   git clone [https://github.com/samuelankomahene/kontakte-gui.git](https://github.com/samuelankomahene/kontakte-gui.git)