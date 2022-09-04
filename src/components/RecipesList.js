import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user";

function RecipesList({searched, setMeal}){
    const {user} = useContext(UserContext);
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([])
    const [expandedRecipes, setExpandedRecipes] = useState([]);
    const [target, setTarget] = useState("");
    const [nutrition, setNutrition] = useState(false);

    useEffect(() => {
        init()
    }, [])

    function init(){
            fetch(`http://localhost:4000/recipes?userId=${user.id}`)
            .then(res => res.json())
            .then(json => {
                setExpandedRecipes(json); //prevents requesting information we already have - this will store any recipe we've expanded
                setSavedRecipes(json); //used for checking if searched recipes are already saved - this stores only recipes we've saved
                if (searched === undefined){ 
                    setRecipes(json); //display user saved recipes for /myrecipes only
                }
                else {
                    setRecipes(searched); //this component is called by recipeSearch only when searched contains search results
                }
            })
    }

    function expandRecipe(e, id){
        e.stopPropagation();
        if (expandedRecipes.findIndex(a => a.id === Number(id)) === -1){ 
            setTarget(expandedRecipes.length);
            fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=7778fad0590b4ea1810a333175b1e8cf&includeNutrition=false`)
            .then(res => res.json())
            .then(json => setExpandedRecipes([...expandedRecipes, json]))
            .catch(err => console.log(err))
        }
        else{
            let index = expandedRecipes.findIndex(a => a.id === Number(id));
            setTarget(index)
        }
    }

    function save(){
        let addRecipe = {...expandedRecipes[target]};
        addRecipe.userId = user.id;
        fetch(`http://localhost:4000/recipes/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(addRecipe)
        })
            .then(res => res.json())
            .then(json => setSavedRecipes([...savedRecipes, addRecipe]))
            .catch(err => {console.log(JSON.stringify(err)); console.log(JSON.stringify(err.message))});
    }    

    function deleteRecipe(){
        fetch(`http://localhost:4000/recipes/${expandedRecipes[target].id}?userId=${user.id}`, {method: "DELETE"})
        // setExpandedRecipe(expandedRecipes.filter(a => a.id !== expandedRecipes[target].id));
        if (window.location.pathname !== "/recipesearch"){
            setRecipes(recipes.filter(a => a.id !== expandedRecipes[target].id))
        }
        setTarget("");
    }

    return <div onClick={e=> e.stopPropagation()}>
        <section className="recipeList"> {/* Lays out the initial list of recipes, in /recipesearch it's the search results, in /myrecipes it's the saved recipes */}
            {recipes.map(a => <article key={a.id} id={a.id} className={`listItem ${user.theme}`}onClick={e => expandRecipe(e, e.target.id || e.target.parentNode.id)}>
                <img src={a.image}></img>
                <h4>{savedRecipes.findIndex(b => b.id === a.id) >= 0 ? "⭐": null}{a.title}</h4>
            </article>)}
        </section>
        <section className={`recipeMain ${user.theme} ${target !== "" ? "visible" : "hidden"}`}> {/* When a recipe from the list is clicked, this will show all details in full-screen */}
            {expandedRecipes[target] === undefined ? <div>Loading...</div> : 
            <div>
                <button className="recipeBackButton" onClick={_ => setTarget("")}>Back</button>
                <h2>{savedRecipes.findIndex(b => b.id === expandedRecipes[target].id) >= 0 ? "⭐": null}{expandedRecipes[target].title}</h2>
                <h5>👍 {expandedRecipes[target].aggregateLikes} - Time: {expandedRecipes[target].readyInMinutes}mins - Serves: {expandedRecipes[target].servings}</h5>
                {window.location.pathname === "/calendar" || window.location.pathname === "/todo" ? <h5><button onClick={_ => setMeal(expandedRecipes[target].id, expandedRecipes[target].title, expandedRecipes[target].image)}>Use This Meal</button></h5> : null}
                <div className={nutrition ? "nutrition" : "ingredients"}>
                    {nutrition ? null :
                    <div>
                        <h4>Ingredients:</h4>
                        <ul>
                            {expandedRecipes[target].extendedIngredients.map((item, index)=> <li key={`${index}-${item.id}`}>{item.original}</li>)}
                        </ul>
                    </div>}
                    <div>
                        <button className="nutritionButton" onClick={_ => setNutrition(!nutrition)}>{nutrition ? "Hide" : "Show"} Description</button>
                        {nutrition ? 
                        <div>
                            <p> <br></br><span dangerouslySetInnerHTML={{__html: expandedRecipes[target].summary}}/><br></br><br></br>
                                {expandedRecipes[target].diets === [] ? null :
                                
                                <span><b>Diets</b>{expandedRecipes[target].diets.map(a => <span key={a}>{": " + a + " "}</span>)}</span>}<br></br>
                                {(expandedRecipes[target].dairyFree) || expandedRecipes[target].glutenFree || expandedRecipes[target].vegetarian || expandedRecipes[target].vegan || expandedRecipes[target].lowFodmap || expandedRecipes[target].sustainable || expandedRecipes[target].veryHealthy ?  
                                <span><b>Tags</b>{expandedRecipes[target].dairyFree ? ": Dairy Free " : null}
                                {expandedRecipes[target].glutenFree ? ": Gluten Free " : null}
                                {expandedRecipes[target].vegetarian ? ": Vegetarian " : null}
                                {expandedRecipes[target].vegan ? ": Vegan " : null}
                                {expandedRecipes[target].lowFodmap ? ": Low Fodmap " : null}
                                {expandedRecipes[target].sustainable ? ": Sustainable " : null}
                                {expandedRecipes[target].veryHealthy ? ": Very Healthy " : null}<br></br></span>
                                : null}
                                <b>Health Score</b>: {expandedRecipes[target].healthScore}<br></br>
                                <b>Weight Watchers Smart Points</b>: {expandedRecipes[target].weightWatcherSmartPoints}
                            </p>
                        </div> 
                        : <div><img src={expandedRecipes[target].image}></img></div>}
                    </div>
                </div>
                <div className="method">
                    <h4>Method:</h4>
                    <ol>
                        {expandedRecipes[target].analyzedInstructions[0].steps.map(item => <li key={item.number}>{item.step}</li>)}
                    </ol>
                    <footer>
                        {savedRecipes.findIndex(b => b.id === expandedRecipes[target].id) >= 0 ? <button onClick={deleteRecipe}>Remove from My Recipes</button> : <button onClick={save}>Add to My Recipes</button>}
                    </footer>
                </div>
            </div>}
        </section>
    </div>
}
export default RecipesList;