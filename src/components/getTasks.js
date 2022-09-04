function getTasks(setTasks, id){
    fetch(`http://localhost:4000/todo/?userId=${id}`)
        .then(res => res.json())
        .then(obj => setTasks([...obj]))
}

export default getTasks;