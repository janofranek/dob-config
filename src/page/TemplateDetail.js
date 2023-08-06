import React, {useEffect, useState} from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Form } from "react-bootstrap";
import DeleteConfirmation from './DeleteConfirmation';
import { removeTemplate} from "../data/DataUtils"
import Canvas from './Canvas';
import ProductImage from './ProductImage';

const TemplateDetail = (props) => {
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [templateDataFromParent, setTemplateDataFromParent] = useState({})
  const currentCustomer = useCurrentCustomer();

  useEffect(() => {
    if (props.templateIndex && currentCustomer) {
      setTemplateDataFromParent(currentCustomer.templates[props.templateIndex])
      console.log(currentCustomer.templates[props.templateIndex])
    } else {
      setTemplateDataFromParent({imageUrl:null, templateName:null, negative:false})
    }
  }, [props, currentCustomer])

  //wait for data
  if (!currentCustomer ) return "Loading...";

  const submitDelete = () => {
    removeTemplate(currentCustomer.id, templateDataFromParent.templateIndex)
    setDisplayConfirmationModal(false);
  };

  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const onDelete = (e) => {
    e.preventDefault();
    setDeleteMessage(`Opravdu chceš smazat vzor '${templateDataFromParent.templateName}'?`);
    setDisplayConfirmationModal(true);
  }

  const onEdit = (e) => {
    e.preventDefault();
    //TODO start modal for edit
  }

  return (
    <>
      <div className="outsideWrapper">
        <div className="insideWrapper">
          <ProductImage imgUrl={templateDataFromParent.imageUrl} />
          <Canvas className="coveringCanvas" id="testCanvas" width="450px" height="350px" imageId="product-image"/>
        </div>
      </div>
      <Form>
        <Form.Group>
          <Form.Label className="col-form-label-sm">Název vzoru</Form.Label>
          <Form.Control 
            type="text"
            size='sm' 
            id="templateName"
            name="templateName"
            value={templateDataFromParent.templateName}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check 
            type="checkbox"
            inline
            id="negative"
            checked={templateDataFromParent.negative}
          />
          <Form.Label className="col-form-label-sm">Použít negativ obrázku</Form.Label>
        </Form.Group>
        <Button 
          variant="primary"
          size='sm'
          type='submit'
          onClick={onEdit}>
          Editovat
        </Button>{" "}
        <Button 
          variant="danger"
          size='sm'
          type='submit'
          onClick={onDelete}>
          Smazat
        </Button>
      </Form>
      <DeleteConfirmation 
        showModal={displayConfirmationModal} 
        confirmModal={submitDelete} 
        hideModal={hideConfirmationModal} 
        message={deleteMessage}  
      />
    </>
  )
}

export default TemplateDetail
  