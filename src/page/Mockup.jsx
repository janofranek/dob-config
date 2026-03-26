import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import "./Common.css"
import { useAuth } from '../data/AuthProvider';
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Form, Button, Alert } from 'react-bootstrap';


const Mockup = () => {
  const [imageData, setImageData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [templateName, setTemplateName] = useState("")
  const [positionName, setPositionName] = useState("")
  const [designName, setDesignName] = useState("")

  const onSetTemplateName = (e) => {
    setTemplateName(e.target.value)
  }

  const onSetPositionName = (e) => {
    setPositionName(e.target.value)
  }

  const onSetDesignName = (e) => {
    setDesignName(e.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setImageData('')
    

    const params = {}
    params.template = templateName
    params.position = positionName
    params.design = designName

    console.log(JSON.stringify(params))

    try {
      const response = await fetch('https://dob-api-test-1088427128533.europe-west3.run.app/generate_mockup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "x-api-key": "f742f489-2f5f-43e6-8952-1a75a619f1ae"
        },
        body: JSON.stringify(params),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log(result)
        throw new Error(`HTTP status: ${response.status} - ${result.error}`);
      }
      
      setImageData(result.mockup);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  //load data
  const authEmail = useAuth()
  const currentCustomer = useCurrentCustomer()

  //if not logged in, redirect to login page
  if (!authEmail) {
    return <Navigate to="/login" />
  }

  //wait for data
  if (!currentCustomer ) return "Loading..."
  
  return (
    <>
      <Form>
        <Form.Group>
          <Form.Label className="col-form-label-sm">Název podkladu</Form.Label>
          <Form.Select 
            size='sm' 
            id="templateName"
            name="templateName"
            placeholder='Zadej název podkladu'
            value={templateName}
            required
            onChange={(e) => { onSetTemplateName(e)}}
          >
            <option>Vyber podklad ze seznamu</option>
            {currentCustomer.templates.map((row, index) => {
              return (
                <option key={index} value={row.templateName}>{row.templateName}</option>
              )
            })}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label className="col-form-label-sm">Název obrázku</Form.Label>
          <Form.Select 
            size='sm' 
            id="positionName"
            name="positionName"
            placeholder='Zadej název obrázku'
            value={positionName}
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
        <Form.Group>
          <Form.Label className="col-form-label-sm">Název vzoru</Form.Label>
          <Form.Select 
            size='sm' 
            id="designName"
            name="designName"
            placeholder='Zadej název vzoru'
            value={designName}
            required
            onChange={(e) => { onSetDesignName(e)}}
          >
            <option>Vyber vzor ze seznamu</option>
            {currentCustomer.designs.map((row, index) => {
              return (
                <option key={index} value={row.designName}>{row.designName}</option>
              )
            })}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Button 
            variant="primary"
            size='sm'
            type="submit"
            disabled={loading}
            onClick={handleSubmit}>
            {loading ? 'Generuji...' : 'Vygeneruj mockup'}
          </Button>
        </Form.Group>
      </Form>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible><p>{error}</p></Alert>}
      
      {imageData && (
        <div>
          <img src={`data:image/jpeg;base64,${imageData}`} alt="Generated" />
        </div>
      )}
    </>
  );
};

export default Mockup;