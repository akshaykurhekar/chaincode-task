import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Model from "../components/model";
import UpdateModel from "../components/updateAssetModule";
import ViewModel from "../components/viewModel";
import { Container, Table, Button} from "react-bootstrap";
import axios from "axios";


const Home = () => {
  const [projectList, setProjectList] = useState([]);
//   const [data, setData] = useState(null);

  const baseURL = "http://localhost:5000";

  const projectData = async () => {
    
    const temp = await axios.post(`${baseURL}/queryAllProjectByOwner`,{userId:userId}).then((response) => {
        console.log(response.data)
        return response.data;
    });

    setProjectList(temp);  
  };

  useEffect(() => {
    projectData();
  },[]);

const userId = localStorage.getItem('user');

const updateAsset = (id, asset) =>{
    console.log("update asset:",id);

    return (<UpdateModel projectId={id} asset={asset} projectData={projectData}/>)  
}

const viewHistory = (id) =>{
     
    return (<ViewModel projectId={id} userId={userId} />)  
}

const deleteAsset = async (id) =>{
    
    await axios.post("http://localhost:5000/deleteProject",{userId:userId, projectId:id}).then((response) => {
        console.log(response)
        console.log("deleteAsset:",id);
        if(response.status === 200){
            projectData();
        }
    });

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
          {projectList.map((item, id) => {
            var assetId = item.assetId;
            var obj = {projectName:item.record.projectName,
                description:item.record.description,
                flatPrice:item.record.flatPrice,
                timestamp:item.record.timestamp
            }

            return (
            <tr key={id}>
                <td>{item.record.projectName}</td>
                <td>{item.record.description}</td>
                <td>{item.record.flatPrice}</td>
                {/* <td> { () => updateAsset(assetId, obj) } </td> */}
                <td> {  updateAsset(assetId, obj) } </td>
                <td> {  viewHistory(assetId) }  </td>
                <td> <Button variant="danger" onClick={ ()=> deleteAsset(assetId)}>Delete</Button> </td>
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
