import { useRef, useState } from "react";
import RecipesList from "./RecipesList";

function NewTask({date, setNewTaskDate, tasks, setTasks, userId}){
    const [showMeal, setShowMeal] = useState(false);
    const [mealList, setMealList] = useState(false);
    const [task, setTask] = useState({
        name:"",
        isMeal:false,
        mealId:"",
        mealName:"",
        mealImg:"",
        description:"",
        exportDate:"",
        date:""
    })

    function handleChange(e){
        e.preventDefault();
        setTask({...task, [e.target.name]:e.target.value})
        if (e.target.name === "name"){
            setShowMeal(false);
        }
    }

    function setMealName(e){
        e.preventDefault();
        setTask({...task, name:e.target.innerText})
        setShowMeal(true)
    }

    function showMeals(e){
        e.preventDefault();
        setMealList(true);
    }

    function setMeal(id, name, img){
        setTask({...task, mealId:id, mealName:name, mealImg:img})
        setMealList(false);
    }

    function handleDate(e){
        const days = e.target.value.slice(8);
        const month = e.target.value.slice(5, 7);
        const year = e.target.value.slice(0,4);
        setTask({...task, date:e.target.value, exportDate:`${days}-${month}-${year}`})
    }

    function save(e){
        e.preventDefault();
        let newTask = {
            name:task.name,
            isMeal:showMeal,
            mealId:task.mealId,
            mealName:task.mealName,
            mealImg:task.mealImg,
            description:task.description,
            userId:userId,
            date:date ? date : task.exportDate,
        }
        fetch(`http://localhost:4000/todo/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newTask)
        })
            .then(res => res.json())
            .then(json => {
                setTasks([...tasks, newTask]) //this is setTasks from calendar component, NOT setTask from this component
                setNewTaskDate("")
                setTask({name:"",
                isMeal:false,
                mealId:"",
                mealName:"",
                mealImg:"",
                description:"",
                exportDate:"",
                date:""})
            })
            .catch(err => {console.log(JSON.stringify(err)); console.log(JSON.stringify(err.message))});
    }    

    return <form>
        {mealList? <div onClick={_=>setMealList(false)}className="newTaskRecipeList"><RecipesList setMeal={setMeal}/><button className="newTaskRecipeBackButton" onClick={_=>setMealList(false)}>back</button></div> : null}
        <label>Task Name:<br></br>
            <input type="text" name="name" id="nameInput" onChange={handleChange} onSubmit={e => e.preventDefault} value={task.name}></input><br></br>
            <button onClick={setMealName}>Breakfast</button><button onClick={setMealName}>Lunch</button><button onClick={setMealName}>Dinner</button><button onClick={setMealName}>Snack</button>
        </label><br></br><br></br>
        {showMeal ? <><button onClick={(showMeals)}>Choose Meal</button>{task.mealName ? <span><img className="newTaskImg" src={task.mealImg}></img> {task.mealName}</span> : null}<br></br><br></br></> : <><br></br><br></br></>}
        <label>Task Description (optional):<br></br>
            <textarea cols="60" rows="15" name="description" onChange={handleChange} value={task.description}></textarea>
        </label><br></br><br></br>
        {window.location.pathname === "/todo" ?
        <><label>Due Date (optional):<br></br>
            <input type="date" name="date" onChange={handleDate} value={task.date}></input>
        </label><br></br><br></br></> : null}
        <button onClick={save}>Save</button>
    </form>
}

export default NewTask;