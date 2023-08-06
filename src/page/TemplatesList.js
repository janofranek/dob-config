import React from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Table } from "react-bootstrap";

const TemplatesList = (props) => {

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
        Nový vzor
      </Button>
      {!("templates" in currentCustomer) && <p>Zatím neexistuje žádný vzor</p> }
      {("templates" in currentCustomer) && 
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>Název vzoru</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomer.templates.map( (row, index) => {
              return (
                <tr key={index} onClick={props.onListClick}>
                  <td id={index} >{index+1}</td>
                  <td id={index} >{row.templateName}</td>
                </tr>
              )

            })}
          </tbody>
        </Table>
      }
    </>
  )

}

export default TemplatesList