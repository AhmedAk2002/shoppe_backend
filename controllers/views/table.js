const home = document.querySelector('.home');
const nav_links = document.querySelector('.nav-links');
const menuIcon = document.querySelector('.menu');
const navWrapper = document.querySelector('.sidebar');

menuIcon.addEventListener('click', () => {
    navWrapper.classList.toggle('active'); 
});

function showCustomAlert(message, type = "error") {
    const alertText = document.getElementById("alert-text"); // Get the message area
    alertText.textContent = message; // Set the message content
    const customAlert = document.getElementById("custom-alert"); // Get the custom alert container
    customAlert.className = `custom-alert ${type} show`; // Show the alert with type
    customAlert.style.display = "block"; // Ensure the alert is visible
    setTimeout(() => {
        customAlert.classList.remove("show"); // Hide the alert after 3 seconds
        customAlert.style.display = "none"; // Hide the alert
    }, 3000);
}

async function fetchTableData() {
    try {
        const response = await fetch("http://localhost:3000/getTabledata");  
        const result = await response.json();  
        
        if (!result.success) {
            throw new Error('Failed to fetch table data');
        }

        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = ""; // Clear existing rows

        result.data.forEach(entry => {  // Assuming `result.data` contains the table data
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${entry.name}</td>
                <td>${entry.email}</td>
                <td class="actions">
                    <button class="update-btn" onclick="showUpdateForm('${entry._id}', '${entry.email}')">Update</button>
                    <button class="delete-btn" onclick="deleteRow('${entry._id}', this)">Delete</button>
                </td>
            `;
            tableBody.appendChild(newRow);
        });
    } catch (error) {
        console.error('Error fetching table data:', error);
        showCustomAlert('Error fetching table data', 'error');
    }
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", fetchTableData);

async function addRow() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    if (name === "" || email === "") {
        showCustomAlert("Please fill in both fields.", "error");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/tableData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email })
        });

        if (response.ok) {
            showCustomAlert("Row added successfully!", "success");
            fetchTableData(); // Refresh table data
        } else {
            showCustomAlert("Failed to add row", "error");
        }
    } catch (error) {
        showCustomAlert("Failed to add row", "error");
    }

    // Clear input fields
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
}

async function deleteRow(id, button) {
    try {
        const response = await fetch(`http://localhost:3000/deletetable?id=${id}`, {
            method: "DELETE"
        });

        const result = await response.json();
        console.log("Delete response:", result);

        if (response.ok) {
            showCustomAlert("Row deleted successfully!", "success");
            button.parentElement.parentElement.remove(); 
        } else {
            showCustomAlert(result.message || "Failed to delete row", "error");
        }
    } catch (error) {
        console.error("Error deleting row:", error);
        showCustomAlert("Server error. Please try again.", "error");
    }
}

function loadTableData() {
    const tableBody = document.getElementById('table-body');
    const savedData = localStorage.getItem('tableData');

    if (savedData) {
        const data = JSON.parse(savedData);
        data.forEach(item => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td class="actions">
                    <button class="update-btn" onclick="showUpdateForm('${item._id}', '${item.email}')">Update</button>
                    <button class="delete-btn" onclick="deleteRow('${item._id}', this)">Delete</button>
                </td>
            `;
            tableBody.appendChild(newRow);
        });
    }
}

// Call function on page load
document.addEventListener("DOMContentLoaded", loadTableData);

function searchTable() {
    const searchInput = document.querySelector('.search-input').value.toLowerCase();
    const tableRows = document.querySelectorAll('#table-body tr');
    let found = false;

    tableRows.forEach(row => {
        const nameCell = row.querySelector('td:first-child').textContent.toLowerCase();
        if (nameCell.includes(searchInput)) {
            row.style.display = '';
            found = true;
        } else {
            row.style.display = 'none';
        }
    });

    const noResults = document.getElementById('no-results');
    if (!found) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
}

document.querySelector('.search-input').addEventListener('input', searchTable);

function showUpdateForm(id, currentEmail) {
    const newEmail = prompt("Enter new email:", currentEmail);
    if (newEmail) {
        updateRow(id, newEmail);
    }
}

async function updateRow(id, newEmail) {
    try {
        const response = await fetch(`http://localhost:3000/updateTable?id=${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: newEmail })
        });

        const result = await response.json();
        console.log("Update response:", result);

        if (response.ok) {
            showCustomAlert("Email updated successfully!", "success");
            fetchTableData(); // Refresh table data
        } else {
            showCustomAlert(result.message || "Failed to update email", "error");
        }
    } catch (error) {
        console.error("Error updating email:", error);
        showCustomAlert("Server error. Please try again.", "error");
    }
}

if (home) {
    home.addEventListener('click', () => {
        window.location.href = "home.html";  // Redirect to home.html when clicked
    });
} else {
    showCustomAlert("Home button not found", "error");
}






