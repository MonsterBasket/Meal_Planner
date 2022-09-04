import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/user";
import getTasks from "./getTasks";
import NewTask from "./NewTask";
import "../css/calendar.css";

function Calendar(){
    const {user, setUser} = useContext(UserContext);
    const [tasks, setTasks] = useState([]);
    const [dates, setDates] = useState(null);
    const [newMonth, changeMonth] = useState(0);
    const [newTaskDate, setNewTaskDate] = useState("");

    useEffect(_ => {
        let today = new Date();
        today = new Date(today.getYear() +1900, today.getMonth(), today.getDate()) //resets the time to 00:00:00 for comparison to highlight today with CSS
        let newDate;
        newDate = dates ? new Date(dates.thisYear, newMonth, 1) : today; //this is how changing months is triggered.  Interestingly, changing the month to 13 or -1 magically calculates to the next or previous year.
        const thisMonth = newDate.getMonth(); //8 (jan is 0)
        const thisMonthText = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][thisMonth];
        const thisYear = newDate.getYear() + 1900; //2022
        let firstDayNum = new Date(thisYear, thisMonth).getDay();
        firstDayNum === 0 ? firstDayNum = 6 : firstDayNum--; //make Monday be 0 instead of Sunday
        //let firstDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][firstDayNum]; //not used, but I'm leaving it here to remember it!

        let days = [];
        let date = new Date(thisYear, thisMonth, 1)
        date.setDate(date.getDate() - firstDayNum) //starts the Array at the Monday before the 1st of this month
        for (let i = 0; i < 42; i++) { //42 is 6 weeks, if a month starts on the last day of the week, it'll end on Monday or Tuesday of the 6th week
            if(date.getMonth() === thisMonth + 1 && date.getDay() === 1) break; //this breaks out of the for loop if the 6th (or even 5th) week is not required.
            days.push(new Date(date))
            date.setDate(date.getDate() + 1)
        }
        setDates({days:[...days], today:today, thisMonth:thisMonth, thisMonthText:thisMonthText, thisYear:thisYear})
        getTasks(setTasks, user.id);
    }, [newMonth])

    function expandDate(e, id){
        if (e.target.classList.contains("calendarBack") || e.target.classList.contains("calendarAdd")){
            return //stopPropagation isn't working, and without this my back button is simultaneously removing, and re-adding the className. *** edit, I just learnt how stopPropagation works... gotta do it on the child elements, not the parent element...
        }
        if (e.target.classList.contains("dateCover")){
            e.target.classList.add("expandedDate")
            if(e.target.children.length === 2){
                addTask(id)
            }
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
        return tasks.length === 0 ? null : tasks.filter(a => a.date === id).map(a => 
            <div key={a.id} className={`tasks ${a.isMeal ? "meal" : ""}`} >
                {a.name}
                {a.isMeal ? <div className="taskMeal"><img src={a.mealImg}></img> {a.mealName}</div> : null}
                {a.description ? <div className="taskDescription">{a.description}</div> : null}
            </div>)
        //when I extracted this into a function I thought it would be longer.  Still long enough to keep here though I think rather than doing inline.
        //Also interesting example/practice that it's possible to do this way.
    }

    function addTask(id){
        //this just displays and sets up the props for <NewTask>
        setNewTaskDate(id); //need to clear newTaskDate back to "" to close the window
    }

    return <div><h2>My Calendar</h2>
        {dates === null ? <h3>Loading Calendar...</h3>
            : <>
                <h3 className="monthHeader"><div><a onClick={_ => changeMonth(dates.thisMonth - 1)}>🡀</a> <span>{dates.thisMonthText}</span></div> <div><span>{dates.thisYear}</span> <a onClick={_ => changeMonth(dates.thisMonth + 1)}>🡂</a></div></h3>
                <section className={`calendar ${user.theme}`}>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(a => <div key={a} className="dayHeaders"><h4>{a}</h4></div>)}
                    {dates.days.map(a => 
                        <div key={a} className={`${a.toString() === dates.today.toString() ? "today" : a.getMonth() === dates.thisMonth ? "currentMonth" : "otherMonth"}`}>
                            <div className="dateCover" onClick={(e => expandDate(e, a.toLocaleDateString("en-AU")))}>
                                {a.getDate()}
                                {printTasks(a.toLocaleDateString("en-AU"))}
                                <button className="calendarBack" onClick={contractDate}>back</button>
                                <button className="calendarAdd" onClick={_ => addTask(a.toLocaleDateString("en-AU"))}>New Task</button>
                            </div>
                        </div>)}
                </section>
            </>}
        <div onClick={e => setNewTaskDate("")} className={`newItemContainer ${newTaskDate ? "visible" : "hidden"}`}>
            <div onClick={e => e.stopPropagation()} className="newItemForm">
                <NewTask date={newTaskDate} setTasks={setTasks} tasks={tasks} setNewTaskDate={setNewTaskDate} userId={user.id}/>
            </div>
        </div>
    </div>
}

export default Calendar;