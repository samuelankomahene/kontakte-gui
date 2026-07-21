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
// 1. Hook into the Form: We tell the system to monitor the specific HTML form for activity.
const kontaktForm = document.getElementById('kontakt-form');

// 2. The Event Listener: We attach a "listener" that waits for the user to click the submit button.
// The Master Form Router: Handles both CREATE (POST) and UPDATE (PUT) operations
kontaktForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    // 1. Data Extraction
    const inputName = document.getElementById('name').value;
    const inputEmail = document.getElementById('email').value;
    const inputTelefon = document.getElementById('telefon').value;
    
    // 2. State Detection: Read the hidden field to determine the operation type
    const currentId = document.getElementById('kontakt-id').value;

    const payload = {
        name: inputName,
        email: inputEmail,
        telefon: inputTelefon
    };

    try {
        let response;

        // 3. The Logic Gate (Traffic Routing)
        if (currentId) {
            // Path A: UPDATE State Detected. Execute a PUT request to the specific database ID.
            response = await fetch(`http://127.0.0.1:3000/api/kontakte/${currentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // Path B: CREATE State Detected. Execute a POST request to generate a new record.
            response = await fetch('http://127.0.0.1:3000/api/kontakte', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        // 4. Server Response & State Reset
        if (response.ok) {
            console.log("System Success: Database transaction complete.");
            
            // Wipe the form fields clean
            kontaktForm.reset();
            
            // CRITICAL: Clear the hidden ID so the system returns to default "Create" mode
            document.getElementById('kontakt-id').value = '';
            
            // Reset the UI buttons back to default state
            document.getElementById('save-btn').textContent = "Kontakt Speichern";
            document.getElementById('cancel-btn').style.display = 'none';
            
            // Synchronize the table with the new database state
            fetchKontakte(); 
        } else {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
    } catch (error) {
        console.error("Network Transmission Failed:", error);
        alert("System Error: Could not execute the database transaction.");
    }
});


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

// Function to capture an existing record and inject it into the HTML presentation layer
async function editKontakt(id) {
    try {
        // 1. Data Retrieval: Fetch the current database state from the Python backend.
        // We pull the full list to locate the specific record we want to edit.
        const response = await fetch('http://127.0.0.1:3000/api/kontakte');
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const kontakte = await response.json();
        
        // 2. Data Parsing: Search the JSON array for the exact database ID
        const targetKontakt = kontakte.find(k => k.id === id);

        if (!targetKontakt) {
            console.error(`System Error: Record ID ${id} not found in the payload.`);
            return;
        }

        // 3. State Injection: Populate the HTML form fields with the database values
        document.getElementById('name').value = targetKontakt.name;
        document.getElementById('email').value = targetKontakt.email;
        document.getElementById('telefon').value = targetKontakt.telefon;

        // 4. Context Tracking: Inject the ID into the hidden field.
        // This is the critical step. If this field has a value, our system knows it is in "Edit Mode".
        document.getElementById('kontakt-id').value = targetKontakt.id;

        // 5. Visual Feedback: Alter the UI to clearly indicate the system state to the user
        document.getElementById('save-btn').textContent = "Änderungen speichern";
        document.getElementById('cancel-btn').style.display = 'inline-block';

        // 6. Convenience: Automatically scroll the viewport to the top where the form is located
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error("System Data Retrieval Failed:", error);
        alert("System Error: Could not pull the record from the database.");
    }
}

// Function to execute a targeted DELETE network request to the Python server
async function deleteKontakt(id) {
    
    // 1. System Safeguard: Never delete infrastructure data without user confirmation.
    // This prevents accidental clicks from destroying database records.
    const isConfirmed = confirm("System Warning: Are you sure you want to delete this contact?");
    
    if (!isConfirmed) {
        return; // Abort the operation if the user clicks "Cancel"
    }

    try {
        // 2. Network Transmission: We append the specific ID directly to the API URL.
        // Example: If ID is 5, the request goes to http://127.0.0.1:3000/api/kontakte/5
        const response = await fetch(`http://127.0.0.1:3000/api/kontakte/${id}`, {
            method: 'DELETE' // Explicitly command the Python server to destroy the record
        });

        // 3. Server Response Handling
        if (response.ok) {
            console.log(`System Success: Record ID ${id} securely wiped from the database.`);
            
            // 4. State Synchronization: The database has changed. 
            // We must command the frontend to pull a fresh copy of the data.
            fetchKontakte(); 
        } else {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
    } catch (error) {
        // 5. System Logging
        console.error("Network Transmission Failed:", error);
        alert("System Error: Could not reach the server to execute the delete command.");
    }
}
