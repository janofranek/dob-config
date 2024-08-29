import React from 'react';
import "./Common.css"
import { Table } from 'react-bootstrap';

const SetsList = (props) => {

  return ( 
    <>
      <Table striped bordered hover size='sm'>
        <thead>
          <tr>
            <th>#</th>
            <th>Název skupiny</th>
          </tr>
        </thead>
        <tbody>
          {props.currentCustomer.sets.map( (row, index) => {
            return (
              <tr key={index} onClick={props.onListClick}>
                <td id={index} >{index+1}</td>
                <td id={index} >{row.setName}</td>
              </tr>
            )

          })}
        </tbody>
      </Table>
    </>
  )
}

export default SetsList

