import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user";
import getTasks from "./getTasks";

function Calendar(){
    const {user, setUser} = useContext(UserContext);
    const [tasks, setTasks] = useState([]);
    const [dates, setDates] = useState(null);

    useEffect(_ => {
        let today = new Date();
        const thisMonth = today.getMonth(); //8 (jan is 0)
        const thisYear = today.getYear() + 1900; //2022
        today = new Date(thisYear, thisMonth, today.getDate()) //resets the time to 00:00:00
        let firstDayNum = new Date(thisYear, thisMonth).getDay();
        firstDayNum === 0 ? firstDayNum = 6 : firstDayNum--; //make Monday be 0 instead of Sunday
        //let firstDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][firstDayNum]; //not used, but I'm leaving it here to remember it!

        let days = [];
        let date = new Date(thisYear, thisMonth, 1)
        date.setDate(date.getDate() - firstDayNum) //starts the Array at the Monday before the 1st of this month
        for (let i = 0; i < 42; i++) { //42 is 6 weeks, if a month starts on the last day of the week, it'll end on Monday or Tuesday of the 6th week
            if(date.getMonth() > thisMonth && date.getDay() === 1) break; //this breaks out of the for loop if the 6th (or even 5th) week is not required.
            days.push(new Date(date))
            date.setDate(date.getDate() + 1)
        }
        setDates({days:[...days], today:today, thisMonth:thisMonth, thisYear:thisYear})
        getTasks(setTasks, user.id);
    }, [])

    useEffect(() =>{
        console.log(tasks)
    })

    function expandDate(e){
        if (e.target.classList.contains("calendarBack") || e.target.classList.contains("calendarAdd")){
            return //stopPropagation isn't working, and without this my back button is simultaneously removing, and re-adding the className.
        }
        if (e.target.classList.contains("dateCover")){
            e.target.classList.add("expandedDate")
        }
        else if (e.target.parentNode.classList.contains("dateCover")){
            e.target.parentNode.classList.add("expandedDate")
        }
    }

    function contractDate(e){
        e.target.parentNode.classList.contains("expandedDate")
            ? e.target.parentNode.classList.remove("expandedDate")
            : e.target.parentNode.parentNode.classList.remove("expandedDate");
    }

    function printTasks(id){
        return tasks.length === 0 ? null : tasks.filter(a => a.date === id).map(a => <div className="tasks">{a.name}</div>)
        //a is the ID, assuming I save my tasks with a date formate of date.toLocaleDateString("en-AU")... hopefully
        //I also need to match user ID
    }

    function addTask(id){
        //do stuff to add a new task
    }

    return <div><h2>My Calendar</h2>
        <h3>September</h3>
        <section className={`calendar ${user.theme}`}>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(a => <div key={a} className="dayHeaders"><h4>{a}</h4></div>)}
            {dates === null ? null : dates.days.map((a, i) => 
                <div key={i} className={`${a.toString() === dates.today.toString() ? "today" : a.getMonth() === dates.thisMonth ? "currentMonth" : "otherMonth"}`}>
                    <div className="dateCover" onClick={expandDate}>
                        {a.getDate()}
                        {printTasks(a.toLocaleDateString("en-AU"))}
                        <button className="calendarBack" onClick={contractDate}>back</button>
                        <button className="calendarAdd" onClick={_ => addTask(a.toLocaleDateString("en-AU"))}>New Task</button>
                    </div>
                </div>)}
        </section>
    </div>
}

export default Calendar;