import { React, useState, useEffect } from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Form } from "react-bootstrap";
import DeleteConfirmation from './DeleteConfirmation';
import { removeSet} from "../data/DataUtils"
import SelectTemplates from './SelectTemplates';

const SetDetail = (props) => {

  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [setDataFromParent, setSetDataFromParent] = useState({setName:"", setTemplates:[]})
  const currentCustomer = useCurrentCustomer();

  useEffect(() => {


    if (props.setIndex && currentCustomer) {
      setSetDataFromParent(currentCustomer.sets[props.setIndex]);
    } else {
      setSetDataFromParent({setName:"", setTemplates:[]});
    }
  }, [props, currentCustomer])

  // wait for data
  if (!currentCustomer ) return "Loading...";

  const submitDelete = () => {
    removeSet(currentCustomer.id, Number(props.setIndex))
    setDisplayConfirmationModal(false);
  };

  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const onDelete = (e) => {
    e.preventDefault();
    setDeleteMessage(`Opravdu chceš smazat skupinu '${setDataFromParent.setName}'?`);
    setDisplayConfirmationModal(true);
  }

  const onTemplatesClick = (e) => {
    e.preventDefault();
    //here just read-only, so ignore clicks
  }

  return ( 
    <>
      <Form>
        <Form.Group>
          <Form.Label className="col-form-label-sm">Název skupiny</Form.Label>
          <Form.Control 
            type="text"
            size='sm' 
            id="setName"
            name="setName"
            readOnly
            value={setDataFromParent.setName}
          />
        </Form.Group>
        <Form.Group>
          <SelectTemplates
            templatesList={currentCustomer.templates}
            selectedTemplates={setDataFromParent.setTemplates}
            onTemplatesClick={onTemplatesClick}
          />
        </Form.Group>
        <Button 
          variant="primary"
          size='sm'
          type='submit'
          onClick={props.onEditClick}>
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

export default SetDetail

