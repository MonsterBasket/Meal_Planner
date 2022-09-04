function printTasks(tasks, setTasks, id, showMeals, showComplete){
        const calendarTasks = tasks.filter(a => a.date === id)
        let todoTasks = tasks.sort((a, b) => {
            const dateAParts = a.date.split("/");
            const dateBParts = b.date.split("/");
            const dateA = Number(dateAParts[2] + dateAParts[1] + dateAParts[0])
            const dateB = Number(dateBParts[2] + dateBParts[1] + dateBParts[0])
            return dateA - dateB;
        }) // ugh, if I'd used stupid American date format I could just compare the dates directly.
        if(!showMeals){
            todoTasks = todoTasks.filter(a => !a.isMeal)
        }
        if(!showComplete){
            todoTasks = todoTasks.filter(a => !a.complete)
        }

    function removeTask(id){
        if(window.confirm("Are you sure you want to delete?\nThis action is permanent.")){
            const updatedTasks = tasks.filter(a => a.id !== id)
            setTasks([...updatedTasks])
            fetch(`http://localhost:4000/todo/${id}`, {
                method: "DELETE"
            })
        }
    }

    function completeTask(id){
        const index = tasks.findIndex(a => a.id === id)
        const truth = !tasks[index].complete;
        const newArray = [...tasks];
        newArray[index].complete = truth;
        setTasks([...newArray])
        fetch(`http://localhost:4000/todo/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({complete: truth})
        })
    }
    
    let tasksToUse = window.location.pathname === "/calendar" ? calendarTasks : todoTasks;
    return tasks.length === 0 ? null : tasksToUse.map(a => 
        <div key={a.id} className={`tasks ${a.complete ? "complete": ""} ${window.location.pathname === "/todo" ? "todo" : ""} ${a.isMeal ? "meal" : ""}`} >
            {window.location.pathname === "/todo" ? <div>{a.date.slice(0,5)}</div> : null}
            {window.location.pathname === "/todo" ? <div>{a.name}</div> : <>{a.name}</>}
            {a.isMeal ? <div className="taskMeal"><img src={a.mealImg}></img> <div>{a.mealName}</div></div> : null}
            {a.description ? <div className="taskDescription">{a.description}</div> : null}
            <button className="deleteButton" onClick={_ => removeTask(a.id)}>❌</button>
            <button className="completeButton" onClick={_ => completeTask(a.id)}>✅</button>
        </div>)
    //when I extracted this into a function I thought it would be longer.  Still long enough to keep here though I think rather than doing inline.
    //Also interesting example/practice that it's possible to do this way.
    //edit: it got longer, definitely worth keeping abstracted :D
    //2nd edit: I need it for another component, it's now a custom hook!
}

export default printTasks;