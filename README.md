# Kontakte GUI: Decoupled Presentation Layer

## Architecture Overview
This repository contains the static presentation layer (HTML/CSS/JS) for the Kontakte application ecosystem. It demonstrates a strict decoupling of frontend UI from backend infrastructure, a core principle in secure systems design.

### Technology Stack
- **Structure & Styling:** Semantic HTML5, CSS3 Grid/Flexbox
- **Logic:** Vanilla JavaScript (ES6)
- **Networking:** Asynchronous `fetch()` API
- **Deployment:** GitHub Pages (Static Hosting)

## Network Integration & CORS
This frontend contains no backend logic or local database access. It acts purely as a REST client. 

All HTTP CRUD operations (GET, POST, PUT, DELETE) are dynamically routed across the public internet to a secure Python/Flask API backend hosted on an Ubuntu Hetzner Cloud VPS (`2.28.105.240`). 

**Security Note:** To permit this cross-origin network traffic, the remote Python infrastructure is explicitly configured with Cross-Origin Resource Sharing (CORS) middleware, ensuring the browser allows the Hetzner server to accept requests originating from this static frontend.

## Local Development Setup
To test this interface locally:
1. Clone this repository.
2. Open `index.html` in any modern web browser.
3. *Note: A live internet connection is required, as the application must reach the remote Hetzner VPS to populate the database tables.*