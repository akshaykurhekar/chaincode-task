import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import {Link, useNavigate } from "react-router-dom";
import axios  from 'axios';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here

    axios.post('http://localhost:5000/userLogin', {
        userId:userName
      })
        .then(response => {
          console.log(response);
          // console.log(response.data);
          // Handle response data
        //   alert(response.data.message, "Ready to login");

        localStorage.setItem('user', userName);


          if(response.status === 200){
            navigate('/home');
          }
        })
        .catch(error => {
          console.error(error);
          // Handle error
        });


    console.log('Email:', userName);
    console.log('Password:', password);
    
    // Reset the form fields
    setUserName('');
    setPassword('');
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <h2 className="text-center mb-4">Login</h2>
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
              Login
            </Button>
            <div className='p-2 m-5 text-center' style={{backgroundColor:"lightblue",  borderRadius: '8px', color:"#000000"}}>
                <Link to="/register" style={{color:"#000000"}}>
                    {"Register User ->"}
                </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
