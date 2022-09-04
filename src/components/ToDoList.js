import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user";
import getTasks from "./getTasks";
import printTasks from "./printTasks";
import NewTask from "./NewTask";

function ToDoList(){
    const {user} = useContext(UserContext);
    const [tasks, setTasks] = useState([]);
    const [showMeals, setShowMeals] = useState(false);
    const [showComplete, setShowComplete] = useState(true);

    useEffect(_ => {
        getTasks(setTasks, user.id);
    }, [])

    function toggleMeals(){
        setShowMeals(!showMeals);
    }
    function toggleComplete(){
        setShowComplete(!showComplete)
    }

    return <div>
        <h2>To Do List</h2>
        <button onClick={toggleMeals}>{showMeals ? "Hide" : "Show"} Meals</button><button onClick={toggleComplete}>{showComplete ? "Hide" : "Show"} Completed Tasks</button>
        {printTasks(tasks, setTasks, null, showMeals, showComplete)}
        <hr></hr>
        <h4>Add New Task:</h4>
        <NewTask setTasks={setTasks} tasks={tasks} userId={user.id} showMeals={showMeals} showComplete={showComplete}/>
    </div>
}

export default ToDoList;