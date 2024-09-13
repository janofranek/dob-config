//Firebase storage init
import { storage } from '../cred/firebase';
import { ref, getDownloadURL, uploadBytes, uploadBytesResumable, deleteObject } from "firebase/storage";

const deleteFile = async (fileLocation) => {

  try {
    const storageRef = ref(storage, fileLocation)
    await deleteObject(storageRef)
  }
  catch (error) {
    if ( error.code === "storage/object-not-found" ) {
      return
    }
    throw error
  }


}

//Firebase storage without progress info
const uploadFileSimple = async(fileLocation, file) => {

  const storageRef = ref(storage, fileLocation)
  
  const snapshot = await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref) 
  return(downloadURL)
}


//Firebase storage with progress info
const uploadFileProgress = async (destFileLocation, srcFile, showProgressPercent) => {

  const storageRef = ref(storage, destFileLocation)
  const uploadTask = uploadBytesResumable(storageRef, srcFile)
  
  return new Promise((resolve, reject) => {

    uploadTask.on("state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        showProgressPercent(progress)
      },
      (error) => {
        reject(error)
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      })
  })
}

export { deleteFile, uploadFileSimple, uploadFileProgress }