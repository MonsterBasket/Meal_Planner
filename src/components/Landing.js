import { findByPlaceholderText } from "@testing-library/react";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user";

function Landing(){
    const {user, setUser} = useContext(UserContext);
    const [form, setForm] = useState({
        username:"",
        password:"",
        loginError:"",
        newUsername:"",
        newUsernameError:"",
        fName:"",
        lName:"",
        password1:"",
        password2:""
    })
    const [userCheck, setUserCheck] = useState("");
    let timer;

    function handleChange(e){
        console.log(e.nativeEvent)
        if(e.target.type !== "password" && !e.nativeEvent.data === null || e.nativeEvent.inputType === "insertText" && !e.nativeEvent.data.match(/[a-zA-Z0-9 _-]/i)) return //sanitize only for non password fields
        if(e.target.name === "username" || e.target.name === "newUsername" && !e.nativeEvent.data === " ") console.log(e.target.name) //disallow spaces in usernames.
        if(form.loginError && !form.username || !form.password){
            setForm({...form, [e.target.name]:e.target.value, loginError:""})
        }
        else{
            setForm({...form, [e.target.name]:e.target.value})
        }
        if(e.target.name === "newUsername"){
            console.log(e.target.name)
            clearTimeout(timer);
            timer = setTimeout(_ => setUserCheck(e.target.value), 1000) //debounce useEffect on new user username field after 1s
        }
    }

    function login(){
        setForm({...form, loginError:""})
        if(form.username && form.password){
            fetch(`http://localhost:4000/users?username=${form.username}&password=${form.password}`)
                .then(res => res.json())
                .then(json => console.log(json[0].id))
                .catch(_ => setForm({...form, loginError:"Username or Password Incorrect", password:""}))
        }
        else if(form.username && !form.password){
            setForm({...form, loginError:"Please Enter a Password"})
        }
        else{
            setForm({...form, loginError:"Please Enter a Username"})
        }
    }

    useEffect(_ => {
            fetch(`http://localhost:4000/users?username=${form.newUsername}`)
                .then(res => res.json())
                .then(json => setForm({...form, newUsernameError:`❌${form.newUsername} not available`}))
                .catch(setForm({...form, newUsernameError:`✅${form.newUsername} available`}))
    }, [userCheck])

    function signup(){
        //create user (don't forget to trim)
    }

    return <div className="login">
        <h1>Meal Planner</h1>
        <h2>Login</h2>
        <div>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} onKeyDown={e => {if(e.keyCode === 13) login()}} value={form.username}></input><br></br><br></br>
            <input type="password" name="password" placeholder="Password" onChange={handleChange} onKeyDown={e => {if(e.keyCode === 13) login()}} value={form.password}></input><br></br><br></br>
            <button onClick={login}>Login</button><br></br>
            <span>{form.loginError}</span><br></br><br></br>
        </div>
        <hr></hr>
        <h2>Not a member?</h2>
        <h3>Sign-up:</h3>
        <div>
            <input type="text" name="newUsername" placeholder="Choose a Username" onChange={handleChange} value={form.newUsername}></input><br></br>
            <span>{form.newUsernameError}</span><br></br>
            <input type="text" name="fName" placeholder="First Name" onChange={handleChange} value={form.fName}></input><br></br><br></br>
            <input type="text" name="lName" placeholder="Last Name" onChange={handleChange} value={form.lName}></input><br></br><br></br>
            <input type="password" name="password1" placeholder="Password" onChange={handleChange} value={form.password1}></input><br></br>
            <span>{form.password1Error}</span><br></br>
            <input type="password" name="password2" placeholder="Repeat Password" onChange={handleChange} value={form.password2}></input><br></br>
            <span>{form.password2Error}</span><br></br>
            <button onClick={signup}>Sign-Up</button>
        </div>

    </div>
}

export default Landing;