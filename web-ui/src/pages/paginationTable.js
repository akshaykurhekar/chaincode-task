import React, { useEffect, useState } from "react";
import { Table, Container, Button, Dropdown } from "react-bootstrap";
import Navbar from "./../components/navbar";
import axios from "axios";

const PaginationTable = () => {
  const [list, setList] = useState([]);
  const pageSize = 5;
  const [bookmark, setBookmark] = useState(null);

  const userId = localStorage.getItem("user");
    // console.log("user id",userId);
  const baseURL = "http://localhost:5000/getAssetsWithPagination";

  const getList = async () => {

     await axios
      .post(baseURL, { userId: userId, pageSize: pageSize, bookmark: bookmark })
      .then((response) => {
        // console.log(response.data);
        setList(response.data);
        //setBookmark
        const mapToArray = Array.from(response.data);
        const lastItem = mapToArray[mapToArray.length - 1];
        // console.log("last item key:",lastItem['Key']);
        setBookmark(lastItem['Key']);
      });

  };

  useEffect(() => {
      getList();
  },[]);


  const bookmarkHandler = async () => {
    getList();
  }

   return (
    <div>
      <Navbar />
      <Container className="mt-5">

      <h3>Project list with Pagination</h3>
        <Table striped bordered hover className="mt-5">
          <thead>
            <tr>
              <th>ProjectName</th>
              <th>Description</th>
              <th>Price</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => {
                const date = new Date(item.Record.timestamp);
                const datetimeString = date.toLocaleString();
                return (                
              <tr key={item.Key}>
                <td>{item.Record.projectName}</td>
                <td>{item.Record.description}</td>
                <td>{item.Record.flatPrice}</td>
                <td>{ datetimeString}</td>
              </tr>
            )}
            )}
          </tbody>
        </Table>

        <Button onClick={ () => { bookmarkHandler() } }> {"Next ->"} </Button>
      </Container>
    </div>
  );
};

export default PaginationTable;
