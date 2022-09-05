import { findByPlaceholderText } from "@testing-library/react";
import { useContext, useState, useEffect, useRef } from "react";
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
        password2:"",
        password1Error:"",
        password2Error:""
    })
    const [checks, setChecks] = useState({
        username: false,
        password: false
    })
    const [userCheck, setUserCheck] = useState("");
    let timer = useRef(0);

    function handleChange(e){ //This got progressively ridiculous.  In hindsight, I should have split my errors into their own state, then I could have avoided all the else/ifs and duplication.
        //this is because useState is async: setForm({...form, [e.target.name]:e.target.value}) gets overwritten if I do another setForm for a different key inside a condition.
        //Because my inputs are all controlled, this breaks the input and means the user can't type or change that input at all!
        if(e.target.type !== "password" && !e.nativeEvent.data === null || e.nativeEvent.inputType === "insertText" && !e.nativeEvent.data.match(/[a-zA-Z0-9 _-]/i)) return //sanitize only for non password fields
        // I feel like the above shouldn't work, the last condition shouldn't be checked, but it very clearly IS working, so I'm leaving it as is
        if((e.target.name === "username" || e.target.name === "newUsername" || e.target.name === "password" || e.target.name === "password1") && e.nativeEvent.data === " ") return //disallow spaces in usernames and passwords
        /* After a little research, it seems that client side sanitization is actually a fairly fruitless endeavour.  In terms of security, any sanitization done on the client side
        can easily be side-stepped by those with malicious intent.  So from this I take it that sanitization should be done both client and server side.  Server side for actual
        security, client side to prevent confusion of innocent users submitting something and wondering why it was stripped.  So here I've done some mild sanitization.
        I haven't bothered sanitizing passwords since I can't control server-side sanitization anyway, I'll let my fake users inject code in their passwords if they want :D
        They can also put numbers in their first and last name. */
        if(e.target.name === "newUsername"){
            console.log("newUsername")
            setForm({...form, [e.target.name]:e.target.value, newUsernameError:""})
            clearTimeout(timer.current);
            timer.current = setTimeout(_ => setUserCheck(e.target.value), 1000) //debounce useEffect on new user username field after 1s
        }
        else if((e.target.name === "username" || e.target.name === "password") && form.loginError && (!form.username || !form.password)){ //clear login error if there is one
            setForm({...form, [e.target.name]:e.target.value, loginError:""})
            console.log(!!form.loginError)
        }
        else if(e.target.name === "password1"){
            if(e.target.value === "" || e.target.value.length > 5){ //6 digit passwords are enough since it's a fake website :D
                setForm({...form, [e.target.name]:e.target.value, password1Error:""})
            }
            else{
                setForm({...form, [e.target.name]:e.target.value, password1Error:"❌ Passwords must be at least 6 digits"})
            }
        }
        else if(e.target.name === "password2"){
            if(e.target.value.length < 6){
                setForm({...form, [e.target.name]:e.target.value, password2Error:""})
                setChecks({...checks, password:false})
            }
            else if(e.target.value === form.password1){
                setForm({...form, [e.target.name]:e.target.value, password2Error:"✅ Passwords match!"})
                setChecks({...checks, password:true})
            }
            else{
                setForm({...form, [e.target.name]:e.target.value, password2Error:"❌ Passwords don't match!"})
                setChecks({...checks, password:false})
            }
        }
        else{
            setForm({...form, [e.target.name]:e.target.value})
        }
    }

    useEffect(_ => { //duplicate username check
        if (form.newUsername !== ""){
            fetch(`http://localhost:4000/users?username=${form.newUsername}`)
                .then(res => res.json())
                .then(json => {
                    if (json.length === 0){
                        setForm({...form, newUsernameError:`✅${form.newUsername} available`});
                        setChecks({...checks, username:true})
                    }
                    else{ //sooo this will actually expose the other user's password in the Network tab of dev tools, but I don't know any other way to do it!
                        setForm({...form, newUsernameError:`❌${form.newUsername} not available`})
                        setChecks({...checks, username:false})
                        timer.current = setTimeout(_ => setForm({...form, newUsernameError:""}), 2500)
                    }
                })
                .catch(console.log("something went wrong..."))
        }
        else{
            setChecks({...checks, username:false})
        }
    }, [userCheck])

    function login(username = form.username, password=form.password){
        setForm({...form, loginError:""})
        if(username && password){
            fetch(`http://localhost:4000/users?username=${username}&password=${password}`)
                .then(res => res.json())
                .then(json => {const myObj = json[0]; setUser(myObj)})
                .catch(_ => setForm({...form, loginError:"Username or Password Incorrect", password:""}))
        }
        else if(form.username && !form.password){
            setForm({...form, loginError:"Please Enter a Password"})
        }
        else{
            setForm({...form, loginError:"Please Enter a Username"})
        }
    }

    function signup(){
        if (checks.username && checks.password && form.fName && form.lName){
            fetch(`http://localhost:4000/users/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                fname:form.fName,
                lname:form.lName,
                username:form.newUsername,
                password:form.password1
                })
            })
                .then(res => res.json())
                .then(json => login(form.newUsername, form.password1))
                .catch(err => console.log(JSON.stringify(err), JSON.stringify(err.message)));
        }
        else {
            alert("please enter all fields correctly")
        }
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
            <input type="password" name="password2" placeholder="Repeat Password" onChange={handleChange} onKeyDown={e => {if(e.keyCode === 13) signup()}} value={form.password2}></input><br></br>
            <span>{form.password2Error}</span><br></br>
            <button onClick={signup}>Sign-Up</button>
        </div>

    </div>
}

export default Landing;