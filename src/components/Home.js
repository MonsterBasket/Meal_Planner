import { useContext } from "react";
import { UserContext } from "../context/user";

function Home(){
    const {user, setUser} = useContext(UserContext);


    return <div>
        <h1>Welcome {user.fname}</h1>
        <h3>Please use the links at the top to get around.</h3>
    </div>
}

export default Home;