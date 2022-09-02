import { useEffect, useState } from "react";
import "../css/settings.css";

function UserSettings() {
    const [theme, setTheme] = useState("")

    useEffect(_ => {
        if (theme){
        document.body.className = theme;
        }
    }, [theme])

    function darkMode(e){
        setTheme(e.target.checked ? "dark" : "light")
    }
    return <div>
        <h2>User Settings Page</h2>
        <div>
            Dark Mode: <label className="switch"><input type="checkbox" onChange={darkMode}/><span className="slider"/></label>

        </div>
    </div>
}

export default UserSettings;