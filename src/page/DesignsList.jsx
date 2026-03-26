import React, {useState} from 'react';
import "./Common.css"
import { Table, Button } from 'react-bootstrap';
import DeleteConfirmation from './DeleteConfirmation';
import { removeDesign } from "../data/DataUtils"

const DesignsList = (props) => {
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [deleteDesignName, setDeleteDesignName] = useState("");

  const submitDelete = () => {
    removeDesign(props.currentCustomer.id, deleteDesignName)
    setDisplayConfirmationModal(false);
  };

  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const onDesignDelete = (e) => {
    e.preventDefault();
    setDeleteDesignName(props.currentCustomer.designs[e.target.id].designName)
    setDeleteMessage(`Opravdu chceš smazat vzor '${props.currentCustomer.designs[e.target.id].designName}'?`);
    setDisplayConfirmationModal(true);
  }

  return ( 
    <>
      <Table striped bordered hover size='sm'>
        <thead>
          <tr>
            <th>#</th>
            <th>Název vzoru</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.currentCustomer.designs.map( (row, index) => {
            return (
              <tr key={index} onClick={props.onListClick}>
                <td id={index} >{index+1}</td>
                <td id={index} >{row.designName}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size='sm'
                    type="submit"
                    id={index}
                    onClick={onDesignDelete}>
                    Smaž
                  </Button>
                  <Button
                    variant="outline-primary"
                    size='sm'
                    type="submit"
                    id={index}
                    onClick={props.onEditClick}>
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
  )
}

export default DesignsList

