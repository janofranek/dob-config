import { React, useEffect, useState } from 'react'
import { Modal, Button } from "react-bootstrap";

const DeleteConfirmation = ({ showModal, hideModal, confirmModal, message }) => {
  const [isDeteleDisabled, setIsDeleteDisabled] = useState(false)

  const onDelete = (e) => {
    e.preventDefault();
    setIsDeleteDisabled(true);
    confirmModal();
    hideModal();
    setIsDeleteDisabled(false);
  }

  useEffect(() => {
    setIsDeleteDisabled(false);
  },[])

  return (
      <Modal show={showModal} onHide={hideModal} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Delete Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body><div className="alert alert-danger">{message}</div></Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={hideModal}>
          Cancel
        </Button>
        <Button variant="danger" disabled={isDeteleDisabled} onClick={onDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteConfirmation;