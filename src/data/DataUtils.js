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
        //if exists edit, otherwise add
        const indexExists = newData.templates.findIndex((template) => template.templateName === newTemplate.templateName)
        if (indexExists === -1) {
            newData.templates.push(newTemplate);
        } else {
            newData.templates[indexExists] = newTemplate;
        }
        await updateDoc(customerRef, newData);
    } else {
      console.log("addTemplate - No such document!");
    }
}

const addTemplatePosition = async (customerId, templateIndex, newPosition) => {
    const customerRef = doc(db, "customers", customerId);
    const docSnap = await getDoc(customerRef);

    if (docSnap.exists()) {
        var newData = docSnap.data();
        if (!("templates" in newData)) {
            console.log("addTemplatePosition - No templates in document!");
        } else if (newData.templates.length < templateIndex + 1) {
            console.log("addTemplatePosition - No template on given index!");
        } else {
            if (!("positions" in newData.templates[templateIndex])) {
            newData.templates[templateIndex]["positions"] = [];
            }
            //if exists edit, otherwise add
            const indexExists = newData.templates[templateIndex].positions.findIndex((pos) => pos.positionName === newPosition.positionName)
            if (indexExists === -1) {
                newData.templates[templateIndex].positions.push(newPosition)
            } else {
                newData.templates[templateIndex].positions[indexExists] = newPosition
            }
            await updateDoc(customerRef, newData)
        }
    } else {
        console.log("addTemplatePosition - No such document!");
    }
}

const addSet = async (customerId, newSet ) => {
    const customerRef = doc(db, "customers", customerId);
    const docSnap = await getDoc(customerRef);

    console.log("addSet")

    if (docSnap.exists()) {
        var newData = docSnap.data();
        if (!("sets" in newData)) {
            newData["sets"] = [];
        }
        //if exists edit, otherwise add
        const indexExists = newData.sets.findIndex((set) => set.setName === newSet.setName)
        if (indexExists === -1) {
            newData.sets.push(newSet)
        } else {
            newData.sets[indexExists] = newSet
        }
        await updateDoc(customerRef, newData)
    } else {
      console.log("addSet - No such document!");
    }
}

const removeTemplate = async (customerId, templateIndex) => {
    const customerRef = doc(db, "customers", customerId);
    const docSnap = await getDoc(customerRef);
    
    console.log("removeTemplate")
    console.log(customerId)
    console.log(templateIndex)

    if (docSnap.exists()) {
        var newData = docSnap.data();
        newData.templates.splice(templateIndex, 1)
        await updateDoc(customerRef, newData)
    } else {
      console.log("removeTemplate - No such document!");
    }
}

const removeTemplatePosition = async (customerId, templateIndex, positionIndex) => {
    const customerRef = doc(db, "customers", customerId);
    const docSnap = await getDoc(customerRef);

    if (docSnap.exists()) {
        var newData = docSnap.data();
        if (!("templates" in newData)) {
            console.log("removeTemplatePosition - No templates in document!");
        } else if (newData.templates.length < templateIndex + 1) {
            console.log("removeTemplatePosition - No template on given index!");
        } else if (!("positions" in newData.templates[templateIndex])) {
            console.log("removeTemplatePosition - No positions in template!");
        } else if (newData.templates[templateIndex].positions.length < positionIndex + 1) {
            console.log("removeTemplatePosition - No position on given index!");
        } else {
            newData.templates[templateIndex].positions.splice(positionIndex, 1)
            await updateDoc(customerRef, newData)
        }
    } else {
      console.log("removeTemplatePosition - No such document!");
    }
}

const removeSet = async (customerId, setIndex) => {
    const customerRef = doc(db, "customers", customerId);
    const docSnap = await getDoc(customerRef);

    console.log("removeSet")
    console.log(customerId)
    console.log(setIndex)

    if (docSnap.exists()) {
        var newData = docSnap.data();
        newData.sets.splice(setIndex, 1)
        await updateDoc(customerRef, newData)
    } else {
      console.log("removeSet - No such document!");
    }
}

export {    getCurrentUser, 
            setConfiguration, 
            addTemplate, 
            removeTemplate, 
            addTemplatePosition, 
            removeTemplatePosition,
            addSet,
            removeSet
        }