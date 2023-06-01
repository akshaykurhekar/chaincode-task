import React,{ useState} from 'react';
import { Button, Modal} from 'react-bootstrap'
import axios from 'axios';

const ViewModel = (props)=>{

    const [show, setShow] = useState(false);
    const [disabled, setDisabled] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

 
  const [data, setData] = useState(null);
 
 
  const userId = localStorage.getItem('user');

  const baseURL = "http://localhost:5000/getHistoryOfProject";    

  const saveCar = async () => {

        setDisabled(true);
        
        const aa = {
            'userId':userId,
            'projectId':props.projectId         
        }

        await axios.post(baseURL, aa).then((response) => {
            console.log(response.data) ;
            setData(response.data);
        });

        // props.fetchProjectList(); // to fetch new list
        setDisabled(false);
        setShow(false);
  }

//   projectName:req.body.projectName,
//   description: req.body.description,
//   flatPrice : req.body.flatPrice,

    return (
       <>
      <Button variant="success" onClick={handleShow}>
        View History 
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>History of {props.projectId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <textarea value={data} disabled/>
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

export default ViewModel;