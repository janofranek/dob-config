import React, {useState} from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Table } from "react-bootstrap";
import DeleteConfirmation from './DeleteConfirmation';
import { removeTemplate} from "../data/DataUtils"

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
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [deleteTemplateName, setDeleteTemplateName] = useState("");

  const currentCustomer = useCurrentCustomer();
  //wait for data
  if (!currentCustomer ) return "Loading...";

  const submitDelete = () => {
    removeTemplate(currentCustomer.id, deleteTemplateName)
    props.resetList()
    setDisplayConfirmationModal(false);
  };

  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };
  const onTemplateDelete = (e) => {
    e.preventDefault();
    setDeleteTemplateName(currentCustomer.templates[e.target.id].templateName)
    setDeleteMessage(`Opravdu chceš smazat podklad '${currentCustomer.templates[e.target.id].templateName}'?`);
    setDisplayConfirmationModal(true);
  }

  const onTemplateEdit = (e) => {
    e.preventDefault();
    props.onEditClick(e);
  }

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
        <>
          <Table striped bordered hover size='sm'>
            <thead>
              <tr>
                <th>#</th>
                <th>Název podkladu</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentCustomer.templates.map( (row, index) => {
                return (
                  <tr key={index} onClick={props.onListClick}>
                    <td id={index} >{index+1}</td>
                    <td id={index} >{row.templateName}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size='sm'
                        type="submit"
                        id={index}
                        onClick={onTemplateDelete}>
                        Smaž
                      </Button>
                      <Button
                        variant="outline-primary"
                        size='sm'
                        type="submit"
                        id={index}
                        onClick={onTemplateEdit}>
                        Uprav
                      </Button>
                    </td>
                  </tr>
                )

              })}
            </tbody>
          </Table>
          <DeleteConfirmation 
            showModal={displayConfirmationModal} 
            confirmModal={submitDelete} 
            hideModal={hideConfirmationModal} 
            message={deleteMessage}  
          />
        </>
      }
    </>
  )

}

export default TemplatesList