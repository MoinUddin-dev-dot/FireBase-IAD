import "./login.scss"
import { useState, useContext } from "react"
import {  signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
const provider = new GoogleAuthProvider();


const Login = () => {
const {dispatch} = useContext(AuthContext)
const [error, seterror] = useState(false)
const [email, setemail] = useState("")
const [password, setpassword] = useState("")
const navigate = useNavigate()


const handleGoogleLogin = (e) => {
  e.preventDefault();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      dispatch({ type: "LOGIN", payload: user });
      
      console.log("User Info:", user);
      console.log("User Name:", user.displayName);
      console.log("User Email:", user.email);
      console.log("User Photo URL:", user.photoURL);  // <-- Profile Pic URL!

      navigate("/");
    })
    .catch((error) => {
      console.error(error);
      seterror(true);
    });
}


const handleLogin = (e) => {
  e.preventDefault()
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    dispatch({type:"LOGIN", payload:user})
    console.log(user);
    navigate("/")
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    seterror(true)
    // ..
  });
 }
  return (
    <div className="login">
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="email" onChange={(e)=> setemail(e.target.value)}/>
        <input type="password" placeholder="password" onChange={(e)=> setpassword(e.target.value)} />
        <button type="submit">Login</button>
        {error && <span>Wrong email and password</span>}
        <button className="google-button" type="submit" onClick={handleGoogleLogin}>Login with Google</button>
      </form>
    </div>
  )
}

export default Login