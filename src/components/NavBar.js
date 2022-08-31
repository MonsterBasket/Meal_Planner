import { NavLink } from "react-router-dom";

function NavBar(){
    return <nav>
        <NavLink to="/">Home</NavLink> - <
            NavLink to="/myrecipes">My Recipes</NavLink> - <
            NavLink to="/recipesearch">Recipe Search</NavLink> - <
            NavLink to="/calendar">Calendar</NavLink>
    </nav>
}

export default NavBar;