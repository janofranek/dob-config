import React, {useState} from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Form, Modal, Row, Col, Alert } from "react-bootstrap";
import { addTemplatePosition } from "../data/DataUtils" 
import { InputNumber, checkInteger, getPositionObject, getHeightFromAR } from "./Utils"

const TemplatePositionEditModal = (props) => {
  const [positionName, setPositionName] = useState("")
  const [positionObject, setPositionObject] = useState(null)
  const [left, setLeft] = useState(0)
  const [top, setTop] = useState(0)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [disabledSave, setDisabledSave] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")

  const currentCustomer = useCurrentCustomer();

  //wait for data
  if (!currentCustomer ) return "Loading...";

  const initModal = () => {
    if (props.oldTemplatePosition) {
      setPositionObject(getPositionObject(currentCustomer, props.oldTemplatePosition.positionName))
      setPositionName(props.oldTemplatePosition.positionName)
      setLeft(props.oldTemplatePosition.left)
      setTop(props.oldTemplatePosition.top)
      setWidth(props.oldTemplatePosition.width)
      setHeight(getHeightFromAR(props.oldTemplatePosition.width, positionObject))
    } else {
      setPositionName("")
      setLeft(0)
      setTop(0)
      setWidth(0)
      setHeight(0)
    }
  }

  const onSetPositionName = (e) => {
    const positionObjectTemp =  getPositionObject(currentCustomer, e.target.value)
    setPositionObject(positionObjectTemp)
    setPositionName(e.target.value)
    setHeight(getHeightFromAR(width, positionObjectTemp))
  }

  const onSetWidth = (inWidth) => {
    setWidth(inWidth)
    setHeight(getHeightFromAR(inWidth, positionObject))
  }

  const onSave = async (e) => {
    e.preventDefault();

    if (!positionName) {
      setErrorMsg("Název obrázku nemůže být prázdný");
      return;
    }
    if (!checkInteger(left)) {
      setErrorMsg("Zleva musí být kladné celé číslo");
      return;
    }
    if (!checkInteger(top)) {
      setErrorMsg("Zprava musí být kladné celé číslo");
      return;
    }
    if (!checkInteger(width)) {
      setErrorMsg("Šířka musí být kladné celé číslo");
      return;
    }
    if (!checkInteger(height)) {
      setErrorMsg("Výška musí být kladné celé číslo");
      return;
    }

    setDisabledSave();

    try {
      const newPosition = {
        "positionName": positionName,
        "left": left,
        "top": top,
        "width": width
      }
      await addTemplatePosition(currentCustomer.id, Number(props.templateIndex), newPosition, props.oldTemplatePosition?.positionName);
    }
    catch (error) {
      setErrorMsg(error.message)
      return
    }
    props.hideModal();

  }

  return (
    <>        
      <Modal show={props.showModal} onHide={props.hideModal} onEnter={initModal} backdrop="static">
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label className="col-form-label-sm">Název pozice</Form.Label>
              <Form.Select 
                size='sm' 
                id="positionName"
                name="positionName"
                placeholder='Zadej název pozice'
                value={positionName}
                // defaultValue={positionName}
                required
                onChange={(e) => { onSetPositionName(e)}}
              >
                <option>Vyber pozici ze seznamu</option>
                {currentCustomer.positions.map((row, index) => {
                  return (
                    <option key={index} value={row.positionName}>{row.positionName}</option>
                  )
                })}
              </Form.Select>
            </Form.Group>
            <Form.Text>
              Rozměry fotky: {props.imageProps.naturalWidth} x {props.imageProps.naturalHeight}
            </Form.Text>
            <Row>
              <Col>
                <InputNumber labelName="Zleva" numberName="left" value={left} min="1" onNumberChange={setLeft}/>
              </Col>
              <Col>
                <InputNumber labelName="Zhora" numberName="top" value={top} min="1" onNumberChange={setTop}/>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputNumber labelName="Šířka" numberName="width" value={width} min="1" onNumberChange={onSetWidth}/>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label className="col-form-label-sm">Výška</Form.Label>
                  <Form.Control 
                    type="number"
                    size='sm' 
                    name="height"
                    value={height}
                    readOnly
                  />
                </Form.Group>
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
        {errorMsg && <Alert variant="danger" onClose={() => setErrorMsg("")} dismissible><p>{errorMsg}</p></Alert>}
      </Modal>
    </>
  )
}

export default TemplatePositionEditModal
