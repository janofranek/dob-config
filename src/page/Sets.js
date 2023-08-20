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
  const [modalMode, setModalMode] = useState("new")

  const onSetsListClick = (e) => {
    e.preventDefault();
    setSetIndex(e.target.id);
  }

  const onNewSetClick = (e) => {
    e.preventDefault();
    setModalMode("new");
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

  //if not logged in, redirect to login page
  if (!authEmail) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Container>
        <Row>
          <Col md="auto">
            <SetsList 
              onListClick={onSetsListClick} 
              onNewClick={onNewSetClick}            />
          </Col>
          <Col md="auto">
            <SetDetail 
              setIndex={setIndex} 
              onEditClick={onEditSetClick}
            />
          </Col>
        </Row>
      </Container>
      <SetEditModal 
        showModal={displaySetEdit} 
        hideModal={hideSetEdit} 
        mode={modalMode}
        setIndex={setIndex}
      />
    </>
  )

}

export default Sets