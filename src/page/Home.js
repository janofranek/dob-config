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
                  <ListGroup.Item><s>Editace skupiny</s> - změna názvu přidá novou skupinu</ListGroup.Item>
                  <ListGroup.Item><s>Editace pozice - zadáním souřadnic</s> - změna názvu pozice přidá novou pozici</ListGroup.Item>
                  <ListGroup.Item>Editace pozice - graficky</ListGroup.Item>
                  <ListGroup.Item><s>Editace vzoru</s> - změna názvu přidá nový vzor</ListGroup.Item>
                  <ListGroup.Item>Při změně fotky u vzoru smazat starou fotku</ListGroup.Item>
                  <ListGroup.Item>Správa slovníků (zatím jen seznam názvů pozic)</ListGroup.Item>
                  <ListGroup.Item>Pořádné validace vstupů</ListGroup.Item>
                  <ListGroup.Item><s>Unikátní názvy vzorů, pozic, skupin</s></ListGroup.Item>
                  <ListGroup.Item>Mazání vzorů - smazat i fotku a projít skupiny</ListGroup.Item>
                  <ListGroup.Item>Hlášení chyb - alerty</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>TODO - API</Card.Title>
                <ListGroup variant='flush'>
                  <ListGroup.Item><s>Napojení na konfiguraci v databázi</s></ListGroup.Item>
                  <ListGroup.Item>Více obrázků najednou</ListGroup.Item>
                  <ListGroup.Item>Skupiny</ListGroup.Item>
                  <ListGroup.Item>Export konfigurace ?</ListGroup.Item>
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