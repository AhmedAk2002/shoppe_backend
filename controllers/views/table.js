function addRow() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    if (name === "" || email === "") {
        alert("Please fill in both fields.");
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
}

function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}
