const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link'); // Fixed camelCase
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const closeAlertButton = document.querySelector('.close-alert');

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

// Close alert when close button is clicked
closeAlertButton.addEventListener('click', () => {
    const customAlert = document.getElementById("custom-alert");
    customAlert.classList.remove("show");
    customAlert.style.display = "none";
});

// LOGIN FORM HANDLING
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent form submission
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    // Validate email
    if (!email) {
        showCustomAlert("Email cannot be empty.", "error");
        return;
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        showCustomAlert("Please enter a valid email address.", "error");
        return;
    }

    // Validate password
    if (!password) {
        showCustomAlert("Password cannot be empty.", "error");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', { // Replace with your backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        
        if (response.ok) {
            showCustomAlert("Login successful!", "success");
            setTimeout(() => {
                window.location.href = "home.html"; // Redirect to home page
            }, 1000);
        } else {
            showCustomAlert(result.message || "Login failed!", "error");
        }
    } catch (error) {
        showCustomAlert("Server error. Please try again later.", "error");
    }
});

// REGISTER FORM HANDLING
document.getElementById("Register-form").addEventListener("submit", async function(event) { 
    event.preventDefault(); // Prevent form submission

    // Capture values from the form fields
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    // Validate input fields
    if (!name || !email || !password) {
        showCustomAlert("Please fill in all required fields.", "error");
        return;
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        showCustomAlert("Please enter a valid email address.", "error");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/signup', { // Replace with your backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();
        
        if (response.ok) {
            showCustomAlert("Registration successful!", "success");
            setTimeout(() => {
                window.location.href = "index.html"; // Redirect to login page
            }, 1000);
        } else {
            showCustomAlert(result.message || "Registration failed!", "error");
        }
    } catch (error) {
        showCustomAlert("Server error. Please try again later.", "error");
    }
});

// Toggle Forms
registerLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

loginLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

// Popup Handling
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});




