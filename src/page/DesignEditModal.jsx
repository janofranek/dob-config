import React, {useState} from 'react';
import "./Common.css"
import { Button, Form, Modal, Alert, ProgressBar } from "react-bootstrap";
import { addDesign } from "../data/DataUtils"
import { getImageSize, getFileLocation } from "./Utils"
import { uploadFileProgress } from "../data/FileUtils"

const DesignEditModal = (props) => {

  const [designName, setDesignName] = useState("")
  const [file, setFile] = useState(null)
  const [showProgress, setShowProgress] = useState(false)
  const [progresspercent, setProgresspercent] = useState(0)
  const [disabledSave, setDisabledSave] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const showProgressPercent = (percent) => {
    setProgresspercent(percent)
  }

  const onFileChange = (e) => {
    const files = e.target.files
    if (!files[0]) return

    setFile(files[0])
  }

  const initModal = () => {
    if (props.oldDesign) {
      setDesignName(props.oldDesign.designName);
    } else {
      setDesignName("");
    }
  }

  const saveDesign = async (fileLocation, downloadURL) => {
    console.log("saveDesign")
    const imageDimensions = await getImageSize(downloadURL)
    console.log(imageDimensions)
    const newDesign = {
      "fileLocation": fileLocation,
      "imageUrl": downloadURL,
      "designName": designName,
      "imageWidth": imageDimensions.width,
      "imageHeight": imageDimensions.height
    }
    console.log(newDesign)

    await addDesign(props.currentCustomer.id, newDesign, props.oldDesign?.designName);
  }

  const justSave = async () => {
    await saveDesign(props.currentCustomer.designs[props.designIndex].fileLocation, props.currentCustomer.designs[props.designIndex].imageUrl)
  }
  
  const uploadAndSave = async (fileLocation) => {
    setShowProgress(true)
    const downloadURL = await uploadFileProgress(fileLocation, file, showProgressPercent)
    await saveDesign(fileLocation, downloadURL)
    setShowProgress(false)
  }

  const onSave = async (e) => {
    e.preventDefault();

    if (!designName) {
      setErrorMsg("Název vzoru nemůže být prázdný");
      return;
    }

    if (( !file && !props.oldDesign )) {
      setErrorMsg("Je potřeba vybrat nějaký soubor s fotkou vzoru")
      return
    }

    setDisabledSave();

    try {
      if (!file && props.oldDesign) {
        await justSave()
      } else if (file) {
        const fileLocation = getFileLocation(props.currentCustomer.id, "designs", file.name)
        await uploadAndSave(fileLocation);
      }
    }
    catch (error) {
      setErrorMsg(error.message)
      return
    }

    props.hideModal();

  }

  const onCancel = (e) => {
    e.preventDefault();
    props.hideModal()
    setErrorMsg("");
  }

  return (
    <>        
      <Modal show={props.showModal} onHide={props.hideModal} onEnter={initModal} backdrop="static">
        <Modal.Body>
        { showProgress && <ProgressBar stripped="true" variant="info" now={progresspercent} />}
          <Form>
            <Form.Group>
              <Form.Label className="col-form-label-sm">Soubor se vzorem</Form.Label>
              <Form.Control 
                type="file" 
                size='sm'
                id="fileName"
                name="fileName"
                placeholder='Vyber soubor se vzorem'
                accept="image/png, image/jpeg"
                required
                onChange={onFileChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="col-form-label-sm">Název vzoru</Form.Label>
              <Form.Control 
                type="text"
                size='sm' 
                id="designName"
                name="designName"
                placeholder='Zadej název vzoru'
                value={designName}
                required
                onChange={(e)=>setDesignName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary"
            size='sm'
            onClick={onCancel}>
            Zruš změny
          </Button>{" "}
          <Button 
            variant="primary"
            type="submit"
            size='sm'
            disabled={disabledSave}
            onClick={onSave}>
            Ulož
          </Button>
        </Modal.Footer>
        {errorMsg && <Alert variant="danger" onClose={() => setErrorMsg("")} dismissible><p>{errorMsg}</p></Alert>}
      </Modal>
    </>
  )
}

export default DesignEditModal
