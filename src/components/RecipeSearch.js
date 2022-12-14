import RecipesList from "./RecipesList";
import { useState } from "react";
import '../css/recipeLists.css';


function RecipeSearch(){
    const [recipes, setRecipes] = useState([]);
    let searchTerm = "";

    function getRecipes(){
        setRecipes([]); //this is the only way I can find to make it re-render.
        fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=7778fad0590b4ea1810a333175b1e8cf&query=${searchTerm}`)
            .then(res => res.json())
            .then(json => setRecipes(json.results))
            .catch(err => console.log(err))
    }

    return <div><h2>Recipe Search Page</h2>
        <div className="recipeSearch">
            <input type="text" onChange={e => searchTerm=e.target.value} onKeyDown={e => e.keyCode === 13 ? getRecipes(searchTerm) : null} placeholder="Search Recipes..."/>
            <button onClick={_ => getRecipes(searchTerm)}>Search</button>
        </div>
        {recipes.length === 0 ? null : <RecipesList searched={recipes}/>}
    </div>
}

export default RecipeSearch;