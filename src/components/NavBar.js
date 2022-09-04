import { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/user";

function NavBar(){
    const {user, setUser} = useContext(UserContext);

    useEffect(_ => {
        if (user.theme){
        document.body.className = user.theme;
        }
    }, [user.theme])

    function logout(e){
        e.preventDefault();
        setUser(null);
    }

    return <nav>
        <div className="navLeft">
            <NavLink to="/">Home</NavLink><span> - </span>
            <NavLink to="/myrecipes">My Recipes</NavLink><span> - </span>
            <NavLink to="/todo">To-Do</NavLink><span> - </span>
            <NavLink to="/calendar">Calendar</NavLink>
        </div>
        <div className="navRight">
            <NavLink to="/usersettings">⚙️</NavLink><span> - </span>
            <a href={window.location.pathname} onClick={logout}>Logout</a> {/* Can't use onclick with NavLink, and need the href in there for css to recognise it as a tag (apparently) */}
        </div>
    </nav>
}

export default NavBar;