import { React, useState } from 'react';
import { Navigate } from "react-router-dom";
import "./Common.css"
import { useAuth } from '../data/AuthProvider';
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Container, Button, Row, Col } from 'react-bootstrap';
import DesignDetail from './DesignDetail';
import DesignsList from './DesignsList';
import DesignEditModal from './DesignEditModal';

const existsDesign = (currentCustomer) => {
  if (!(typeof currentCustomer === "object")) {
    return false
  } else if (!("designs" in currentCustomer)) {
    return false
  } else if (!Array.isArray(currentCustomer.designs)) {
    return false
  } else if (currentCustomer.designs.length === 0) {
    return false
  } else {
    return true
  }
}

const Designs = () => {

  const [designIndex, setDesignIndex] = useState(null)
  const [displayDesignEdit, setDisplayDesignEdit] = useState(false);
  const [oldDesign, setOldDesign] = useState(null);

  const onDesignsListClick = (e) => {
    e.preventDefault();
    setDesignIndex(e.target.id);
  }

  const onNewDesignClick = (e) => {
    e.preventDefault();
    setOldDesign(null)
    setDisplayDesignEdit(true);
  }

  const onEditDesignClick = (e) => {
    e.preventDefault();
    setOldDesign(currentCustomer.designs[e.target.id]);
    setDisplayDesignEdit(true);
  }

  const hideDesignEdit = () => {
    setDisplayDesignEdit(false);
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
      <Button
        variant="primary"
        size='sm'
        type="submit"
        onClick={onNewDesignClick}>
        Nový vzor
      </Button>
      {!(existsDesign(currentCustomer)) && <p>Zatím neexistuje žádný vzor</p> }
      {(existsDesign(currentCustomer)) && 
        <Container>
          <Row>
            <Col md="auto">
              <DesignsList 
                currentCustomer={currentCustomer}
                onListClick={onDesignsListClick}         
                onEditClick={onEditDesignClick}
              />
            </Col>
            <Col md="auto">
              <DesignDetail 
                currentCustomer={currentCustomer}
                designIndex={designIndex} 
                onEditClick={onEditDesignClick}
              />
            </Col>
          </Row>
        </Container>
      }
      <DesignEditModal 
        currentCustomer={currentCustomer}
        showModal={displayDesignEdit} 
        hideModal={hideDesignEdit} 
        oldDesign={oldDesign}
      />
    </>
  )

}

export default Designs