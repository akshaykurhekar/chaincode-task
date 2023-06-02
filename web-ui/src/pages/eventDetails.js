import React, { useEffect, useState } from 'react';
import { Table, Form, Container } from 'react-bootstrap';
import Navbar from './../components/navbar';
import axios from 'axios';

const EventDetails = () => {
  
  const [eventList, setEventList] = useState([]);

  const baseURL = "http://localhost:5000/db/events";    

  const getList = async () => {

    await axios.get(baseURL).then((response) => {
        console.log(response.data);
        setEventList(response.data);
    });

}

  useEffect(()=>{
    getList()
  }, [])

  const [filterValue1, setFilterValue1] = useState('');

  const handleFilterChange1 = (e) => {
    setFilterValue1(e.target.value);
  };

  const filteredData = eventList && eventList.filter((item) =>
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
              <th>Asset Details</th>
              <th>Tx.Id</th>
              <th>Block no. </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, id) => (
              <tr key={id}>
                <td>{item.eventName}</td>
                <td> 
                {Array.isArray(item.assetData) ? (
          item.assetData.map((asset) => {
            const obj = {
              name: asset.projectName,
              timestamp: asset.timestamp
            };
            return obj;
          })
        ) : (
          <>
            <div style={{color:"green"}}><span style={{color:"black"}}>ProjectName:</span> {item.assetData.projectName}</div>
            <div style={{color:"green"}}><span style={{color:"black"}}>Owner:</span> {item.assetData.owner}</div>
            <div style={{color:"green"}}><span style={{color:"black"}}>Timestamp:</span> {item.assetData.timestamp}</div>
            {/* Display other properties of item.assetData if needed */}
          </>
        )}
        </td>
        <td>{item.transactionId.substring(0, 4)}...{item.transactionId.substring(item.transactionId.length - 4)}</td>
                <td>{item.blockNumber}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default EventDetails;
