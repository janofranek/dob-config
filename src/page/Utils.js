import React from 'react';
import "./Common.css"
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';

const getFileLocation = (customerId, imageType, imageFileName) => {
  return `${customerId}/${imageType}/${uuidv4()}_${imageFileName}`;
}

const getImageSize = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = imageUrl

    img.onload = () => {
      const width = img.naturalWidth
      const height = img.naturalHeight
      resolve({ "width": width, "height": height })
    }

    img.onerror = (error) => {
      reject('Failed to load image: ' + error)
    }
  })
}

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
    checkInteger,
    getImageSize,
    getFileLocation
}