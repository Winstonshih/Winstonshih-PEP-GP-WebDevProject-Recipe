/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * References to usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton DOM elements.
 */
const usernameInput=document.getElementById("username-input");
const emailInput=document.getElementById("email-input");
const passwordInput=document.getElementById("password-input");
const repeatPassword=document.getElementById("repeat-password-input");
const register=document.getElementById("register-button");
/* 
 * Ensures the register button calls processRegistration when clicked.
 */
register.addEventListener("click", processRegistration);

/**
 * Method to process user registration.
 * @returns nothing if username, passwors, email, or repeat password are empty or password and repeat password do not match.
 */
async function processRegistration() {
    const username=usernameInput.value.trim();
    const password=passwordInput.value.trim();
    const email=emailInput.value;
    const repeat=repeatPassword.value
    if(!username||!password||!email||!repeat)
    {
        alert("Please fill out all fields to complete registration!");
        return;
    }
    if(password!==repeat)
    {
        alert("Passwords are not matching.");
        return;
    }
    const registerBody={username, email, password};
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registerBody)
    };
    try{
        const response=await fetch(`${BASE_URL}/register`, requestOptions);
        if(response.status===201)
        {
            window.location.href="../login/login-page.html";
        }
        else if(response.status===409)
        {
            alert("Username and email combination exists.");
        }
        else
        {
            alert("Registration failed!");
        }
    }catch(error)
    {
        console.error("Registration error: ", error);
        alert("Please try registering again!");
    }
}
