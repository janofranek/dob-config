import React, {useState} from 'react';
import { Navigate } from "react-router-dom";
import "./Common.css"
import { useAuth } from '../data/AuthProvider';
import { Container, Row, Col } from "react-bootstrap";
import TemplateDetail from "./TemplateDetail"
import TemplatesList from "./TemplatesList"
import TemplateEditModal from './TemplateEditModal';


const Templates = () => {

  const [templateIndex, setTemplateIndex] = useState('0')
  const [displayEditModal, setDisplayEditModal] = useState(false);

  const onListClick = (e) => {
    e.preventDefault();
    setTemplateIndex(e.target.id);
  }

  const hideEditModal = () => {
    setDisplayEditModal(false);
  };

  const onNewClick = (e) => {
    e.preventDefault();
    setDisplayEditModal(true);
  }

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
            <TemplatesList onListClick={onListClick} onNewClick={onNewClick}/>
          </Col>
          <Col>
            <TemplateDetail templateIndex={templateIndex}/>
          </Col>
        </Row>
      </Container>
      <TemplateEditModal 
        showModal={displayEditModal} 
        hideModal={hideEditModal} 
        mode="new"
      />
    </>
  )

}

export default Templates