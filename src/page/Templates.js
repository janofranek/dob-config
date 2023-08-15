import React, {useState} from 'react';
import { Navigate } from "react-router-dom";
import "./Common.css"
import { useAuth } from '../data/AuthProvider';
import { Container, Row, Col } from "react-bootstrap";
import TemplatesList from "./TemplatesList"
import TemplateDetail from "./TemplateDetail"
import PositionsList from './PositionsList';
import TemplateEditModal from './TemplateEditModal';
import PositionEditModal from './PositionEditModal';


const Templates = () => {

  const [templateIndex, setTemplateIndex] = useState('0')
  const [displayTemplateEdit, setDisplayTemplateEdit] = useState(false);
  const [displayPositionEdit, setDisplayPositionEdit] = useState(false);
  const [showPositionRect, setShowPositionRect] = useState({})
  const [imageProps, setImageProps] = useState({})

  const onTemplateListClick = (e) => {
    e.preventDefault();
    setShowPositionRect({})
    setTemplateIndex(e.target.id);
  }

  const hideTemplateEdit = () => {
    setDisplayTemplateEdit(false);
  };

  const hidePositionEdit = () => {
    setDisplayPositionEdit(false);
  };

  const onNewTemplateClick = (e) => {
    e.preventDefault();
    setDisplayTemplateEdit(true);
  }

  const onNewPositionClick = (e) => {
    e.preventDefault();
    setDisplayPositionEdit(true);
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
            <TemplatesList 
              onListClick={onTemplateListClick} 
              onNewClick={onNewTemplateClick}
            />
          </Col>
          <Col>
            <TemplateDetail 
              templateIndex={templateIndex} 
              setImageProps={setImageProps}
              showPositionRect={showPositionRect}
            />
          </Col>
          <Col>
            <PositionsList 
              templateIndex={templateIndex}
              onNewClick={onNewPositionClick} 
              setShowPositionRect={setShowPositionRect}
            />
          </Col>
        </Row>
      </Container>
      <TemplateEditModal 
        showModal={displayTemplateEdit} 
        hideModal={hideTemplateEdit} 
        mode="new"
      />
      <PositionEditModal 
        showModal={displayPositionEdit} 
        hideModal={hidePositionEdit} 
        imageProps={imageProps}
        templateIndex={templateIndex}
        mode="new"
      />
      
    </>
  )

}

export default Templates