import { storage } from '../cred/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const uploadFile = (fileLocation, file, showProgressBar, showProgressPercent, saveToDb, setErrorMsg) => {
    console.log("uploadFile")
    showProgressBar(true)

    const storageRef = ref(storage, fileLocation);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on("state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log("state_changed - snapshot")
        showProgressPercent(progress);
      },
      (error) => {
        console.log("state_changed - snapshot")
        console.log(error)
        setErrorMsg(error.message)
      },
      () => {
        console.log("state_changed - finish")
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          showProgressBar(false);
          console.log(downloadURL)
          saveToDb(downloadURL)
        });
      }
    );

  }

  export { uploadFile }