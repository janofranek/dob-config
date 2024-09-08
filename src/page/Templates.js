import React, {useState} from 'react';
import { Navigate } from "react-router-dom";
import "./Common.css"
import { useAuth } from '../data/AuthProvider';
import { Container, Row, Col } from "react-bootstrap";
import TemplatesList from "./TemplatesList"
import TemplateDetail from "./TemplateDetail"
import TemplatePositions from './TemplatePositions';
import TemplateEditModal from './TemplateEditModal';
import TemplatePositionEditModal from './TemplatePositionEditModal';


const Templates = () => {

  const [templateIndex, setTemplateIndex] = useState('0')
  const [positionIndex, setPositionIndex] = useState(0)
  const [displayTemplateEdit, setDisplayTemplateEdit] = useState(false);
  const [displayPositionEdit, setDisplayPositionEdit] = useState(false);
  const [showPositionRect, setShowPositionRect] = useState({})
  const [imageProps, setImageProps] = useState({})
  const [modeTemplateEdit, setModeTemplateEdit] = useState("new")
  const [modePositionEdit, setModePositionEdit] = useState("new")

  const onTemplateListClick = (e) => {
    e.preventDefault();
    setShowPositionRect({})
    setTemplateIndex(e.target.id);
  }

  const hideTemplateEdit = () => {
    setDisplayTemplateEdit(false);
    setModeTemplateEdit("new")
  };

  const hidePositionEdit = () => {
    setDisplayPositionEdit(false);
    setModePositionEdit("new")
  };

  const onNewTemplateClick = (e) => {
    e.preventDefault();
    setModeTemplateEdit("new");
    setDisplayTemplateEdit(true);
  }

  const onEditTemplateClick = (e) => {
    e.preventDefault();
    setModeTemplateEdit("edit");
    setDisplayTemplateEdit(true);
  }

  const onNewPositionClick = (e) => {
    e.preventDefault();
    setModePositionEdit("new");
    setDisplayPositionEdit(true);
  }

  const onEditPositionClick = (e) => {
    e.preventDefault();
    setPositionIndex(e.target.id)
    setModePositionEdit("edit");
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
              onEditClick={onEditTemplateClick}
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
        mode={modeTemplateEdit}
      />
      <TemplatePositionEditModal 
        showModal={displayPositionEdit} 
        hideModal={hidePositionEdit} 
        imageProps={imageProps}
        templateIndex={templateIndex}
        positionIndex={positionIndex}
        mode={modePositionEdit}
      />
      
    </>
  )

}

export default Templates