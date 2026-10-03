/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * References to various DOM elements like recipe name and instructions fields (add, update, delete), recipe list container, admin link and logout button,
     * and search input button.
    */
   const addRecipeName=document.getElementById("add-recipe-name-input");
   const updateRecipeName=document.getElementById("update-recipe-name-input");
   const deleteRecipeName=document.getElementById("delete-recipe-name-input");
   const addRecipeInstructions=document.getElementById("add-recipe-instructions-input");
   const updateInstructionsName=document.getElementById("update-recipe-instructions-input");
   const recipeListContainer=document.getElementById("recipe-list");
   const addButton=document.getElementById("add-recipe-submit-input");
   const updateButton=document.getElementById("update-recipe-submit-input");
   const deleteButton=document.getElementById("delete-recipe-submit-input");
   const adminLink=document.getElementById("admin-link");
   const logoutButton=document.getElementById("logout-button");
   const searchInput=document.getElementById("search-input");
   const searchButton=document.getElementById("search-button");
    /*
     * Shows logout button if auth-token exists in sessionStorage.
     */
    if(sessionStorage.getItem("auth-token"))
    {
        logoutButton.style.display="inline-block";
    }
    else{
        logoutButton.style.display="none";
    }
    /*
     * Shows admin link if is-admin flag in sessionStorage is "true"
     */
    if(sessionStorage.getItem("is-admin")==="true")
    {
        adminLink.style.display="inline-block";
    }
    else{
        adminLink.style.display="none";
    }
    /*
     *  Attaches event handlers for add recipe, updatee recipe, delete recipe, search, and logout buttons.
     */
    addButton.addEventListener("click", addRecipe);
    updateButton.addEventListener("click", updateRecipe);
    deleteButton.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);
    /*
     * On page load, call getRecipes() to populate the list
     */
    getRecipes();
    /**
     * Search Recipes function based on input field.
     */
    async function searchRecipes() {
        const searchTerm=searchInput.value.trim();
        try{
            const response=await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(searchTerm)}`);
            if(!response.ok)
            {
                throw new Error("Failed to search recipes!")
            }
            recipes=await response.json();
            refreshRecipeList();
        }catch(error)
        {
            console.error("Search error: ", error);
            alert("Try searching again!");
        }
    }

    /**
     * Add recipe method.
     */
    async function addRecipe() {
        const name=addRecipeName.value.trim();
        const instructions=addRecipeInstructions.value.trim();
        try{
            if(!name||!instructions)
            {
                alert("Invalid recipe name or instructions!");
                return;
            }
            const token=sessionStorage.getItem("auth-token");
            const res= await fetch(`${BASE_URL}/recipes`,{
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                },
                body: JSON.stringify({name, instructions})
            });
            if(res.ok)
            {
                addRecipeName.value="";
                addRecipeInstructions.value="";
                await getRecipes();
            }
        }catch(e)
        {
            console.error("Add recipe error: ", e);
            alert("Failed to add recipe");
        }
    }

    /**
     * Update recipe from list method.
     */
    async function updateRecipe() {
        // Implement update logic here
        const name=updateRecipeName.value.trim();
        const instructions=updateInstructionsName.value.trim();
        try{
            if(!name||!instructions)
            {
                alert("Invalid recipe name or instructions!");
                return;
            }
            await getRecipes();
            const recipe=recipes.find(r=>r.name===name);
            if(!recipe)
            {
                alert("Recipe not found!");
                return;
            }
            const token=sessionStorage.getItem("auth-token");
            const res= await fetch(`${BASE_URL}/recipes/${recipe.id}`,{
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                },
                body: JSON.stringify({name, instructions})
            });
            if(res.ok)
            {
                updateRecipeName.value="";
                updateInstructionsName.value="";
                await getRecipes();
                refreshRecipeList();
            }
        }catch(e)
        {
            console.error("Update recipe error: ", e);
            alert("Failed to update recipe");
        }
    }

    /**
     * Delete recipe from list method.
     */
    async function deleteRecipe() {
        const name=deleteRecipeName.value.trim();
        try{
            if(!name)
            {
                alert("Please input recipe name!");
                return;
            }
            await getRecipes()
            const deletedRecipe=recipes.find(r=> r.name===name);
            if(!deletedRecipe)
            {
                alert("Recipe not found!");
                return;
            }
            const token=sessionStorage.getItem("auth-token");
            const res= await fetch(`${BASE_URL}/recipes/${deletedRecipe.id}`,{
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                }
            });
            if(res.ok)
            {
                deleteRecipeName.value="";
                await getRecipes();
            }
            else
            {
                alert("Failed to delete recipe!");
            }
        }catch(e)
        {
            console.error("Delete recipe error: ", e);
            alert("Failed to delete recipe");
        }
    }

    /**
     * Retrieve recipes from list method
     */
    async function getRecipes() {
        try{
            const token=sessionStorage.getItem("auth-token");
            const res= await fetch(`${BASE_URL}/recipes`,{
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                }
            });
            if(res.ok)
            {
                recipes=await res.json();
                refreshRecipeList();
            }
        }catch(e)
        {
            console.error("Get recipes error: ", e);
            alert("Failed to retrieve recipes.")
        }
        
    }

    /**
     * Refresh Recipe List Function
     */
    function refreshRecipeList() {
        recipeListContainer.innerHTML="";
        recipes.forEach(recipe=>{
            const li=document.createElement("li");
            li.textContent=`${recipe.name}: ${recipe.instructions}`
            recipeListContainer.appendChild(li);
        });
    }

    /**
     * Log out from account method.
     */
    async function processLogout() {
        try{
            const token=sessionStorage.getItem("auth-token");
            const res= await fetch(`${BASE_URL}/logout`,{
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                }
            });
            if(res.status===200)
            {
                sessionStorage.clear();
                window.location.href="../login/login-page.html";
            }
            else
            {
                alert("Log out failed!");
            }
        }catch(error)
        {
            console.error("Log out error: ", error);
            alert("Log out again!");
        }
    }
});
