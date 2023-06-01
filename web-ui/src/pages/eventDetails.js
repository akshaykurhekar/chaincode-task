import React, { useState } from 'react';
import { Table, Form, Container } from 'react-bootstrap';
import Navbar from './../components/navbar';

const EventDetails = () => {
  const data = [
    {
      id: 1,
      eventName: 'CreateAsset',
      age: 25,
      email: 'johndoe@example.com'
    },
    {
      id: 2,
      eventName: 'CreateAsset',
      age: 30,
      email: 'janesmith@example.com'
    },
    {
      id: 3,
      eventName: 'UpdateAsset',
      age: 28,
      email: 'alicejohnson@example.com'
    },
    {
      id: 4,
      eventName: 'UpdateAsset',
      age: 24,
      email: 'askhaynson@example.com'
    }
  ];

  const [filterValue1, setFilterValue1] = useState('');

  const handleFilterChange1 = (e) => {
    setFilterValue1(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.eventName.toLowerCase().includes(filterValue1.toLowerCase())
  );

  return (
    <div >
      <Navbar />
      <Container className='mt-5'>
        <Form className="mb-3">
          <Form.Group controlId="filter1">
            <Form.Label><h4>Event Name</h4></Form.Label>
            <div className='w-20' style={{width:"500px"}}>

            <Form.Control
              as="select"
              value={filterValue1}
              onChange={handleFilterChange1}
              >
              <option value="">All</option>
              <option value="CreateAsset">CreateAsset</option>
              <option value="UpdateAsset">UpdateAsset</option>
            </Form.Control>
            </div>
          </Form.Group>
        </Form>
        <Table striped bordered hover className='mt-5'>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, id) => (
              <tr key={id}>
                <td>{item.eventName}</td>
                <td>{item.age}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default EventDetails;
