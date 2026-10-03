/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/
const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * Get references to username, password, and login button DOM elements
 */
const usernameInput=document.getElementById("login-input");
const passwordInput=document.getElementById("password-input");
const login=document.getElementById("login-button")
/* 
 * Login processes when login button is clicked.
 */
login.addEventListener("click", processLogin);
/**
 * Method to process login attempts by scanning username and password combinations.
 */
async function processLogin() {
    const username=usernameInput.value.trim();
    const password=passwordInput.value.trim();
    const requestBody={username, password};
    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(requestBody)
    };
    try {
        const response=await fetch(`${BASE_URL}/login`, requestOptions);
        if(response.status===200)
        {
            const text=await response.text();
            const [token, isAdmin]=text.split(" ");
            sessionStorage.setItem("auth-token", token);
            sessionStorage.setItem("is-admin", isAdmin);
            setTimeout(() => {
                window.location.href="../recipe/recipe-page.html";
            }, 200);
        }else if(response.status===401)
        {
            alert("Incorrect login!");
        }
        else{
            alert("Unknown issue!");
        }
        
    } catch (error) {
        console.error("Login error: ", error);
        alert("Login again!");
    }
}

