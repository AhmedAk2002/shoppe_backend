const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const RegisterLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check if email is empty
    if (email === "") {
        alert("Email cannot be empty.");
        return;
    }

    // Check if the email format is valid
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Check if password is empty
    if (password === "") {
        alert("Password cannot be empty.");
        return;
    }

    // Check password length
    if (password.length < 4) {
        alert("Password should be at least 6 characters long.");
        return;
    }

    // If all validations pass, redirect to home page
    window.location.href = "home.html"; // Redirect to home page
});

document.getElementById("Register-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting
    const name = document.getElementById("userName").value;
    const email = document.getElementById("Email").value;
    const password = document.getElementById("password").value;


    // Check if email is empty
    if (email === "") {
        alert("Email cannot be empty.");
        return;
    }
    if (name === "") {
        alert("Email cannot be empty.");
        return;
    }

    // Check if the email format is valid
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Check if password is empty
    if (password === "") {
        alert("Password cannot be empty.");
        return;
    }

    // Check password length
    if (password.length < 4) {
        alert("Password should be at least 6 characters long.");
        return;
    }

    // // If all validations pass, redirect to home page
    // window.location.href = "home.html"; // Redirect to home page
});

// Register link functionality
RegisterLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

// Login link functionality
loginLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

// Popup functionality
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});
