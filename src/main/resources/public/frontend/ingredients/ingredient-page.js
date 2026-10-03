/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput=document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput=document.getElementById("delete-ingredient-name-input");
const ingredientListContainer=document.getElementById("ingredient-list");
const adminLink=document.getElementById("admin-link");
const addIngredientSubmitButton=document.getElementById("add-ingredient-submit-button");
const deleteIngredientSubmitButton=document.getElementById("delete-ingredient-submit-button");
/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientSubmitButton.addEventListener("click", addIngredient);
deleteIngredientSubmitButton.addEventListener("click", deleteIngredient);
/*
 * TODO: Create an array to keep track of ingredients
 */
const ingredients=[];
/* 
 * TODO: On page load, call getIngredients()
 */
document.addEventListener("click", getIngredients);

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    const name=addIngredientNameInput.value.trim();
        try{
            if(!name)
            {
                alert("Invalid ingredient name!");
                return;
            }
            const res= await fetch(`${BASE_URL}/ingredients`,{
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                },
                body: JSON.stringify({name})
            });
            if(res.status===200)
            {
                addIngredientNameInput.value="";
                await getIngredients();
                refreshIngredientList();
            }
        }catch(e)
        {
            console.error("Add ingredient error: ", e);
            alert("Failed to add ingredient.");
        }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML="";
    ingredients.forEach(ingredient=>{
        const li=document.createElement("li");
        const p=document.createElement("p");
        p.textContent=ingredient.name;
        li.appendChild(p);
        ingredientListContainer.appendChild(li);
    });
}
