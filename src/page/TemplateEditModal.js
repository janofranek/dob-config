import React, {useState} from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Form, ProgressBar, Modal, Alert } from "react-bootstrap";
import { addTemplate } from "../data/DataUtils"
import { uploadFile } from "../data/FileUtils"

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

  const showProgressBar = (show) => {
    setShowProgress(show)
  }

  const showProgressPercent = (percent) => {
    setProgresspercent(percent)
  }

  const setErrorMessage = (msg) => {
    setErrorMsg(msg)
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

  const saveTemplate = (downloadURL) => {
    const newTemplate = {
      "imageUrl": downloadURL,
      "templateName": templateName,
    }
    return addTemplate(currentCustomer.id, newTemplate);
  }

  const justSave = () => {
    console.log("justSave")
    return saveTemplate(currentCustomer.templates[props.templateIndex].imageUrl)
  }

  
  const uploadAndSave = (fileLocation) => {

    uploadFile(fileLocation, file, showProgressBar, showProgressPercent, saveTemplate, setErrorMessage)

  }

  const onSave = (e) => {
    var result = {}
    console.log("onSave")

    e.preventDefault();

    if (!templateName) {
      setErrorMsg("Název podkladu nemůže být prázdný")
      return
    }

    if (( !file && props.mode === "new" )) {
      setErrorMsg("Je potřeba vybrat nějaký soubor s fotkou podkladu")
      return
    }

    setDisabledSave();
  
    if (!file && props.mode === "edit") {
      result = justSave()
    } else if (file) {
      console.log("uploadAndSave")
      const fileLocation = `${currentCustomer.id}/templates/${templateName}_${file.name}`;
      result = uploadAndSave(fileLocation);
      console.log(result)
    }
    console.log("onSave - finish")
    console.log(errorMsg)
    if (!errorMsg) {
      props.hideModal();
    }

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
