import React from 'react';
import { Navigate } from "react-router-dom";
import "./Common.css"
import { useAuth } from '../data/AuthProvider';
import { useUsers } from '../data//UsersDataProvider';
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { getCurrentUser } from '../data/DataUtils';
import { ListGroup, Container, Row, Col, Card } from 'react-bootstrap';


const Home = () => {

  //load data
  const authEmail = useAuth();
  const users = useUsers();
  const currentCustomer = useCurrentCustomer();

  //if not logged in, redirect to login page
  if (!authEmail) {
    return <Navigate to="/login" />;
  }

  //wait for data
  // if (!currentUser || !currentCustomer ) return "Loading...";

  if (!users ) return "Loading...users";
  if (!currentCustomer ) return "Loading...currentCustomer";
  
  const currentUser = getCurrentUser(users, authEmail);

  return (
    <>
      <p>
        Home page - UserId: {currentUser.id} - CustomerId: {currentCustomer.id}
      </p>
      <Container>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>TODO - GUI konfigurace</Card.Title>
                <ListGroup variant='flush'>
                  <ListGroup.Item>Podklady - aplikovat AR z obrázku</ListGroup.Item>
                  <ListGroup.Item>Podklady - definice obrázků na procenta</ListGroup.Item>
                  <ListGroup.Item>Podklady a Vzory - při změně fotky u podkladu nebo vzoru smazat starou fotku</ListGroup.Item>
                  <ListGroup.Item>Podklady a Vzory - při mazání smazat i fotku</ListGroup.Item>
                  <ListGroup.Item>Podklady - editace obrázku na podkladu - graficky</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>TODO - API</Card.Title>
                <ListGroup variant='flush'>
                  <ListGroup.Item>Upravit - podklady i obrázky z databáze</ListGroup.Item>
                  <ListGroup.Item>Export konfigurace ?</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>TODO - CLI</Card.Title>
                <ListGroup variant='flush'>
                  <ListGroup.Item>CLI pro API</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )

}

export default Home