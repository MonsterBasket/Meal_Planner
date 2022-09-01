import { useEffect, useState } from "react";

function RecipeSearch(){
    const [recipes, setRecipes] = useState([]);
    const [expandedRecipes, setExpandedRecipe] = useState({});
    const [target, setTarget] = useState("");
    const [nutrition, setNutrition] = useState(false);
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
        let addRecipe = {...expandedRecipes[target]};
        addRecipe.userId = 1;
        fetch(`http://localhost:4000/recipes/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(addRecipe)
        })
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.log(JSON.stringify(err), JSON.stringify(err.message)));
    }

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
                <h5>👍 {expandedRecipes[target].aggregateLikes} - Time: {expandedRecipes[target].readyInMinutes}mins - Serves: {expandedRecipes[target].servings}</h5>
                <div className={nutrition ? "nutrition" : "ingredients"}>
                    {nutrition ? null :
                        <div>
                            <h4>Ingredients:</h4>
                            <ul>
                                {expandedRecipes[target].extendedIngredients.map((item, index)=> <li key={`${index}-${item.id}`}>{item.original}</li>)}
                            </ul>
                        </div>}
                    <div>
                        <button onClick={_ => setNutrition(!nutrition)}>{nutrition ? "Hide" : "Show"} Description</button>
                        {nutrition ? 
                            <div>
                                <p> <span dangerouslySetInnerHTML={{__html: expandedRecipes[target].summary}}/><br></br><br></br>
                                    {expandedRecipes[target].diets === [] ? null :
                                    
                                    <span><b>Diets</b>{expandedRecipes[target].diets.map(a => <span key={a}>{": " + a + " "}</span>)}</span>}<br></br>
                                    {(expandedRecipes[target].dairyFree) || expandedRecipes[target].glutenFree || expandedRecipes[target].vegetarian || expandedRecipes[target].vegan || expandedRecipes[target].lowFodmap || expandedRecipes[target].sustainable || expandedRecipes[target].veryHealthy ?  
                                    <span><b>Tags</b>{expandedRecipes[target].dairyFree ? ": dairy free " : null}
                                    {expandedRecipes[target].glutenFree ? ": gluten free " : null}
                                    {expandedRecipes[target].vegetarian ? ": vegetarian " : null}
                                    {expandedRecipes[target].vegan ? ": vegan " : null}
                                    {expandedRecipes[target].lowFodmap ? ": low Fodmap " : null}
                                    {expandedRecipes[target].sustainable ? ": sustainable " : null}
                                    {expandedRecipes[target].veryHealthy ? ": very healthy " : null}<br></br></span>
                                    : null}
                                    <b>Health Score</b>: {expandedRecipes[target].healthScore}<br></br>
                                    <b>Weight Watchers Smart Points</b>: {expandedRecipes[target].weightWatcherSmartPoints}
                                </p>
                            </div> 
                        : <img src={expandedRecipes[target].image}></img>}
                    </div>
                </div>
                <div className="method">
                    <h4>Method:</h4>
                    <ol>
                        {expandedRecipes[target].analyzedInstructions[0].steps.map(item => <li key={item.number}>{item.step}</li>)}
                    </ol>
                    <footer>
                        <button onClick={save}>Save to My Recipes</button>
                    </footer>
                </div>
            </div> : null}
        </section>
    </div>
}



export default RecipeSearch;