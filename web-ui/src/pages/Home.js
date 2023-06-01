import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Model from "../components/model";
import UpdateModel from "../components/updateAssetModule";
import ViewModel from "../components/viewModel";
import { Container, Table, Button} from "react-bootstrap";
import axios from "axios";


const Home = () => {
  const [projectList, setProjectList] = useState([]);

  const baseURL = "http://localhost:5000/queryAllProjectByOwner";

  const projectData = async () => {
    
    const temp = await axios.post(`${baseURL}`,{userId:userId}).then((response) => {
        console.log(response.data)
        return response.data;
    });

    setProjectList(temp);
  
  };

  useEffect(() => {
    projectData();
  },[]);

const userId = localStorage.getItem('user');

const updateAsset = (id) =>{
    console.log("update asset:",id);

    return (<UpdateModel />)  

}

const viewHistory = (id) =>{
    console.log("view history:",id);
    return (<ViewModel />)  
}

const deleteAsset = (id) =>{
    console.log("deleteAsset:",id);
}


// [
//     {
//         "assetId": "akshay_1685619910382",
//         "record": {
//             "assetType": "project",
//             "description": "Lord of Lord",
//             "flatPrice": 9000,
//             "owner": "akshay",
//             "projectName": "radha krishna",
//             "timestamp": 1685619910382
//         }
//     },
//     {
//         "assetId": "akshay_1685620004069",
//         "record": {
//             "assetType": "project",
//             "description": "Lord of Lord",
//             "flatPrice": 90800,
//             "owner": "akshay",
//             "projectName": " krishna",
//             "timestamp": 1685620004069
//         }
//     }
// ]

  return (
    <div >
      <Navbar />
      <Container>
        <div className="p-10 m-auto mt-4"> <h3> This Project belong {userId} </h3>  </div>
       {/* <Button className="mt-5" variant="success" onClick={()=>{}}> {"Add Project +"} </Button>  */}
        <Model fetchProjectList={projectData} />

      <Table striped bordered hover className="mt-4">        
      <thead>
        <tr>
          <th>Project Name</th>
          <th>description</th>
          <th>Price</th>
          <th>Update</th>
          <th>View</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
      <tr key={1}>
          <td>{"test"}</td>
          <td>{"test"}</td>
          <td>{"test"}</td>
          <td> { updateAsset("assetId") } </td>
          <td> { viewHistory( "assetId") }  </td>
          <td> <Button variant="danger" onClick={ () => deleteAsset("assetId")}>Delete</Button> </td>
        </tr>
        {projectList.map((item, id) => {
            var assetId = item.assetId;
            return (
        <tr key={id}>
          <td>{item.record.projectName}</td>
          <td>{item.record.description}</td>
          <td>{item.record.flatPrice}</td>
          <td> { updateAsset(assetId) } </td>
          <td> <Button variant="success" onClick={ () => viewHistory(assetId)}>View</Button>  </td>
          <td> <Button variant="danger" onClick={ () => deleteAsset(assetId)}>Delete</Button> </td>
        </tr>
            )
        })}
      </tbody>
    </Table>
      </Container>
    </div>
  );
}

export default Home;
