import { React, useState, useEffect } from 'react';
import "./Common.css"
import { Form } from "react-bootstrap";

const SelectTemplates = (props) => {
  const[isCheckedLocal, setIsCheckedLocal] = useState([]);

  useEffect(() => {
    if (props.templatesList && props.selectedTemplates) {
      let i;
      let isCheckedNew = [];
      for (i in props.templatesList) {
        isCheckedNew.push(props.selectedTemplates.includes(props.templatesList[i].templateName))
      }
      setIsCheckedLocal(isCheckedNew)
    }
  }, [props])

  const onChange = (e) => {
    e.preventDefault();
    let isCheckedNew = isCheckedLocal;
    isCheckedNew[e.target.id] = !isCheckedNew[e.target.id];
    setIsCheckedLocal(isCheckedNew);
    props.onTemplatesClick(e);
  }

  if (!props.selectedTemplates) return "Loading...";

  return (
    <>
      <Form.Group>
        <Form.Label className="col-form-label-sm">Vzory</Form.Label>
          {props.templatesList.map( (row, index) => {
            return (
              <Form.Check
                type='checkbox' 
                key={index}
                id={`${index}`}
                checked={isCheckedLocal[index]}
                onChange={onChange}
                label={row.templateName}
              />
            )
          })}
      </Form.Group>
    </>
  )
}

export default SelectTemplates