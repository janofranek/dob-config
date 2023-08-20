import React, {useEffect, useState} from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Form, Modal } from "react-bootstrap";
import { addSet } from "../data/DataUtils"
import SelectTemplates from './SelectTemplates';

const SetEditModal = (props) => {
  const [setName, setSetName] = useState("")
  const [disabledSave, setDisabledSave] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState([]);

  const currentCustomer = useCurrentCustomer();

  useEffect(() => {        
    if (props.mode === "new" && currentCustomer) {
      setSetName(null);
      setSelectedTemplates([]);
    } else if (props.mode === "edit" && currentCustomer) {
      setSetName(currentCustomer.sets[props.setIndex].setName);
      setSelectedTemplates(currentCustomer.sets[props.setIndex].setTemplates);
    }
  }, [props, currentCustomer]);

  //wait for data
  if (!currentCustomer ) return "Loading...";

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
    addSet(currentCustomer.id, newSet)
    //TODO check errors

    props.hideModal()
  }

  const onTemplatesClick = (e) => {
    e.preventDefault();
    const templateName = currentCustomer.templates[e.target.id].templateName;

    if ( selectedTemplates.includes(templateName)) {
        setSelectedTemplates(selectedTemplates.filter(name => name !== templateName));
    } else {
        setSelectedTemplates([...selectedTemplates, templateName])
    }
    console.log("onTemplatesChange")
    console.log(selectedTemplates)
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
            {!("templates" in currentCustomer) && <p>Zatím neexistuje žádný vzor</p> }
            {("templates" in currentCustomer) && 
              <SelectTemplates
                templatesList={currentCustomer.templates}
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
            onClick={props.hideModal}>
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
