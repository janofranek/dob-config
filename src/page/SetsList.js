import React from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Table } from 'react-bootstrap';

const SetsList = (props) => {

  const currentCustomer = useCurrentCustomer();
  //wait for data
  if (!currentCustomer ) return "Loading...";

  return ( 
    <>
      <Button
        variant="primary"
        size='sm'
        type="submit"
        onClick={props.onNewClick}>
        Nová skupina
      </Button>
      {!("sets" in currentCustomer) && <p>Zatím neexistuje žádná skupina</p> }
      {("sets" in currentCustomer) && 
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>Název skupiny</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomer.sets.map( (row, index) => {
              return (
                <tr key={index} onClick={props.onListClick}>
                  <td id={index} >{index+1}</td>
                  <td id={index} >{row.setName}</td>
                </tr>
              )

            })}
          </tbody>
        </Table>
      }
    </>
  )
}

export default SetsList

