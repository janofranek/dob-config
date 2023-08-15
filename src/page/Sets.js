import { React, useState } from 'react';
import { Navigate } from "react-router-dom";
import "./Common.css"
import { useAuth } from '../data/AuthProvider';
import { Container, Row, Col } from 'react-bootstrap';
import SetDetail from './SetDetail';
import SetsList from './SetsList';
import SetEditModal from './SetEditModal';

const Sets = () => {

  const [setIndex, setSetIndex] = useState('0')
  const [displaySetEdit, setDisplaySetEdit] = useState(false);

  const onSetsListClick = (e) => {
    e.preventDefault();
    setSetIndex(e.target.id);
  }

  const onNewSetClick = (e) => {
    e.preventDefault();
    setDisplaySetEdit(true);
  }

  const hideSetEdit = () => {
    setDisplaySetEdit(false);
  };


  //load data
  const authEmail = useAuth();

  //if not logged in, redirect to login page
  if (!authEmail) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <SetsList 
              onListClick={onSetsListClick} 
              onNewClick={onNewSetClick}            />
          </Col>
          <Col>
            <SetDetail 
              setIndex={setIndex} 
            />
          </Col>
        </Row>
      </Container>
      <SetEditModal 
        showModal={displaySetEdit} 
        hideModal={hideSetEdit} 
        mode="new"
      />
    </>
  )

}

export default Sets