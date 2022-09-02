import '../css/recipeLists.css';
import { NavLink } from "react-router-dom";
import RecipesList from "./RecipesList";

function MyRecipes(){

    return <div><h2>My Recipes Page</h2>
        <NavLink to="/recipesearch"><button>Recipe Search</button></NavLink>
        <RecipesList />
    </div>
}

export default MyRecipes;