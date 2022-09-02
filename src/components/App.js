import { Route, Routes } from "react-router-dom";
import { UserContext, UserProvider } from "../context/user";
import NavBar from "./NavBar";
import Home from "./Home";
import MyRecipes from "./MyRecipes";
import RecipeSearch from "./RecipeSearch";
import Calendar from "./Calendar";
import UserSettings from "./UserSettings";
import Landing from "./Landing";
import { useContext } from "react";

function App() {
    // const {user, setUser} = useContext(UserContext);
    return <div>
        <UserProvider>
            {true ? <Landing /> 
            : <>
                <NavBar />
                <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/myrecipes" element={<MyRecipes />} />
                        <Route path="/recipesearch" element={<RecipeSearch />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/usersettings" element={<UserSettings />} />
                </Routes>
            </>}
        </UserProvider>
    </div>
}

export default App;