import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { doc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore"; 
import { auth, db } from "../../firebase";
import {  createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";



const New = ({ inputs, title }) => {
  const [file, setFile] = useState(""); 
  const [data, setdata] = useState({})
  const navigate = useNavigate()

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setdata((prev) => ({ ...prev, [id]: value }));
  }

  console.log(data)
  const handleAdd = async (e) => {
    e.preventDefault()
    // Add a new document in collection "cities"
    try{

      const res = await createUserWithEmailAndPassword(auth, data.email, data.password)
 await setDoc(doc(db, "users", res.user.uid), {
  ...data,
  timeStamp: serverTimestamp()
});
navigate(-1)
    }catch(err){
      console.log(err)
    }
    
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input id={input.id} type={input.type} placeholder={input.placeholder} onChange={handleInput} />
                </div>
              ))}
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
