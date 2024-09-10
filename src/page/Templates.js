import React, {useState} from 'react';
import { Navigate } from "react-router-dom";
import "./Common.css"
import { useAuth } from '../data/AuthProvider';
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Container, Row, Col } from "react-bootstrap";
import TemplatesList from "./TemplatesList"
import TemplateImage from "./TemplateImage"
import TemplatePositions from './TemplatePositions';
import TemplateEditModal from './TemplateEditModal';
import TemplatePositionEditModal from './TemplatePositionEditModal';


const Templates = () => {

  const [templateIndex, setTemplateIndex] = useState('0')
  const [displayTemplateEdit, setDisplayTemplateEdit] = useState(false);
  const [displayPositionEdit, setDisplayPositionEdit] = useState(false);
  const [showPositionRect, setShowPositionRect] = useState({})
  const [imageProps, setImageProps] = useState({})
  const [oldTemplate, setOldTemplate] = useState(null)
  const [oldTemplatePosition, setOldTemplatePosition] = useState(null)

  const onTemplateListClick = (e) => {
    e.preventDefault();
    setShowPositionRect({})
    setTemplateIndex(e.target.id);
  }

  const hideTemplateEdit = () => {
    setDisplayTemplateEdit(false);
  };

  const hidePositionEdit = () => {
    setDisplayPositionEdit(false)
  };

  const resetList = () => {
    setTemplateIndex(0)
  };

  const onNewTemplateClick = (e) => {
    e.preventDefault();
    setOldTemplate(null);
    setDisplayTemplateEdit(true);
  }

  const onEditTemplateClick = (e) => {
    e.preventDefault();
    setOldTemplate(currentCustomer.templates[e.target.id]);
    setDisplayTemplateEdit(true);
  }

  const onNewPositionClick = (e) => {
    e.preventDefault();
    setOldTemplatePosition(null);
    setDisplayPositionEdit(true);
  }

  const onEditPositionClick = (e) => {
    e.preventDefault();
    setOldTemplatePosition(currentCustomer.templates[templateIndex].positions[e.target.id]);
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
      <Container>
        <Row>
          <Col>
            <TemplatesList 
              onListClick={onTemplateListClick} 
              onNewClick={onNewTemplateClick}
              onEditClick={onEditTemplateClick}
              resetList={resetList}
            />
          </Col>
          <Col>
            <TemplateImage 
              templateIndex={templateIndex} 
              setImageProps={setImageProps}
              showPositionRect={showPositionRect}
            />
          </Col>
          <Col>
            <TemplatePositions 
              templateIndex={templateIndex}
              onNewClick={onNewPositionClick}
              onEditClick={onEditPositionClick} 
              setShowPositionRect={setShowPositionRect}
            />
          </Col>
        </Row>
      </Container>
      <TemplateEditModal 
        showModal={displayTemplateEdit} 
        hideModal={hideTemplateEdit}
        templateIndex={templateIndex} 
        oldTemplate={oldTemplate}
      />
      <TemplatePositionEditModal 
        showModal={displayPositionEdit} 
        hideModal={hidePositionEdit} 
        imageProps={imageProps}
        templateIndex={templateIndex}
        oldTemplatePosition={oldTemplatePosition}
      />
      
    </>
  )

}

export default Templates