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
            required
            onChange={onChange}
          />
        </Form.Group>
      </>
    )
  }
  
export {
    InputNumber
}