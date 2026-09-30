// --- INFRASTRUCTURE CONFIGURATION ---
// Target the Hetzner Production VPS. 
// Local loopback (127.0.0.1) is invalid for decoupled remote clients.
const API_BASE_URL = 'http://2.28.105.240/api/kontakte';

document.addEventListener('DOMContentLoaded', () => {
    fetchKontakte();
});

// --- REST API: READ ALL (GET) ---
async function fetchKontakte() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const kontakte = await response.json();
        renderTable(kontakte);
    } catch (error) {
        console.error("Network connection failed:", error);
        alert("System Error: Failed to connect to the backend server.");
    }
}

// --- REST API: CREATE (POST) & UPDATE (PUT) ROUTER ---
const kontaktForm = document.getElementById('kontakt-form');

kontaktForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const payload = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        telefon: document.getElementById('telefon').value
    };
    
    // State Detection: Route to PUT if ID exists, otherwise POST
    const currentId = document.getElementById('kontakt-id').value;
    const endpoint = currentId ? `${API_BASE_URL}/${currentId}` : API_BASE_URL;
    const httpMethod = currentId ? 'PUT' : 'POST';

    try {
        const response = await fetch(endpoint, {
            method: httpMethod,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            kontaktForm.reset();
            document.getElementById('kontakt-id').value = '';
            document.getElementById('save-btn').textContent = "Kontakt Speichern";
            document.getElementById('cancel-btn').style.display = 'none';
            fetchKontakte(); 
        } else {
            throw new Error(`HTTP Error: ${response.status}`);
        }
    } catch (error) {
        console.error("Network Transmission Failed:", error);
        alert("System Error: Could not execute the database transaction.");
    }
});

// --- PRESENTATION LAYER: DOM INJECTION ---
function renderTable(kontakte) {
    const tableBody = document.getElementById('kontakte-body');
    tableBody.innerHTML = ''; 

    kontakte.forEach(kontakt => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${kontakt.name}</td>
            <td>${kontakt.email}</td>
            <td>${kontakt.telefon}</td>
            <td>
                <button class="edit-btn" onclick="editKontakt(${kontakt.id})">Bearbeiten</button>
                <button class="delete-btn" onclick="deleteKontakt(${kontakt.id})">Löschen</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// --- REST API: READ SINGLE (GET) FOR EDIT STATE ---
async function editKontakt(id) {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const kontakte = await response.json();
        const targetKontakt = kontakte.find(k => k.id === id);

        if (!targetKontakt) {
            console.error(`System Error: Record ID ${id} not found.`);
            return;
        }

        document.getElementById('name').value = targetKontakt.name;
        document.getElementById('email').value = targetKontakt.email;
        document.getElementById('telefon').value = targetKontakt.telefon;
        document.getElementById('kontakt-id').value = targetKontakt.id;

        document.getElementById('save-btn').textContent = "Änderungen speichern";
        document.getElementById('cancel-btn').style.display = 'inline-block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error("System Data Retrieval Failed:", error);
        alert("System Error: Could not pull the record from the database.");
    }
}

// --- REST API: DELETE (DELETE) ---
async function deleteKontakt(id) {
    if (!confirm("System Warning: Are you sure you want to delete this contact?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { 
            method: 'DELETE' 
        });

        if (response.ok) {
            fetchKontakte(); 
        } else {
            throw new Error(`HTTP Error: ${response.status}`);
        }
    } catch (error) {
        console.error("Network Transmission Failed:", error);
        alert("System Error: Could not reach the server to execute the delete command.");
    }
}