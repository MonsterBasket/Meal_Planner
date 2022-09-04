import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user";
import "../css/settings.css";

function UserSettings() {
    const {user, setUser} = useContext(UserContext);


    function darkMode(e){
        let newTheme = e.target.checked ? "dark" : "light"
        setUser({...user, theme:newTheme})
    }

    function save(){
        fetch(`http://localhost:4000/users/${user.id}`,{
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        })
    }

    return <div>
        <h2>User Settings Page</h2>
        <div>
            Dark Mode: <label className="switch"><input type="checkbox" onChange={darkMode} checked={user.theme === "dark"}/><span className="slider"/></label><br></br><br></br>
            That's the only setting you get lol<br></br>
            <button onClick={save}>Save</button>
        </div>
    </div>
}

export default UserSettings;