import React, {useState} from 'react';
import { Navigate } from "react-router-dom";
import "./Common.css"
import { Button, Table } from "react-bootstrap";
import { useAuth } from '../data/AuthProvider';
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import DeleteConfirmation from './DeleteConfirmation';
import PositionEditModal from './PositionEditModal';
import { removePosition } from '../data/DataUtils';

const existsPosition = (currentCustomer) => {
  if (!(typeof currentCustomer === "object")) {
    return false
  } else if (!("positions" in currentCustomer)) {
    return false
  } else if (!Array.isArray(currentCustomer.positions)) {
    return false
  } else if (currentCustomer.positions.length === 0) {
    return false
  } else {
    return true
  }
}

const Positions = () => {
  const [displayPositionEdit, setDisplayPositionEdit] = useState(false);
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [positionName, setPositionName] = useState("");
  const [oldPosition, setOldPosition] = useState(null);

  const onPositionAdd = (e) => {
    e.preventDefault();
    setOldPosition(null);
    setDisplayPositionEdit(true);
  }

  const hidePositionEdit = () => {
    setDisplayPositionEdit(false);
  };

  const submitDelete = () => {
    removePosition(currentCustomer.id, positionName)
    setDisplayConfirmationModal(false);
  };

  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const onPositionDelete = (e) => {
    e.preventDefault();
    setDeleteMessage(`Opravdu chceš smazat obrázek '${currentCustomer.positions[e.target.id].positionName}'?`);
    setPositionName(currentCustomer.positions[e.target.id].positionName);
    setDisplayConfirmationModal(true);
  }

  const onPositionUpdate = (e) => {
    e.preventDefault();
    setOldPosition(currentCustomer.positions[e.target.id]);
    setDisplayPositionEdit(true);
  }


  //load data
  const authEmail = useAuth();
  const currentCustomer = useCurrentCustomer();

  //if not logged in, redirect to login page
  if (!authEmail) {
    return <Navigate to="/login" />;
  }

  //wait for data
  if (!currentCustomer ) return "Loading...";

  return (
    <>
      <Button
        variant="primary"
        size='sm'
        type="submit"
        onClick={onPositionAdd}>
        Nový obrázek
      </Button>
      {!(existsPosition(currentCustomer)) && <p>Zatím neexistuje žádný definovaný obrázek</p> }
      {(existsPosition(currentCustomer)) && 
        <>
          <Table striped bordered hover size='sm'>
            <thead>
              <tr>
                <th>#</th>
                <th>Název obrázku</th>
                <th>Poměr stran</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentCustomer.positions.map( (pos, index) => {
                return (
                  <tr key={index}>
                    <td id={index}>{index+1}</td>
                    <td id={index}>{pos.positionName}</td>
                    <td id={index}>{pos.arWidth}:{pos.arHeight}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size='sm'
                        type="submit"
                        id={index}
                        onClick={onPositionDelete}>
                        Smaž
                      </Button>
                      <Button
                        variant="outline-primary"
                        size='sm'
                        type="submit"
                        id={index}
                        onClick={onPositionUpdate}>
                        Uprav
                      </Button>
                    </td>
                  </tr>
                )
    
              })}
            </tbody>
          </Table>
        </>
      }
      <PositionEditModal 
        currentCustomer={currentCustomer}
        showModal={displayPositionEdit} 
        hideModal={hidePositionEdit} 
        oldPosition={oldPosition}
      />
      <DeleteConfirmation 
        showModal={displayConfirmationModal} 
        confirmModal={submitDelete} 
        hideModal={hideConfirmationModal} 
        message={deleteMessage}  
      />
    </>
  )

}

export default Positions