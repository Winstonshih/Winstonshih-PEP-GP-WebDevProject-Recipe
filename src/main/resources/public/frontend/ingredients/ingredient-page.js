/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * References to various DOM elements like addIngredientNameInput, deleteIngredientNameInput, ingredientListContainer, and adminLink.
 */
const addIngredientNameInput=document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput=document.getElementById("delete-ingredient-name-input");
const ingredientListContainer=document.getElementById("ingredient-list");
const adminLink=document.getElementById("admin-link");
const addIngredientSubmitButton=document.getElementById("add-ingredient-submit-button");
const deleteIngredientSubmitButton=document.getElementById("delete-ingredient-submit-button");
/* 
 * Onclick events for adding or deleting ingredients if buttons are pressed.
 */
addIngredientSubmitButton.addEventListener("click", addIngredient);
deleteIngredientSubmitButton.addEventListener("click", deleteIngredient);
/*
 * An array for tracking all ingredients.
 */
let ingredients=[];
/**
 * Retrieves all ingredients.
 */
getIngredients();
/**
 * Method to add ingredient to recipe.
 */
async function addIngredient() {
    const name=addIngredientNameInput.value.trim();
        try{
            if(!name)
            {
                alert("Invalid ingredient name!");
                return;
            }
            const token=sessionStorage.getItem("auth-token");
            const res= await fetch(`${BASE_URL}/ingredients`,{
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                },
                body: JSON.stringify({name})
            });
            if(res.ok)
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
 * Method to retrieve ingredient from recipe.
 */
async function getIngredients() {
    try{
        const token=sessionStorage.getItem("auth-token");
        const res= await fetch(`${BASE_URL}/ingredients`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        });
        if(res.ok)
        {
            ingredients=await res.json();
            refreshIngredientList();
        }
    }catch(e)
    {
        console.error("Get ingredient error: ", e);
        alert("Failed to get all ingredients.");
    }
}
/**
 * Method to delete ingredient from recipe.
 */
async function deleteIngredient() {
    try{
        const name=deleteIngredientNameInput.value.trim();
        if(!name)
        {
            alert("Input ingredient you want to delete: ");
            return;
        }
        await getIngredients();
        const ingredient = ingredients.find(i => i.name === name);
        if (!ingredient) {
            alert("Ingredient not found!");
            return;
        }
        const token = sessionStorage.getItem("auth-token");
        const res = await fetch(`${BASE_URL}/ingredients/${ingredient.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        });
        if(res.ok)
        {
            deleteIngredientNameInput.value = "";
            await getIngredients();
            refreshIngredientList();
        }
    }catch(e)
    {
        console.error("Delete ingredient error: ", e);
        alert("Failed to delete all ingredients.");
    }
}
/**
 * Method to refresh Ingredient List Function
 */
function refreshIngredientList() {
    ingredientListContainer.innerHTML="";
    ingredients.forEach(ingredient=>{
        const li=document.createElement("li");
        const p=document.createElement("p");
        p.textContent=ingredient.name;
        li.appendChild(p);
        ingredientListContainer.appendChild(li);
    });
}
