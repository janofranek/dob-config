import React, {useEffect, useState} from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Form } from "react-bootstrap";
import DeleteConfirmation from './DeleteConfirmation';
import { removeTemplate} from "../data/DataUtils"
import ProductImage from './ProductImage';

const TemplateDetail = (props) => {
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [templateDataFromParent, setTemplateDataFromParent] = useState({})
  const currentCustomer = useCurrentCustomer();

  useEffect(() => {
    if (props.templateIndex && currentCustomer) {
      setTemplateDataFromParent(currentCustomer.templates[props.templateIndex])
    } else {
      setTemplateDataFromParent({imageUrl:null, templateName:null, negative:false})
    }
  }, [props, currentCustomer])

  //wait for data
  if (!currentCustomer ) return "Loading...";

  const submitDelete = () => {
    removeTemplate(currentCustomer.id, props.templateIndex)
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
    props.onEditClick(e);
  }

  return (
    <>
      <ProductImage 
        imgUrl={templateDataFromParent.imageUrl} 
        setImageProps={props.setImageProps}
        positionRect={props.showPositionRect}
      />
      <Form>
        <Form.Group>
          <Form.Label className="col-form-label-sm">Název vzoru</Form.Label>
          <Form.Control 
            type="text"
            size='sm' 
            id="templateName"
            name="templateName"
            readOnly
            value={templateDataFromParent.templateName}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check 
            type="checkbox"
            inline
            id="negative"
            readOnly
            checked={templateDataFromParent.negative}
          />
          <Form.Label className="col-form-label-sm">Použít negativ obrázku</Form.Label>
        </Form.Group>
        <Button 
          variant="primary"
          size='sm'
          type='submit'
          onClick={onEdit}>
          Uprav
        </Button>{" "}
        <Button 
          variant="danger"
          size='sm'
          type='submit'
          onClick={onDelete}>
          Smaž
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
  