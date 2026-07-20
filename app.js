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
kontaktForm.addEventListener('submit', async function(event) {
    
    // SYSTEM OVERRIDE: Browsers naturally try to refresh the page when a form is submitted.
    // In a decoupled architecture, this breaks our application. We must block the default behavior.
    event.preventDefault();

    // 3. Data Extraction: Read the raw text strings currently sitting in the input fields.
    const inputName = document.getElementById('name').value;
    const inputEmail = document.getElementById('email').value;
    const inputTelefon = document.getElementById('telefon').value;

    // 4. Payload Packaging: Convert the raw variables into a structured JavaScript Object.
    // This perfectly matches the schema our SQLite database expects.
    const payload = {
        name: inputName,
        email: inputEmail,
        telefon: inputTelefon
    };

    try {
        // 5. Network Transmission: Execute the asynchronous POST request to the Python API.
        const response = await fetch('http://127.0.0.1:3000/api/kontakte', {
            method: 'POST', 
            headers: {
                // The Network Header: This tells the Python Flask server exactly what data format is arriving.
                // If we don't declare application/json, Flask will reject the packet as a security risk.
                'Content-Type': 'application/json'
            },
            // 6. Serialization: Convert the JavaScript Object into a strict JSON string for transit over the network.
            body: JSON.stringify(payload)
        });

        // 7. Server Response Handling: Did the Python server accept the payload?
        if (response.ok) {
            console.log("System Success: Contact successfully written to the database.");
            
            // Clear the form fields so the user can enter a new contact
            kontaktForm.reset();
            
            // Re-trigger our READ function to pull the newly updated list from the server
            // (Assuming your READ function is named fetchKontakte or loadKontakte)
            fetchKontakte(); 
        } else {
            // If Python returns a 400 or 500 series error, throw an exception.
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
    } catch (error) {
        // 8. System Logging: If the network fails entirely (e.g., Python server crashed).
        console.error("Network Transmission Failed:", error);
        alert("System Error: Could not connect to the database server.");
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

// Placeholder functions for future database operations
function editKontakt(id) {
    console.log(`Edit requested for Database ID: ${id}`);
}

function deleteKontakt(id) {
    console.log(`Delete requested for Database ID: ${id}`);
}