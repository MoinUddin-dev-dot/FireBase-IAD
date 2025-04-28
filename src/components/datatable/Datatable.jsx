import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, deleteDoc , doc, onSnapshot,updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Datatable = () => {
  const [data, setData] = useState([]);

  //listening for data once
  useEffect(() => {
    // const fetchData = async () => {
    //   let list = []
    //   try {
    //     const q = query(collection(db, "users"))
  
    //     const querySnapshot = await getDocs(q);
    //     querySnapshot.forEach((doc) => {
    //       list.push({id: doc.id, ...doc.data()})
    //       console.log(doc.id, " => ", doc.data());
    //     });
    //     setData(list)
    //   } catch (error) {
    //     console.error("Error fetching data: ", error);
    //   }
    // };

    //listeeninfg for real time update
    const unsub = onSnapshot(collection(db, "users"), (snapShot) => {
      let list = [];
      snapShot.docs.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setData(list); 
    });
  
    return () => {
      unsub();
    }
  }, []);
  console.log(data)
  const handleDelete = async (id) => {
    try{
    setData(data.filter((item) => item.id !== id));
    await deleteDoc(doc(db, "users", id));
  }catch(err){
    console.log(err)
  }
  };
console.log("hi")
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/new" style={{ textDecoration: "none" }}>
              <div onClick={() => handleDelete(params.row.id)} className="viewButton">Edit</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New User
        <Link to="/users/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;
