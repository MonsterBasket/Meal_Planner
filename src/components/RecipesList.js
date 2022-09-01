import { useEffect, useRef, useState } from "react";

function RecipesList({searched}){
    const [recipes, setRecipes] = useState([]);
    const [expandedRecipes, setExpandedRecipe] = useState([]);
    const [target, setTarget] = useState("");
    const [nutrition, setNutrition] = useState(false);
    const inMyRecipes = useRef(false);

    useEffect(() => {
        init()
    }, [])

    function init(){
        if (searched === undefined){
            fetch('http://localhost:4000/recipes?userId=1')
            .then(res => res.json())
            .then(json => {setRecipes(json); setExpandedRecipe(json)})    
        }
        else {
            setRecipes(searched);
        }
    }

    function expandRecipe(id){
        if (expandedRecipes.findIndex(a => a.id === Number(id)) === -1){ 
            setTarget(expandedRecipes.length);
            fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=7778fad0590b4ea1810a333175b1e8cf&includeNutrition=false`)
            .then(res => res.json())
            .then(json => {
                setExpandedRecipe([...expandedRecipes, json]);
                inMyRecipes.current = false;
            })
        }
        else{
            let index = expandedRecipes.findIndex(a => a.id === Number(id));
            setTarget(index)
            inMyRecipes.current = true;
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
            .then(json => inMyRecipes.current = true)
            .catch(err => console.log(JSON.stringify(err), JSON.stringify(err.message)));
    }    

    function deleteRecipe(){
        fetch(`http://localhost:4000/recipes/${expandedRecipes[target].id}?userId=1`, {method: "DELETE"})
        setExpandedRecipe(expandedRecipes.filter(a => a.id !== expandedRecipes[target].id));
        setRecipes(recipes.filter(a => a.id !== expandedRecipes[target].id))
        setTarget("");
    }

    return <div>
        <section className="recipeList">
            {recipes.map(a => <article key={a.id} id={a.id} onClick={e => expandRecipe(e.target.id || e.target.parentNode.id)}>
                <img src={a.image}></img>
                <h4>{a.title}</h4>
            </article>)}
        </section>
        <section className={`recipeMain ${target !== "" ? "visible" : "hidden"}`}>
            {expandedRecipes[target] === undefined ? <div>Loading...</div> : 
            <div>
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
                        {inMyRecipes.current ? <button onClick={deleteRecipe}>Remove from My Recipes</button> : <button onClick={save}>Add to My Recipes</button>}
                    </footer>
                </div>
            </div>}
        </section>
    </div>
}
export default RecipesList;