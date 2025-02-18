const homeexit = document.querySelector('.home');
const nav_links = document.querySelector('.nav-links');
const show_sidebar = document.querySelector('.navigation');
const logoutElement = document.querySelector('.logout');
const tablePage = document.querySelector('.table');





const menuIcon = document.querySelector('.menu'); 
const navWrapper = document.querySelector('.sidebar');

menuIcon.addEventListener('click', () => {
    navWrapper.classList.toggle('active'); 
});


logoutElement.addEventListener('click', () => {
    window.location.href = "index.html";  // Redirect to index.html when clicked
});

tablePage.addEventListener('click', () => {
    window.location.href = "tablePage.html";  // Redirect to index.html when clicked
});

// Function to show the custom alert
function showCustomAlert(message, type) {
    const alertBox = document.getElementById("custom-alert");
    const alertText = document.getElementById("alert-text");
    
    // Set the message and type
    alertText.textContent = message;
    alertBox.classList.remove("success", "error"); // Remove previous alert types
    alertBox.classList.add(type); // Add the current alert type (success/error)

    // Show the alert box
    alertBox.style.display = "block";

    // Automatically hide the alert after 5 seconds
    setTimeout(() => {
        alertBox.style.display = "none";
    }, 5000);
}

// Close the alert when the close button is clicked
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("close-alert").addEventListener("click", function() {
        document.getElementById("custom-alert").style.display = "none";
    });
});



// show_sidebar.addEventListener('click', () => {
//     wrapper.classList.add('active');
// });