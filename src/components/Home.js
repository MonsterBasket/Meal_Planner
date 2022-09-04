import { useContext } from "react";
import { UserContext } from "../context/user";

function Home(){
    const {user, setUser} = useContext(UserContext);


    return <div><h1>Welcome {user.fname}</h1></div>
}

export default Home;