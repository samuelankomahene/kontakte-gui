# Kontakte GUI: Decoupled Presentation Layer

> **DE:** Statische Frontend-Präsentationsschicht mit asynchroner API-Anbindung an einen Hetzner VPS.
>
> **EN:** Static frontend presentation layer fetching data asynchronously from a remote Hetzner VPS.

---

## 1. Architecture Overview & Network Integration

This repository contains the static presentation layer (`index.html`, `style.css`, `app.js`) for the Kontakte system. It enforces a strict decoupling between the client UI and the backend infrastructure—containing zero server-side logic or local database storage.

1. **Static Client Hosting:** Deployed via GitHub Pages as a lightweight HTML5/CSS3/ES6 client.
2. **Asynchronous REST Communication:** Uses the browser ``fetch()`` API (`async`/`await`) to transmit JSON payloads over HTTPS to the production endpoint (`https://api.sam-ankomahene.de/api/kontakte`).
3. **Cross-Origin Resource Sharing (CORS):** Communicates across origins with the companion backend repository ([kontakte-api](https://github.com/samuelankomahene/kontakte-api)), where Nginx terminates SSL/TLS (Let's Encrypt) and forwards traffic to the internal Gunicorn/Flask WSGI service on Ubuntu 24.04 LTS.

### Technology Stack
* **Structure & Styling:** Semantic HTML5, CSS3 (Responsive Layout)
* **Client Logic:** Vanilla JavaScript (ES6+, DOM Manipulation, State Detection)
* **Network Layer:** Asynchronous ``fetch()`` REST Client over HTTPS (`GET`, `POST`, `PUT`, `DELETE`)
* **Hosting:** GitHub Pages

---

## 2. Frontend-to-API Function Mapping (`app.js`)

| JavaScript Function / Handler | HTTP Method | Target Endpoint | Architectural Role |
| :--- | :--- | :--- | :--- |
| **`fetchKontakte()`** | `GET` | `/api/kontakte` | Retrieves all contact records on `DOMContentLoaded` and invokes `renderTable()` |
| **`kontaktForm` (`submit`)** | `POST` / `PUT` | `/api/kontakte` or `/api/kontakte/<id>` | Detects form state (`kontakt-id`): sends `POST` for new records or `PUT` for existing records |
| **`editKontakt(id)`** | `GET` | `/api/kontakte` | Populates form inputs with the selected contact record and switches UI to edit mode |
| **`deleteKontakt(id)`** | `DELETE` | `/api/kontakte/<id>` | Prompts user confirmation and executes record deletion on the remote SQLite database |

---

## 3. Local Development Setup

Clone the repository and serve the static files locally (requires an active internet connection to reach the remote Hetzner production API):

```bash
git clone https://github.com/samuelankomahene/kontakte-gui.git
cd kontakte-gui
python3 -m http.server 8080
```

Open `http://localhost:8080` in any modern web browser.
