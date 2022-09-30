const form = document.getElementById("login-form"); 
const usernameInput = document.getElementById("login-username");
const passwordInput = document.getElementById("login-password");
const loginBtn = document.getElementById("login-submit");

const usernameMsg = document.getElementById("login-username-msg");
const emailMsg = document.getElementById("login-email-msg");
const passwordMsg = document.getElementById("login-password-msg");

const API_BASE_URL = "https://nf-api.onrender.com";



// ------------- Formvalidering
loginBtn.addEventListener("click", validateForm);

function validateForm(e) {
    e.preventDefault(); 

    let submittedUsername = usernameInput.value.trim();
    console.log(`Username: ${submittedUsername}`)

    usernameMsg.innerHTML = "";
    if (submittedUsername.length < 5) {
        usernameMsg.innerHTML = "Username must be at least 5 characters long.";
    }
    if (/\d/.test(submittedUsername)) {
        nameMsg.innerHTML = "Username cannot contain any digits.";
    }


    let submittedPassword = passwordInput.value.trim();
    console.log(`Message: ${submittedPassword}`)

    passwordMsg.innerHTML = "";
    if (submittedPassword.length < 8) {
        passwordMsg.innerHTML = "Password must be at least 8 characters long.";
    }
}


// ------------ Login user 

