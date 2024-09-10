import React, {useState} from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Form, Modal, Row, Col, Alert } from "react-bootstrap";
import { addTemplatePosition } from "../data/DataUtils" 
import { InputNumber, checkInteger } from "./Utils"

const TemplatePositionEditModal = (props) => {
  const [positionName, setPositionName] = useState("")
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
      setPositionName(props.oldTemplatePosition.positionName)
      setLeft(props.oldTemplatePosition.left)
      setTop(props.oldTemplatePosition.top)
      setWidth(props.oldTemplatePosition.width)
      setHeight(props.oldTemplatePosition.height)
    } else {
      setPositionName("")
      setLeft(0)
      setTop(0)
      setWidth(0)
      setHeight(0)
    }
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
    const newPosition = {
      "positionName": positionName,
      "left": left,
      "top": top,
      "width": width,
      "height": height
    }

    const result = await addTemplatePosition(currentCustomer.id, Number(props.templateIndex), newPosition, props.oldTemplatePosition?.positionName);
    if (result.error) {
      setErrorMsg(result.error);
    } else {
      props.hideModal();
      setErrorMsg("");
    }

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
                onChange={(e)=>setPositionName(e.target.value)}
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
                <InputNumber labelName="Zleva" numberName="left" value={left} onNumberChange={setLeft}/>
              </Col>
              <Col>
                <InputNumber labelName="Zhora" numberName="top" value={top} onNumberChange={setTop}/>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputNumber labelName="Šířka" numberName="width" value={width} onNumberChange={setWidth}/>
              </Col>
              <Col>
                <InputNumber labelName="Výška" numberName="height" value={height} onNumberChange={setHeight}/>
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
