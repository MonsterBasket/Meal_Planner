import { Route, Routes, BrowserRouter } from "react-router-dom";
import NavBar from "./NavBar";
import Home from "./Home";
import MyRecipes from "./MyRecipes";
import RecipeSearch from "./RecipeSearch";
import Calendar from "./Calendar";

function App() {
    return <div>
        <NavBar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/myrecipes" element={<MyRecipes />} />
            <Route path="/recipesearch" element={<RecipeSearch />} />
            <Route path="/calendar" element={<Calendar />} />
        </Routes>
    </div>
}

export default App;