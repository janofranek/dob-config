import { db } from '../cred/firebase';
import { doc, updateDoc, getDoc } from "firebase/firestore";

const getCurrentUser = (users, authEmail) => {
    if (!users || !authEmail) {
        return null;
    } else {
        return users.filter(s => s.id === authEmail)[0];
    }
}

const setConfiguration = async (customerId, newData) => {
    const customerRef = doc(db, "customers", customerId);
    await updateDoc(customerRef, { configuration: newData });
}

const addTemplate = async (customerId, newTemplate) => {
    const customerRef = doc(db, "customers", customerId);
    const docSnap = await getDoc(customerRef);

    if (docSnap.exists()) {
        var newData = docSnap.data();
        if (!("templates" in newData)) {
            newData["templates"] = [];
        }
        newData.templates.push(newTemplate)
        await updateDoc(customerRef, newData)
    } else {
      console.log("addTemplate - No such document!");
    }
}

const removeTemplate = async (customerId, templateIndex) => {
    const customerRef = doc(db, "customers", customerId);
    const docSnap = await getDoc(customerRef);

    if (docSnap.exists()) {
        var newData = docSnap.data();
        newData.templates.splice(templateIndex, 1)
        await updateDoc(customerRef, newData)
    } else {
      console.log("removeTemplate - No such document!");
    }
}

export {getCurrentUser, setConfiguration, addTemplate, removeTemplate}