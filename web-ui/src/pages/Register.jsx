import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import {Link} from "react-router-dom";
import axios  from 'axios';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // {
//     "userId":"test2",
//     "role":"test2",
//     "password":"test2"
//  }
    
    // Add your login logic here

   axios.post('http://localhost:5000/registerUser', {
  userId:userName,
  role:role
})
  .then(response => {
    console.log(response);
    // console.log(response.data);
    // Handle response data
    alert(response.data.message, "Ready to login");
  })
  .catch(error => {
    console.error(error);
    // Handle error
  });
    
    
    console.log('Email:', userName);
    console.log('Password:', password);
    console.log('role :', role);

    // Reset the form fields
    setUserName('');
    setPassword('');
    setRole('');
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <h2 className="text-center mb-4">Register</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="userName">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <br/>
            <Button variant="primary" type="submit" >
              Register
            </Button>
            <div className='p-2 m-5 text-center' style={{backgroundColor:"lightblue",  borderRadius: '8px', color:"#000000"}}>
                <Link to="/" style={{color:"#000000"}}>
                    {"login ->"}
                </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
