import { Link } from "react-router-dom";
import { useUser } from "../data/UserProvider";

export default function Header() {
    const {user, logout} = useUser();


    return (
        <header className={"w-full flex flex-row justify-between p-4 "}>
            <p className={"text-xl hover:text-blue-600"}><Link to="/">KnowRit</Link> </p>
            <nav className="navbar">
              
                  { user === undefined ?
                   <p>Loading</p> :
                    user === null ?
                    <div>
                        <button className="mx-2 hover:text-blue-600">
                            <Link to='/login'>Login</Link></button>
                        <button className="bg-black p-2 text-white mx-2 hover:text-yellow-600">
                            <Link to='/signup'>Signup</Link></button>
                    </div> :
                    <>
                    {user  !== null && 
                    <>
                        <div className="dropdown h-full">
                            <div className="flex flex-row">
                                <button className="dropbtn">
                                <i className="fa fa-caret-down"></i>
                                </button>
                            </div>
                           
                           <div className="dropdown-content">
                           <Link to={"/users/" + String(user.username)}>Profile</Link>
                           <Link to="/" onClick={logout}>Log out</Link> 
                           </div>
                       </div> 
                       </>
                    }
                    </>
                }
                
          </nav>
        </header>
    )
}