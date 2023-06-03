import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

const UpdateModel = (props) => {
  const [show, setShow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [projectName, setProjectName] = useState(null);
  const [description, setDescription] = useState(null);
  const [flatPrice, setFlatPrice] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  const userId = localStorage.getItem("user");
  const baseURL = "http://localhost:5000/updateProject";

  const handleClose = () => setShow(false);
  const handleShow = () => {
    // set props data here
    // console.log(props)
    setProjectName(props.asset.projectName);
    setDescription(props.asset.description);
    setFlatPrice(props.asset.flatPrice);

    // const milliseconds = 1622555555000; // Replace with your desired milliseconds
    const date = new Date(props.asset.timestamp);
    const formattedDateTime = date.toLocaleString();
    setTimestamp(formattedDateTime);
    setShow(true);
  };

  const saveProject = async () => {
    setDisabled(true);

    const aa = {
      projectName: projectName,
      description: description,
      flatPrice: flatPrice,
      timestamp: props.asset.timestamp,
      userId: userId,
      projectId: props.projectId,
    };

    await axios
      .post(baseURL, aa)
      .then((response) => {
        console.log(response.data);
        alert(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        // alert(error);
      });

    props.projectData(); // to fetch new list
    setDisabled(false);
    setShow(false);
  };

  //   projectName:req.body.projectName,
  //   description: req.body.description,
  //   flatPrice : req.body.flatPrice,

  return (
    <>
      <Button variant="warning" onClick={handleShow}>
        Update
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "10px",
            }}
          >
            <label htmlFor="projectName">Project Name:</label>
            <input
              type="text"
              id="projectName"
              value={projectName ? projectName : ""}
              placeholder="Enter project name"
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "10px",
            }}
          >
            <label htmlFor="description">Project Description:</label>
            <input
              type="text"
              id="description"
              value={description ? description : ""}
              placeholder="Enter project description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "10px",
            }}
          >
            <label htmlFor="flatPrice">Flat Price:</label>
            <input
              type="text"
              id="flatPrice"
              value={flatPrice ? flatPrice : ""}
              placeholder="Enter flat price"
              onChange={(e) => setFlatPrice(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "10px",
            }}
          >
            <label htmlFor="timestamp">Timestamp:</label>
            <input
              type="text"
              id="timestamp"
              value={timestamp}
              placeholder="Timestamp"
              disabled
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={saveProject} disabled={disabled}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateModel;
