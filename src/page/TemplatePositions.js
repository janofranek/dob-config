import React, {useEffect, useState} from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Table } from "react-bootstrap";
import DeleteConfirmation from './DeleteConfirmation';
import { removeTemplatePosition } from "../data/DataUtils"
import { getPositionObject, getHeightFromAR } from "./Utils"

const TemplatePositions = (props) => {
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [templateDataFromParent, setTemplateDataFromParent] = useState({})
  const [positionIndex, setPositionIndex] = useState(null)
  const currentCustomer = useCurrentCustomer();

  useEffect(() => {
    if (props.templateIndex && currentCustomer) {
      setTemplateDataFromParent(currentCustomer.templates[props.templateIndex])
    } else {
      setTemplateDataFromParent({imageUrl:null, templateName:null, negative:false, positions:[]})
    }
  }, [props, currentCustomer])

  //wait for data
  if (!currentCustomer ) return "Loading...";

  const submitDelete = () => {
    removeTemplatePosition(currentCustomer.id, Number(props.templateIndex), Number(positionIndex))
    setDisplayConfirmationModal(false);
  };

  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const onPositionDelete = (e) => {
    e.preventDefault();
    setDeleteMessage(`Opravdu chceš smazat obrázek '${templateDataFromParent.positions[e.target.id].positionName}'?`);
    setPositionIndex(e.target.id)
    setDisplayConfirmationModal(true);
  }

  const onPositionShow = (e) => {
    e.preventDefault();

    const positionObject = getPositionObject(currentCustomer, templateDataFromParent.positions[e.target.id].positionName)
    const newPosition = {
      left: templateDataFromParent.positions[e.target.id].left,
      top: templateDataFromParent.positions[e.target.id].top,
      width: templateDataFromParent.positions[e.target.id].width,
      height: getHeightFromAR( templateDataFromParent.positions[e.target.id].width, positionObject )
    }
    props.setShowPositionRect(newPosition)
  }

  return (
    <>
      <Button
        variant="primary"
        size='sm'
        type="submit"
        onClick={props.onNewClick}>
        Nový obrázek
      </Button>
      {!(typeof templateDataFromParent === "object" && "positions" in templateDataFromParent) && <p>Zatím neexistuje žádná pozice</p>}
      {(typeof templateDataFromParent === "object" && "positions" in templateDataFromParent) &&
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>Obrázek</th>
              <th>L/H/Š</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {templateDataFromParent.positions.map( (row, index) => {
              return (
                <tr key={index}>
                  <td id={index}>{index+1}</td>
                  <td id={index}>{row.positionName}</td>
                  <td id={index}>{row.left}/{row.top}/{row.width}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size='sm'
                      type="submit"
                      id={index}
                      onClick={onPositionDelete}>
                      Smaž
                    </Button>
                    <br/>
                    <Button
                      variant="outline-info"
                      size='sm'
                      type="submit"
                      id={index}
                      onClick={onPositionShow}>
                      Ukaž
                    </Button>
                    <br/>
                    <Button
                      variant="outline-primary"
                      size='sm'
                      type="submit"
                      id={index}
                      onClick={props.onEditClick}>
                      Uprav
                    </Button>
                  </td>
                </tr>
              )
  
            })}
          </tbody>
        </Table>
      }
      <DeleteConfirmation 
        showModal={displayConfirmationModal} 
        confirmModal={submitDelete} 
        hideModal={hideConfirmationModal} 
        message={deleteMessage}  
      />
    </>
  )
}

export default TemplatePositions
