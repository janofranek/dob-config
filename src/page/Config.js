import React, {useState} from 'react';
import { Navigate } from "react-router-dom";
import "./Common.css"
import { Form, Button, InputGroup } from "react-bootstrap";
import { useAuth } from '../data/AuthProvider';
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { setConfiguration } from '../data/DataUtils';

const ConfigForm = (props) => {
  const [formData, setFormData] = useState({});
  const config = props.currentCustomer.configuration;

  //TODO data validation
  //TODO database error handling

  const onChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const newData = {};
    newData["resultWidth"] = formData["resultWidth"] ?? config["resultWidth"]
    newData["resultHeight"] = formData["resultHeight"] ?? config["resultHeight"]
    newData["resultWiresultBackgrounddth"] = formData["resultBackground"] ?? config["resultBackground"]
    setConfiguration(props.currentCustomer.id, newData)
    //TODO success confirmation
  }

  return (
    <>
      <p>Parametry výsledného obrázku</p>
      <Form>
        <InputGroup className="mb-1">
          <InputGroup.Text id="label1">Šířka (pixely)</InputGroup.Text>
          <Form.Control
            type="number"
            id="resultWidth"
            value={formData["resultWidth"] ?? config["resultWidth"]}
            aria-label="ResultWidth"
            aria-describedby="label1"
            onChange={onChange}
          />
        </InputGroup>
        <InputGroup className="mb-1">
          <InputGroup.Text id="label2">Výška (pixely)</InputGroup.Text>
          <Form.Control
            id="resultHeight"
            value={formData["resultHeight"] ?? config["resultHeight"]}
            aria-label="ResultHeight"
            aria-describedby="label2"
            onChange={onChange}
          />
        </InputGroup>
        <InputGroup className="mb-1">
          <InputGroup.Text id="label3">Barva pozadí</InputGroup.Text>
          <Form.Control
            id="resultBackground"
            type="color"
            value={formData["resultBackground"] ?? config["resultBackground"]}
            aria-label="ResultBackground"
            aria-describedby="label3"
            onChange={onChange}
          />
        </InputGroup>
        <Button 
          variant="primary" 
          type="submit"
          onClick={onSubmit}
        >Uložit změny</Button>
      </Form>
    </>
  )
}


const Config = () => {

  //load data
  const authEmail = useAuth();
  const currentCustomer = useCurrentCustomer();

  //if not logged in, redirect to login page
  if (!authEmail) {
    return <Navigate to="/login" />;
  }

  //wait for data
  if (!currentCustomer ) return "Loading...";

  return (
    <>
      <ConfigForm currentCustomer={currentCustomer}/>
    </>
  )

}

export default Config