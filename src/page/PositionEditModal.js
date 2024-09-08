import React, {useState, useEffect} from 'react';
import "./Common.css"
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import { addPosition } from '../data/DataUtils';
import { InputNumber } from "./Utils"

const PositionEditModal = (props) => {
    const [positionName, setPositionName] = useState("")
    const [arWidth, setARWidth] = useState(0)
    const [arHeight, setARHeight] = useState(0)
    const [disabledSave, setDisabledSave] = useState(false);
  
    useEffect(() => {        
      setPositionName(props.oldPositionName);
    }, [props.oldPositionName]);
  
    const onSave = (e) => {
      e.preventDefault();
  
      if (!positionName ) {
        return;
        //TODO better validation 
      }
  
      setDisabledSave();
      const newPosition = {
        "positionName": positionName,
        "arWidth": arWidth,
        "arHeight": arHeight
      }
      const result = addPosition(props.currentCustomer.id, newPosition, props.oldPositionName);
      //TODO check errors
      if (!result.result) {
        console.log(`PositionEditModal - addPosition - ${result.error}`)
      }
  
      props.hideModal();
      setPositionName(null);
    }
  
    const onCancel = (e) => {
      e.preventDefault();
      props.hideModal();
      setPositionName(null);
    }
  
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
              <Form.Text>
                Poměr stran
              </Form.Text>
              <Row>
                <Col>
                  <InputNumber labelName="Šířka" numberName="width" value={arWidth} onNumberChange={setARWidth}/>
                </Col>
                <Col>
                  <InputNumber labelName="Výška" numberName="height" value={arHeight} onNumberChange={setARHeight}/>
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
        </Modal>
      </>
    )
  }
  
  export default PositionEditModal