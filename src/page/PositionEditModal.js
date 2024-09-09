import React, {useState} from 'react';
import "./Common.css"
import { Alert, Form, Button, Modal, Row, Col } from "react-bootstrap";
import { addPosition } from '../data/DataUtils';
import { InputNumber, checkInteger } from "./Utils"

const PositionEditModal = (props) => {
    const [positionName, setPositionName] = useState("")
    const [arWidth, setARWidth] = useState(1)
    const [arHeight, setARHeight] = useState(1)
    const [disabledSave, setDisabledSave] = useState(false);
    const [errorMsg, setErrorMsg] = useState("")

    const initModal = () => {
      if (props.oldPosition) {
        setPositionName(props.oldPosition.positionName);
        setARWidth(props.oldPosition.arWidth);
        setARHeight(props.oldPosition.arHeight);
      } else {
        setPositionName("");
        setARHeight(1);
        setARWidth(1);
      }
    }



    const onSave = async (e) => {
      e.preventDefault();
  
      if (!positionName) {
        setErrorMsg("Název obrázku nemůže být prázdný");
        return;
      }
      if (!checkInteger(arWidth)) {
        setErrorMsg("Šířka musí být kladné celé číslo");
        return;
      }
      if (!checkInteger(arHeight)) {
        setErrorMsg("Výška musí být kladné celé číslo");
        return;
      }
  
      setDisabledSave();
      const newPosition = {
        "positionName": positionName,
        "arWidth": arWidth,
        "arHeight": arHeight
      }
      const result = await addPosition(props.currentCustomer.id, newPosition, props.oldPosition?.positionName);
      //TODO check errors
      if (result.error) {
        setErrorMsg(result.error);
      } else {
        props.hideModal();
        setErrorMsg("");
      }
  
    }
  
    const onCancel = (e) => {
      e.preventDefault();
      props.hideModal();
      setErrorMsg("");
    }
  
    return (
      <>        
        <Modal show={props.showModal} onHide={props.hideModal} onEnter={initModal} backdrop="static">
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
              <Form.Text>
                Poměr stran
              </Form.Text>
              <Row>
                <Col>
                  <InputNumber 
                    labelName="Šířka" 
                    numberName="arWidth" 
                    value={arWidth} 
                    min="1"
                    max="10000"
                    step="1"
                    onNumberChange={setARWidth}/>
                </Col>
                <Col>
                  <InputNumber 
                    labelName="Výška" 
                    numberName="arHeight" 
                    value={arHeight} 
                    min="1"
                    max="10000"
                    step="1"
                    onNumberChange={setARHeight}/>
                </Col>
              </Row>
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
          {errorMsg && <Alert variant="danger" onClose={() => setErrorMsg("")} dismissible><p>{errorMsg}</p></Alert>}
        </Modal>
      </>
    )
  }
  
  export default PositionEditModal