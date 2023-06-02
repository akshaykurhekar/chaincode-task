import React,{ useState} from 'react';
import { Button, Modal} from 'react-bootstrap'
import axios from 'axios';

const ViewModel = (props)=>{

    const [show, setShow] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [data, setData] = useState(null);

  const baseURL = "http://localhost:5000";

  const handleClose = () => setShow(false);
  const handleShow = async () =>{

        // console.log("view history:",id);
        await axios.post(`${baseURL}/getHistoryOfProject/`, {userId:props.userId, projectId:props.projectId}).then((response) => {
            console.log(response.data) ;
            setData(response.data);
        });
        setShow(true);
    };
 
//   projectName:req.body.projectName,
//   description: req.body.description,
//   flatPrice : req.body.flatPrice,

    return (
       <>
      <Button variant="success" onClick={handleShow}>
        View History 
      </Button>

      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>History of {props.projectId}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
            {data && data.map((item, index) => (
                <div key={index} style={{border:"2px solid black", padding:"5px", margin:"2px"}}>
                    <p>Asset Type: {item.Record.assetType}</p>
                    <p>Description: {item.Record.description}</p>
                    <p>Flat Price: {item.Record.flatPrice}</p>
                    <p>Owner: {item.Record.owner}</p>
                    <p>Project Name: {item.Record.projectName}</p>
                 </div>
           ))}
            </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="primary" onClick={ saveCar } disabled={disabled}>
            Save 
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
    );
};

export default ViewModel;