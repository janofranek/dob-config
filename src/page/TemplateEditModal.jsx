import React, {useState} from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Form, ProgressBar, Modal, Alert } from "react-bootstrap";
import { addTemplate } from "../data/DataUtils"
import { uploadFileProgress } from "../data/FileUtils"
import { getFileLocation } from "./Utils"

const TemplateEditModal = (props) => {
  const [templateName, setTemplateName] = useState("")
  const [file, setFile] = useState(null)
  const [showProgress, setShowProgress] = useState(false)
  const [progresspercent, setProgresspercent] = useState(0)
  const [disabledSave, setDisabledSave] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const currentCustomer = useCurrentCustomer()

  //wait for data
  if (!currentCustomer ) return "Loading..."

  const showProgressPercent = (percent) => {
    setProgresspercent(percent)
  }

  const onFileChange = (e) => {
    const files = e.target.files
    if (!files[0]) return

    setFile(files[0])
  }

  const initModal = () => {
    if (props.oldTemplate) {
      setTemplateName(props.oldTemplate.templateName);
    } else {
      setTemplateName("");
    }
    setFile(null)
  }

  const saveTemplate = async (fileLocation, downloadURL) => {
    const newTemplate = {
      "fileLocation": fileLocation,
      "imageUrl": downloadURL,
      "templateName": templateName
    }
    try {
      await addTemplate(currentCustomer.id, newTemplate, props.oldTemplate?.templateName);
    }
    catch (error) {
      setErrorMsg(error.message)
    }
  }

  const justSave = async () => {
    try {
      await saveTemplate(currentCustomer.templates[props.templateIndex].fileLocation, currentCustomer.templates[props.templateIndex].imageUrl)
    }
    catch (error) {
      setErrorMsg(error.message)
    }
  }
  
  const uploadAndSave = async (fileLocation) => {

    setShowProgress(true)

    try {
      const downloadURL = await uploadFileProgress(fileLocation, file, showProgressPercent)
      await saveTemplate(fileLocation, downloadURL)
    }
    catch (error) {
      setErrorMsg(error.message)
    }

    setShowProgress(false)

  }

  const onSave = async (e) => {
    e.preventDefault();

    if (!templateName) {
      setErrorMsg("Název podkladu nemůže být prázdný")
      return
    }

    if (( !file && !props.oldTemplate )) {
      setErrorMsg("Je potřeba vybrat nějaký soubor s fotkou podkladu")
      return
    }

    setDisabledSave();

    try {
      if (!file && props.oldTemplate) {
        await justSave()
      } else if (file) {
        const fileLocation = getFileLocation(currentCustomer.id, "templates", file.name)
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
                id="templateName"
                name="templateName"
                placeholder='Zadej název vzoru'
                value={templateName}
                required
                onChange={(e)=>setTemplateName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary"
            size='sm'
            onClick={onCancel}>
            Zrušit změny
          </Button>{" "}
          <Button 
            variant="primary"
            type='submit'
            size='sm'
            disabled={disabledSave}
            onClick={onSave}>
            Uložit
          </Button>
        </Modal.Footer>
        {errorMsg && <Alert variant="danger" onClose={() => setErrorMsg("")} dismissible><p>{errorMsg}</p></Alert>}
      </Modal>
    </>
  )
}

export default TemplateEditModal
