import React from 'react';
import { Navbar,Container,Nav} from 'react-bootstrap';
import {Link} from "react-router-dom";

const NavbarComp = ()=>{
   
    return (
      <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand >Hyperledger Fabric Demo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Home">Home</Nav.Link>
            <Nav.Link as={Link} to="/events">Events</Nav.Link>            
            <Nav.Link as={Link} to="/projects">All Projects</Nav.Link>            
            {/* <Nav.Link as={Link} to="/login">Change user</Nav.Link>             */}
          </Nav>
          <Nav className="ml-auto">
          <Nav.Link as={Link} to="/" style={{fontWeight:"bold",color:"#000000"}}>Change user</Nav.Link>            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    );
};

export default NavbarComp;