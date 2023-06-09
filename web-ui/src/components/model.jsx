import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

const Model = (props) => {
  const [show, setShow] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [projectName, setProjectName] = useState(null);
  const [description, setDescription] = useState(null);
  const [flatPrice, setFlatPrice] = useState(null);

  const userId = localStorage.getItem("user");

  const baseURL = "http://localhost:5000/createProject";

  const saveCar = async () => {
    setDisabled(true);

    const aa = {
      projectName: projectName,
      description: description,
      flatPrice: flatPrice,
      userId: userId,
    };

    await axios.post(baseURL, aa).then((response) => {
      console.log(response.data);
    });

    props.fetchProjectList(); // to fetch new list
    setDisabled(false);
    setShow(false);
  };

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
          <Modal.Title>Add Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
            <label htmlFor="projectName">Project Name:</label>
            <input
              type="text"
              id="projectName"
              placeholder="Enter project name"
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
            <label htmlFor="description">Project Description:</label>
            <input
              type="text"
              id="description"
              placeholder="Enter project description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
            <label htmlFor="flatPrice">Flat Price:</label>
            <input
              type="text"
              id="flatPrice"
              placeholder="Enter flat price"
              onChange={(e) => setFlatPrice(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={saveCar} disabled={disabled}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Model;
