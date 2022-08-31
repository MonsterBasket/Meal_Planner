import { useEffect, useState } from "react";

function RecipeSearch(){
    const [recipes, setRecipes] = useState([]);
    const [expandedRecipes, setExpandedRecipe] = useState({});
    const [target, setTarget] = useState("");
    let searchTerm = "";

    function getRecipes(){
        fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=7778fad0590b4ea1810a333175b1e8cf&query=${searchTerm}`)
            .then(res => res.json())
            .then(json => setRecipes(json.results))
    }

    function expandRecipe(id){
        if (!expandedRecipes.hasOwnProperty([id])){
            fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=7778fad0590b4ea1810a333175b1e8cf&includeNutrition=false`)
            .then(res => res.json())
            .then(json => {setExpandedRecipe({...expandedRecipes, [id]:json}); setTarget(id)})
            
        }
        else{
            setTarget(id)
        }
    }

    function save(){
        //push to db/user/recipes (expandedRecipes[target])
    }

    useEffect(() => {
        console.log(recipes)
        console.log(expandedRecipes)
    }, [expandedRecipes])

    return <div><h2>Recipe Search Page</h2>
        <div className="recipeSearch">
            <input type="text" onChange={e => searchTerm=e.target.value} onKeyDown={e => e.keyCode === 13 ? getRecipes(searchTerm) : null} placeholder="Search Recipes..."/>
            <button onClick={_ => getRecipes(searchTerm)}>Search</button>
        </div>
        <section className="recipeList">
            {recipes.map(a => <article key={a.id} id={a.id} onClick={e => expandRecipe(e.target.id || e.target.parentNode.id)}>
                    <img src={a.image}></img>
                        <h4>{a.title}</h4>
                </article>
            )}
        </section>
        <section className={`recipeMain ${target !== "" ? "visible" : "hidden"}`}>
        {target !== "" ? <div>
            <button className="recipeBackButton" onClick={_ => setTarget("")}>Back</button>
            <h2>{expandedRecipes[target].title}</h2>
            <div className="ingredients">
                <div>
                    <h5>👍 {expandedRecipes[target].aggregateLikes} - Time: {expandedRecipes[target].readyInMinutes}mins - Serves: {expandedRecipes[target].servings}</h5>
                    <h4>Ingredients:</h4>
                    <ul>
                        {expandedRecipes[target].extendedIngredients.map((item, index)=> <li key={`${index}-${item.id}`}>{item.original}</li>)}
                    </ul>
                </div>
                <div>
                    <img src={expandedRecipes[target].image}></img>
                </div>
            </div>
            <div className="method">
                <h4>Method:</h4>
                <ol>
                    {expandedRecipes[target].analyzedInstructions[0].steps.map(item => <li key={item.number}>{item.step}</li>)}
                </ol>
            </div>
            <footer>
                <button onClick={save}>Save to My Recipes</button>
            </footer>
            </div> : null}
        </section>
    </div>
}



export default RecipeSearch;