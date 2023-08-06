import React, {useEffect, useState} from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Button, Image, Form, ProgressBar, Modal } from "react-bootstrap";
import { run as runHolder } from 'holderjs/holder';
import { storage } from '../cred/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { addTemplate } from "../data/DataUtils"

const TemplateEditModal = (props) => {
  const [templateName, setTemplateName] = useState("")
  const [negative, setNegative] = useState(false)
  const [file, setFile] = useState(null)
  const [imgUrl, setImgUrl] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progresspercent, setProgresspercent] = useState(0);
  const [disabledSave, setDisabledSave] = useState(false);

  const currentCustomer = useCurrentCustomer();

  useEffect(() => {        
    runHolder('image-class-name');
    if (props.mode === "new") {
      setImgUrl(null)
      setTemplateName(null)
      setNegative(false)
      setFile(null)
    }
  }, [props.mode]);

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
      "negative": negative
    }
    addTemplate(currentCustomer.id, newTemplate);
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
            setImgUrl(downloadURL);
            saveTemplate(downloadURL);
            setShowProgress(false);
            props.hideModal()
          });
        }
      );
  }

  const onSave = (e) => {
    e.preventDefault();

    if (!file || !templateName) return;
    //TODO better validation + unique template name

    setDisabledSave();

    const fileLocation = `${currentCustomer.id}/${templateName}_${file.name}`;
    uploadAndSave(fileLocation);
    //TODO check and report errors
  }

  return (
    <>        
      <Modal show={props.showModal} onHide={props.hideModal} backdrop="static">
        <Modal.Body>

          { !imgUrl && <Image src="holder.js/300x300?text=Obrázek" /> } 
          { imgUrl && <Image src={imgUrl} height={300}/> }
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
                required
                onChange={(e)=>setTemplateName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Check 
                type="checkbox"
                inline
                id="negative"
                defaultChecked={false}
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
