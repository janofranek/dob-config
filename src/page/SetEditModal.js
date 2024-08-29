import React, {useEffect, useState} from 'react';
import "./Common.css"
import { Button, Form, Modal } from "react-bootstrap";
import { addSet } from "../data/DataUtils"
import SelectTemplates from './SelectTemplates';

const existsTemplates = (currentCustomer) => {
  if (!(typeof currentCustomer === "object")) {
    return false
  } else if (!("templates" in currentCustomer)) {
    return false
  } else if (!Array.isArray(currentCustomer.templates)) {
    return false
  } else if (currentCustomer.templates.length === 0) {
    return false
  } else {
    return true
  }
}

const SetEditModal = (props) => {
  const [setName, setSetName] = useState("")
  const [disabledSave, setDisabledSave] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState([]);


  useEffect(() => {        
    if (props.mode === "new") {
      setSetName(null);
      setSelectedTemplates([]);
    } else if (props.mode === "edit") {
      setSetName(props.currentCustomer.sets[props.setIndex].setName);
      setSelectedTemplates(props.currentCustomer.sets[props.setIndex].setTemplates);
    }
  }, [props]);

  const onSave = (e) => {
    e.preventDefault();
    console.log("onSave - set")

    if (!setName ) {
      console.log("onSave - set - error")
      return;
      //TODO better validation + unique set name
    }

    setDisabledSave();
    const newSet = {
        "setName": setName,
        "setTemplates": selectedTemplates
    }
    addSet(props.currentCustomer.id, props.setIndex, newSet)
    //TODO check errors

    props.hideModal()
    setSetName(null)
    setSelectedTemplates([]);
  }

  const onCancel = (e) => {
    e.preventDefault();
    props.hideModal()
    setSetName(null)
    setSelectedTemplates([]);
  }

  const onTemplatesClick = (e) => {
    e.preventDefault();
    const templateName = props.currentCustomer.templates[e.target.id].templateName;

    if ( selectedTemplates.includes(templateName)) {
        setSelectedTemplates(selectedTemplates.filter(name => name !== templateName));
    } else {
        setSelectedTemplates([...selectedTemplates, templateName])
    }
  }

  return (
    <>        
      <Modal show={props.showModal} onHide={props.hideModal} backdrop="static">
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label className="col-form-label-sm">Název skupiny</Form.Label>
              <Form.Control 
                type="text"
                size='sm' 
                id="setName"
                name="setName"
                placeholder='Zadej název skupiny'
                value={setName}
                required
                onChange={(e)=>setSetName(e.target.value)}
              />
            </Form.Group>
            {!(existsTemplates(props.currentCustomer)) && <p>Zatím neexistuje žádný vzor</p> }
            {(existsTemplates(props.currentCustomer)) && 
              <SelectTemplates
                templatesList={props.currentCustomer.templates}
                selectedTemplates={selectedTemplates}
                onTemplatesClick={onTemplatesClick}
              />
            }
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

export default SetEditModal
