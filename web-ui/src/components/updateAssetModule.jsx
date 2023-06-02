import React,{ useState} from 'react';
import { Button, Modal} from 'react-bootstrap'
import axios from 'axios';

const UpdateModel = (props)=>{

    const [show, setShow] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [projectName, setProjectName] = useState(null);
    const [description, setDescription] = useState(null);
    const [flatPrice, setFlatPrice] = useState(null);
    
    const userId = localStorage.getItem('user');    
    const baseURL = "http://localhost:5000/updateProject";    

  const handleClose = () => setShow(false);
  const handleShow = () => {
    // set props data here
    // console.log(props)
    setProjectName(props.asset.projectName);
    setDescription(props.asset.description);
    setFlatPrice(props.asset.flatPrice);
    setShow(true);
};

 

  const saveProject = async () => {

        setDisabled(true);

        const aa = {
            projectName:projectName,
            description:description, 
            flatPrice:flatPrice,
            timestamp:props.asset.timestamp,
            userId:userId,
            projectId:props.projectId
        }

        await axios.post(baseURL, aa).then((response) => {
            console.log(response) ;
        }).catch((error)=>{
            alert(error);
        });

        props.projectData(); // to fetch new list
        setDisabled(false);
        setShow(false);
  }

//   projectName:req.body.projectName,
//   description: req.body.description,
//   flatPrice : req.body.flatPrice,

    return (
       <>
      <Button variant="success" onClick={handleShow}>
        Update 
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <input type="text" value={projectName ? projectName : ""} placeholder='Project name ' onChange={ (e)=> setProjectName(e.target.value)}></input>
           <input type="text" value={description ? description: ""} placeholder='Project description ' onChange={ (e)=> setDescription(e.target.value)}></input>
           <input type="text" value={flatPrice ? flatPrice: ""} placeholder='flat Price' onChange={ (e)=> setFlatPrice(e.target.value)}></input>
           {/* <input type="text" value={props.asset.timestamp} disabled ></input> */}
         </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={ saveProject } disabled={disabled}>
            Save 
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    );
};

export default UpdateModel;