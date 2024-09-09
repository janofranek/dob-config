import React from 'react';
import "./Common.css"
import { Form } from "react-bootstrap";

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
          value={props.value}
          min={props.min}
          max={props.max}
          step={props.step}
          required
          onChange={onChange}
        />
      </Form.Group>
    </>
  )
}

const checkInteger = (inputString) => {
  const inputNumber = Number(inputString)
  return (typeof inputNumber === "number" &&
        Number.isInteger(inputNumber) &&
        inputNumber > 0 )
}

export {
    InputNumber,
    checkInteger
}