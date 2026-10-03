/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
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
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if(sessionStorage.getItem("auth-token"))
    {
        logoutButton.style.display="inline-block";
    }
    else{
        logoutButton.style.display="none";
    }
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if(sessionStorage.getItem("is-admin")==="true")
    {
        adminLink.style.display="inline-block";
    }
    else{
        adminLink.style.display="none";
    }
    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addButton.addEventListener("click", addRecipe);
    updateButton.addEventListener("click", updateRecipe);
    deleteButton.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);
    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();
    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        const searchTerm=searchInput.value.trim();
        try{
            const response=await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(searchTerm)}`);
            if(response.status!==200)
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
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
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
            if(res.status===200)
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
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const name=updateRecipeName.value.trim();
        const instructions=updateInstructionsName.value.trim();
        try{
            if(!name||!instructions)
            {
                alert("Invalid recipe name or instructions!");
            }
            const token=sessionStorage.addItem("auth-token");
            const res= await fetch(`${BASE_URL}/recipes/{recipe.id}`,{
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                },
                body: JSON.stringify({name, instructions})
            });
            if(res.status===200)
            {
                addRecipeName.value="";
                addRecipeInstructions.value="";
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
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
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
            if(res.status===200)
            {
                deleteRecipeName.value="";
                refreshRecipeList();
            }
        }catch(e)
        {
            console.error("Delete recipe error: ", e);
            alert("Failed to delete recipe");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try{
            const token=sessionStorage.getItem("auth-token");
            const res= await fetch(`${BASE_URL}/recipes`,{
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                }
            });
            if(res.status===200)
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
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeListContainer.innerHTML="";
        recipes.forEach(recipe=>{
            const li=document.createElement("li");
            li.textContent=`${recipe.name}: ${recipe.instructions}`
            recipeListContainer.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
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
                window.location.href="../login/login.html";
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
