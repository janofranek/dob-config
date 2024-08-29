import React, {useState, useEffect} from 'react';
import { Navigate } from "react-router-dom";
import "./Common.css"
import { Form, Button, InputGroup, Table, Modal, Container, Row, Col } from "react-bootstrap";
import { useAuth } from '../data/AuthProvider';
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import DeleteConfirmation from './DeleteConfirmation';
import { setConfiguration, 
  addDictionariesPosition,
  removeDictionariesPosition } from '../data/DataUtils';

const ConfigForm = (props) => {
  const [formData, setFormData] = useState({});
  const config = props.currentCustomer.configuration;

  //TODO data validation
  //TODO database error handling

  const onChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const newData = {};
    newData["resultWidth"] = formData["resultWidth"] ?? config["resultWidth"]
    newData["resultHeight"] = formData["resultHeight"] ?? config["resultHeight"]
    newData["resultBackground"] = formData["resultBackground"] ?? config["resultBackground"]
    setConfiguration(props.currentCustomer.id, newData)
    //TODO success confirmation
  }

  return (
    <>
      <p>Parametry výsledného obrázku</p>
      <Form>
        <InputGroup className="mb-1">
          <InputGroup.Text id="label1">Šířka (pixely)</InputGroup.Text>
          <Form.Control
            type="number"
            id="resultWidth"
            value={formData["resultWidth"] ?? config["resultWidth"]}
            aria-label="ResultWidth"
            aria-describedby="label1"
            onChange={onChange}
          />
        </InputGroup>
        <InputGroup className="mb-1">
          <InputGroup.Text id="label2">Výška (pixely)</InputGroup.Text>
          <Form.Control
            id="resultHeight"
            type="number"
            value={formData["resultHeight"] ?? config["resultHeight"]}
            aria-label="ResultHeight"
            aria-describedby="label2"
            onChange={onChange}
          />
        </InputGroup>
        <InputGroup className="mb-1">
          <InputGroup.Text id="label3">Barva pozadí</InputGroup.Text>
          <Form.Control
            id="resultBackground"
            type="color"
            value={formData["resultBackground"] ?? config["resultBackground"]}
            aria-label="ResultBackground"
            aria-describedby="label3"
            onChange={onChange}
          />
        </InputGroup>
        <Button 
          variant="primary" 
          size="sm"
          type="submit"
          onClick={onSubmit}
        >Uložit změny</Button>
      </Form>
    </>
  )
}

const ConfigDictionariesPositionsEditModal = (props) => {
  const [positionName, setPositionName] = useState("")
  const [disabledSave, setDisabledSave] = useState(false);

  useEffect(() => {        
    setPositionName(props.oldPositionName);
  }, [props.oldPositionName]);

  const onSave = (e) => {
    e.preventDefault();

    if (!positionName ) {
      console.log("onSave - ConfigDictionariesPositionsEditModal - error")
      return;
      //TODO better validation 
    }

    setDisabledSave();
    addDictionariesPosition(props.currentCustomer.id, positionName, props.oldPositionName);
    //TODO check errors

    props.hideModal();
    setPositionName(null);
  }

  const onCancel = (e) => {
    e.preventDefault();
    props.hideModal();
    setPositionName(null);
  }

  console.log("ConfigDictionariesPositionsEditModal")
  console.log(props)

  return (
    <>        
      <Modal show={props.showModal} onHide={props.hideModal} backdrop="static">
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label className="col-form-label-sm">Název pozice</Form.Label>
              <Form.Control 
                type="text"
                size='sm' 
                id="positionName"
                name="positionsName"
                placeholder='Zadej název pozice'
                value={positionName}
                required
                onChange={(e)=>setPositionName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary"
            size='sm'
            type='submit'
            onClick={onCancel}>
            Zruš změny
          </Button>{" "}
          <Button 
            variant="primary"
            size='sm'
            disabled={disabledSave}
            onClick={onSave}>
            Ulož
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

const existsPosition = (currentCustomer) => {
  if (!(typeof currentCustomer === "object")) {
    return false
  } else if (!("dictionaries" in currentCustomer)) {
    return false
  } else if (!(typeof currentCustomer.dictionaries === "object")) {
    return false
  } else if (!("positions" in currentCustomer.dictionaries)) {
    return false
  } else if (!Array.isArray(currentCustomer.dictionaries.positions)) {
    return false
  } else if (currentCustomer.dictionaries.positions.length === 0) {
    return false
  } else {
    return true
  }
}

const ConfigDictionariesPositions = (props) => {
  const [displayPositionEdit, setDisplayPositionEdit] = useState(false);
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [positionName, setPositionName] = useState("");
  const [oldPositionName, setOldPositionName] = useState("");

  const onPositionAdd = (e) => {
    e.preventDefault();
    console.log("ConfigDictionariesPositions - onPositionAdd")
    setOldPositionName(null);
    setDisplayPositionEdit(true);
  }

  const hidePositionEdit = () => {
    setDisplayPositionEdit(false);
  };

  const submitDelete = () => {
    removeDictionariesPosition(props.currentCustomer.id, positionName)
    setDisplayConfirmationModal(false);
  };

  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const onPositionDelete = (e) => {
    e.preventDefault();
    setDeleteMessage(`Opravdu chceš smazat pozici '${props.currentCustomer.dictionaries.positions[e.target.id]}'?`);
    setPositionName(props.currentCustomer.dictionaries.positions[e.target.id]);
    setDisplayConfirmationModal(true);
  }

  const onPositionUpdate = (e) => {
    e.preventDefault();
    setOldPositionName(props.currentCustomer.dictionaries.positions[e.target.id]);
    setDisplayPositionEdit(true);
  }

  return (
    <>
      <p>Definované pozice</p>
      {!(existsPosition(props.currentCustomer)) && <p>Zatím neexistuje žádná definovaná pozice</p> }
      {(existsPosition(props.currentCustomer)) && 
        <>
          <Table striped bordered hover size='sm'>
            <thead>
              <tr>
                <th>#</th>
                <th>Název pozice</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {props.currentCustomer.dictionaries.positions.map( (row, index) => {
                return (
                  <tr key={index}>
                    <td id={index}>{index+1}</td>
                    <td id={index}>{row}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size='sm'
                        type="submit"
                        id={index}
                        onClick={onPositionDelete}>
                        Smaž
                      </Button>
                      <Button
                        variant="outline-primary"
                        size='sm'
                        type="submit"
                        id={index}
                        onClick={onPositionUpdate}>
                        Uprav
                      </Button>
                    </td>
                  </tr>
                )
    
              })}
            </tbody>
          </Table>
        </>
      }
      <Button
        variant="primary"
        size='sm'
        type="submit"
        onClick={onPositionAdd}>
        Nová pozice
      </Button>
      <ConfigDictionariesPositionsEditModal 
        currentCustomer={props.currentCustomer}
        showModal={displayPositionEdit} 
        hideModal={hidePositionEdit} 
        oldPositionName={oldPositionName}
      />
      <DeleteConfirmation 
        showModal={displayConfirmationModal} 
        confirmModal={submitDelete} 
        hideModal={hideConfirmationModal} 
        message={deleteMessage}  
      />
    </>
  )
}

const Config = () => {

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
            <ConfigForm currentCustomer={currentCustomer}/>
          </Col>
          <Col>
            <ConfigDictionariesPositions currentCustomer={currentCustomer}/>
          </Col>
        </Row>
      </Container>
    </>
  )

}

export default Config