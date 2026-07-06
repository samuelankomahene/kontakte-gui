// Define the target server address (Localhost / Loopback Network on Port 3000)
const API_URL = 'http://127.0.0.1:3000/api/kontakte';

// Wait for the HTML DOM to fully load into memory before executing scripts
document.addEventListener('DOMContentLoaded', () => {
    fetchKontakte();
});

// Asynchronous function to establish a network connection with the Python Backend
async function fetchKontakte() {
    try {
        // 1. Send the HTTP GET request to the server
        const response = await fetch(API_URL);

        // 2. Check if the server responded with an error (e.g., 500 Internal Server Error)
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        // 3. Parse the JSON payload from the server's response
        const kontakte = await response.json();

        // 4. Send the extracted data to our rendering function
        renderTable(kontakte);
    } catch (error) {
        console.error("Network connection failed:", error);
        alert("System Error: Failed to connect to the backend server. Is the Python Flask engine running?");
    }
}

// Function to dynamically inject database records into the HTML Document Object Model (DOM)
function renderTable(kontakte) {
    const tableBody = document.getElementById('kontakte-body');
    
    // Clear any existing cached data before rendering
    tableBody.innerHTML = ''; 

    kontakte.forEach(kontakt => {
        // Create a new HTML table row for each database record
        const row = document.createElement('tr');

        // Inject the data using Template Literals (the backticks ``)
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

// Placeholder functions for future database operations
function editKontakt(id) {
    console.log(`Edit requested for Database ID: ${id}`);
}

function deleteKontakt(id) {
    console.log(`Delete requested for Database ID: ${id}`);
}