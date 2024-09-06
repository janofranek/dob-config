import { React, useState } from 'react';
import { Navigate } from "react-router-dom";
import "./Common.css"
import { useAuth } from '../data/AuthProvider';
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Container, Button, Row, Col } from 'react-bootstrap';
import SetDetail from './SetDetail';
import SetsList from './SetsList';
import SetEditModal from './SetEditModal';

const existsSet = (currentCustomer) => {
  if (!(typeof currentCustomer === "object")) {
    return false
  } else if (!("sets" in currentCustomer)) {
    return false
  } else if (!Array.isArray(currentCustomer.sets)) {
    return false
  } else if (currentCustomer.sets.length === 0) {
    return false
  } else {
    return true
  }
}

const Designs = () => {

  const [setIndex, setSetIndex] = useState(null)
  const [displaySetEdit, setDisplaySetEdit] = useState(false);
  const [modalMode, setModalMode] = useState("new")

  const onSetsListClick = (e) => {
    e.preventDefault();
    setSetIndex(e.target.id);
  }

  const onNewSetClick = (e) => {
    e.preventDefault();
    setModalMode("new");
    setSetIndex(null)
    setDisplaySetEdit(true);
  }

  const onEditSetClick = (e) => {
    e.preventDefault();
    setModalMode("edit");
    setDisplaySetEdit(true);
  }

  const hideSetEdit = () => {
    setDisplaySetEdit(false);
  };


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
      {!(existsSet(currentCustomer)) && <p>Zatím neexistuje žádná skupina</p> }
      {(existsSet(currentCustomer)) && 
        <Container>
          <Row>
            <Col md="auto">
              <SetsList 
                currentCustomer={currentCustomer}
                onListClick={onSetsListClick}         />
            </Col>
            <Col md="auto">
              <SetDetail 
                currentCustomer={currentCustomer}
                setIndex={setIndex} 
                onEditClick={onEditSetClick}
              />
            </Col>
          </Row>
        </Container>
      }
      <Button
        variant="primary"
        size='sm'
        type="submit"
        onClick={onNewSetClick}>
        Nová skupina
      </Button>
      <SetEditModal 
        currentCustomer={currentCustomer}
        showModal={displaySetEdit} 
        hideModal={hideSetEdit} 
        mode={modalMode}
        setIndex={setIndex}
      />
    </>
  )

}

export default Designs