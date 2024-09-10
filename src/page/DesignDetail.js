import { React, useState, useEffect } from 'react';
import "./Common.css"
import { Form } from "react-bootstrap";

const DesignDetail = (props) => {

  const [designDataFromParent, setDesignDataFromParent] = useState({setName:"", setTemplates:[]})

  useEffect(() => {


    if (props.designIndex && props.currentCustomer) {
      setDesignDataFromParent(props.currentCustomer.designs[props.designIndex]);
    } else {
      setDesignDataFromParent({designName:"", imageUrl:null});
    }
  }, [props])

  return ( 
    <>
      <Form>
        <Form.Group>
          <Form.Label className="col-form-label-sm">Název vzoru</Form.Label>
          <Form.Control 
            type="text"
            size='sm' 
            id="designName"
            name="designName"
            readOnly
            value={designDataFromParent.designName}
          />
        </Form.Group>
      </Form>
    </>
  )
}

export default DesignDetail

