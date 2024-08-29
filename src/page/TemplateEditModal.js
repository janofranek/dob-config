import React, {useEffect, useState} from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Form, ProgressBar, Modal } from "react-bootstrap";
import { storage } from '../cred/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { addTemplate } from "../data/DataUtils"

const TemplateEditModal = (props) => {
  const [templateName, setTemplateName] = useState("")
  const [negative, setNegative] = useState(false)
  const [file, setFile] = useState(null)
  const [showProgress, setShowProgress] = useState(false);
  const [progresspercent, setProgresspercent] = useState(0);
  const [disabledSave, setDisabledSave] = useState(false);

  const currentCustomer = useCurrentCustomer();

  useEffect(() => {        
    if (props.mode === "new") {
      setTemplateName(null)
      setNegative(false)
      setFile(null)
    } else if (props.mode === "edit" && currentCustomer) {
      setTemplateName(currentCustomer.templates[props.templateIndex].templateName)
      setNegative(currentCustomer.templates[props.templateIndex].negative)
      setFile(null)
    }
  }, [props, currentCustomer]);

  //wait for data
  if (!currentCustomer ) return "Loading...";

  const onFileChange = (e) => {
    const files = e.target.files
    if (!files[0]) return

    setFile(files[0])
  }

  const saveTemplate = (downloadURL) => {
    const newTemplate = {
      "imageUrl": downloadURL,
      "templateName": templateName,
      "negative": Boolean(negative)
    }
    addTemplate(currentCustomer.id, newTemplate);
  }

  const justSave = () => {
    saveTemplate(currentCustomer.templates[props.templateIndex].imageUrl);
    props.hideModal();
  }

  const uploadAndSave = (fileLocation) => {
    setShowProgress(true)

    const storageRef = ref(storage, fileLocation);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
      uploadTask.on("state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgresspercent(progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            saveTemplate(downloadURL);
            setShowProgress(false);
            props.hideModal()
          });
        }
      );
  }

  const onSave = (e) => {
    e.preventDefault();

    if (( !file && props.mode === "new" ) || !templateName) return;
    //TODO better validation + unique template name

    setDisabledSave();


    if (!file && props.mode === "edit") {
      justSave();
    } else if (file) {
      const fileLocation = `${currentCustomer.id}/${templateName}_${file.name}`;
      uploadAndSave(fileLocation);
      //TODO check and report errors
    }

  }

  return (
    <>        
      <Modal show={props.showModal} onHide={props.hideModal} backdrop="static">
        <Modal.Body>

          { showProgress && <ProgressBar stripped variant="info" now={progresspercent} />}
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
            <Form.Group>
              <Form.Check 
                type="checkbox"
                inline
                id="negative"
                checked={negative}
                onChange={(e)=>setNegative(e.target.checked)}
              />
              <Form.Label className="col-form-label-sm">Použít negativ obrázku</Form.Label>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary"
            size='sm'
            type='submit'
            onClick={props.hideModal}>
            Zrušit změny
          </Button>{" "}
          <Button 
            variant="primary"
            size='sm'
            disabled={disabledSave}
            onClick={onSave}>
            Uložit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default TemplateEditModal
