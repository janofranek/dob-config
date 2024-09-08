import React from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Table } from "react-bootstrap";

const existsTemplate = (currentCustomer) => {
  if (!(typeof currentCustomer === "object")) {
    return false
  } else if (!("templates" in currentCustomer)) {
    return false
  } else if (!Array.isArray(currentCustomer.templates)) {
    return false
  } else if (currentCustomer.templates.length === 0) {
    return false
  } else {
    return true
  }
}

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
        Nový podklad
      </Button>
      {!(existsTemplate(currentCustomer)) && <p>Zatím neexistuje žádný podklad</p> }
      {(existsTemplate(currentCustomer)) && 
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>Název podkladu</th>
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