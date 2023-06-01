import React,{ useState} from 'react';
import { Button, Modal} from 'react-bootstrap'
import axios from 'axios';

const Model = (props)=>{

    const [show, setShow] = useState(false);
    const [disabled, setDisabled] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

 
  const [projectName, setProjectName] = useState(null);
  const [description, setDescription] = useState(null);
  const [flatPrice, setFlatPrice] = useState(null);
 
  const userId = localStorage.getItem('user');

  const baseURL = "http://localhost:5000/createProject";    

  const saveCar = async () => {

        setDisabled(true);

        const aa = {
            'projectName':projectName,
            'description':description, 
            'flatPrice':flatPrice,
            'userId':userId
        }

        await axios.post(baseURL, aa).then((response) => {
            console.log(response.data) ;
        });

        props.fetchProjectList(); // to fetch new list
        setDisabled(false);
        setShow(false);
  }

//   projectName:req.body.projectName,
//   description: req.body.description,
//   flatPrice : req.body.flatPrice,

    return (
       <>
      <Button variant="success" onClick={handleShow}>
        Add Project +
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <input type="text" placeholder='Project name ' onChange={ (e)=> setProjectName(e.target.value)}></input>
           <input type="text" placeholder='Project description ' onChange={ (e)=> setDescription(e.target.value)}></input>
           <input type="text" placeholder='flat Price' onChange={ (e)=> setFlatPrice(e.target.value)}></input>
           
            </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={ saveCar } disabled={disabled}>
            Save 
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    );
};

export default Model;