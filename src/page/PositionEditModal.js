import React, {useEffect, useState} from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { addTemplatePosition } from "../data/DataUtils"

const InputNumber = (props) => {
  
  const onChange = (e) => {
    e.preventDefault();
    props.onNumberChange(e.target.value)
  }

  return (
    <>
      <Form.Group>
        <Form.Label className="col-form-label-sm">{props.labelName}</Form.Label>
        <Form.Control 
          type="number"
          size='sm' 
          id={props.numberName}
          name={props.numberName}
          required
          onChange={onChange}
        />
      </Form.Group>
    </>
  )
}


const PositionEditModal = (props) => {
  const [positionName, setPositionName] = useState("")
  const [left, setLeft] = useState(0)
  const [top, setTop] = useState(0)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [disabledSave, setDisabledSave] = useState(false);

  const currentCustomer = useCurrentCustomer();

  useEffect(() => {        
    if (props.mode === "new") {
      setPositionName(null)
      setLeft(0)
      setTop(0)
      setWidth(0)
      setHeight(0)
    }
  }, [props.mode]);

  //wait for data
  if (!currentCustomer ) return "Loading...";

  const onSave = (e) => {
    e.preventDefault();
    console.log("onSave - position")

    if (!positionName || !left || !top || !width || !height) {
        return;
        //TODO better validation + unique position name
    }

    setDisabledSave();
    const newPosition = {
      "positionName": positionName,
      "left": left,
      "top": top,
      "width": width,
      "height": height
    }
    console.log(newPosition)
    addTemplatePosition(currentCustomer.id, props.templateIndex, newPosition)
    //TODO check errors

    props.hideModal()
  }

  return (
    <>        
      <Modal show={props.showModal} onHide={props.hideModal} backdrop="static">
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label className="col-form-label-sm">Název pozice</Form.Label>
              <Form.Select 
                size='sm' 
                id="positionName"
                name="positionName"
                placeholder='Zadej název pozice'
                required
                onChange={(e)=>setPositionName(e.target.value)}
              >
                <option>Vyber pozici ze seznamu</option>
                {currentCustomer.dictionaries.positions.map((row, index) => {
                  return (
                    <option key={index} value={row}>{row}</option>
                  )
                })}
              </Form.Select>
            </Form.Group>
            <Row>
              <Col>
                <InputNumber labelName="Zleva" numberName="left" onNumberChange={setLeft}/>
              </Col>
              <Col>
                <InputNumber labelName="Zhora" numberName="top" onNumberChange={setTop}/>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputNumber labelName="Šířka" numberName="width" onNumberChange={setWidth}/>
              </Col>
              <Col>
                <InputNumber labelName="Výška" numberName="height" onNumberChange={setHeight}/>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary"
            size='sm'
            type='submit'
            onClick={props.hideModal}>
            Zrušit změny
          </Button>{" "}
          <Button 
            variant="primary"
            size='sm'
            disabled={disabledSave}
            onClick={onSave}>
            Uložit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PositionEditModal
