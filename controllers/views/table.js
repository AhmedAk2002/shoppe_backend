const home = document.querySelector('.home');
const nav_links = document.querySelector('.nav-links');


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

function addRow() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    if (name === "" || email === "") {
        showCustomAlert("Please fill in both fields.", "error");
        return;
    }

    const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

    const newRow = table.insertRow();
    const detailCell = newRow.insertCell(0);

    // Create a div for the details
    const detailDiv = document.createElement("div");
    detailDiv.innerHTML = `<strong>Name:</strong> ${name} <br> <strong>Email:</strong> ${email} <br>`;

    // Create delete button for the row
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn delete-btn";
    deleteButton.onclick = function () {
        deleteRow(this);
    };

    detailCell.appendChild(detailDiv);
    detailCell.appendChild(deleteButton);

    // Clear input fields after adding the row
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";

    showCustomAlert("Row added successfully!", "success");
}

function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    showCustomAlert("Row deleted successfully!", "success");
}



if (home) {
    home.addEventListener('click', () => {
        window.location.href = "home.html";  // Redirect to home.html when clicked
    });
}else{
    showCustomAlert("Home button not found", "error");
}

