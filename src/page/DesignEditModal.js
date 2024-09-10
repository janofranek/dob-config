import React, {useState} from 'react';
import "./Common.css"
import { Button, Form, Modal, Alert } from "react-bootstrap";
import { addDesign } from "../data/DataUtils"

const DesignEditModal = (props) => {

  const [designName, setDesignName] = useState("")
  const [disabledSave, setDisabledSave] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")

  const initModal = () => {
    if (props.oldDesign) {
      setDesignName(props.oldDesign.designName);
    } else {
      setDesignName("");
    }
  }

  const onSave = async (e) => {
    e.preventDefault();

    if (!designName) {
      setErrorMsg("Název vzoru nemůže být prázdný");
      return;
    }

    setDisabledSave();
    const newDesign = {
        "designName": designName,
        "imageUrl": null
    }

    const result = await addDesign(props.currentCustomer.id, newDesign, props.oldDesign?.designName)
    if (result.error) {
      setErrorMsg(result.error);
    } else {
      props.hideModal();
      setErrorMsg("");
    }

  }

  const onCancel = (e) => {
    e.preventDefault();
    props.hideModal()
    setErrorMsg("");
  }

  return (
    <>        
      <Modal show={props.showModal} onHide={props.hideModal} onEnter={initModal} backdrop="static">
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label className="col-form-label-sm">Název vzoru</Form.Label>
              <Form.Control 
                type="text"
                size='sm' 
                id="designName"
                name="designName"
                placeholder='Zadej název vzoru'
                value={designName}
                required
                onChange={(e)=>setDesignName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary"
            size='sm'
            onClick={onCancel}>
            Zruš změny
          </Button>{" "}
          <Button 
            variant="primary"
            type="submit"
            size='sm'
            disabled={disabledSave}
            onClick={onSave}>
            Ulož
          </Button>
        </Modal.Footer>
        {errorMsg && <Alert variant="danger" onClose={() => setErrorMsg("")} dismissible><p>{errorMsg}</p></Alert>}
      </Modal>
    </>
  )
}

export default DesignEditModal
