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

const addDictionariesPosition = async (customerId, newPositionName, oldPositionName) => {
    const customerRef = doc(db, "customers", customerId);
    const docSnap = await getDoc(customerRef);

    if (docSnap.exists()) {
        var newData = docSnap.data();
        //if there is no dictionaries element - add it
        if (!("dictionaries" in newData)) {
            newData.dictionaries = {};
        }
        //if there is no positions array - add it
        if (!("positions" in newData.dictionaries)) {
            newData.dictionaries.positions = [];
        } 
        //if already exists, there is nothing to do
        if (newData.dictionaries.positions.find((pos) => pos === newPositionName)) {
            return;
        } 
        //if we have oldPositionName, it is update
        if (oldPositionName) {
            const indexExists = newData.dictionaries.positions.findIndex((pos) => pos === oldPositionName)
            //but if oldPositionName is not there, there is nothing to update
            if (indexExists === -1) {
                return;
            }
            newData.dictionaries.positions.splice(indexExists, 1, newPositionName);

        } else {
            //otherwise just add new position name
            newData.dictionaries.positions.push(newPositionName);
        }
        await updateDoc(customerRef, newData);
    } else {
        console.log("addDictionariesPosition - No such document!");
    }
}

const addSet = async (customerId, setIndex, newSet ) => {
    const customerRef = doc(db, "customers", customerId);
    const docSnap = await getDoc(customerRef);
    const indexNum = Number(setIndex);

    if (docSnap.exists()) {
        var newData = docSnap.data();
        //if there is not sets element - add it
        if (!("sets" in newData)) {
            newData["sets"] = [];
        }
        //if there is set index, it is edit
        if (indexNum >= 0) {
            //but if it does not exists, there is nothing to do
            if (newData.sets.length < indexNum + 1) {
                console.log("addSet - given index does not exists");
                return;
            }
            //and if there already is new set name used, there is nothing to do
            const indexExists = newData.sets.findIndex((set) => set.setName === newSet.setName)
            if (indexExists > -1 && !(indexExists === indexNum)) {
                console.log("addSet - given set name already exists");
                return;
            }
            //otherwise edit
            newData.sets[indexNum] = newSet;
            await updateDoc(customerRef, newData)
        } else {
            //with no index it is addition
            //but if the set name is already in use, there will be no action
            const indexExists2 = newData.sets.findIndex((set) => set.setName === newSet.setName)
            if (indexExists2 > -1) {
                console.log("addSet - given set name already exists");
                return;
            }
            //otherwise add
            newData.sets.push(newSet);
            await updateDoc(customerRef, newData);
        }
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

const removeDictionariesPosition = async (customerId, deletePositionName) => {
    const customerRef = doc(db, "customers", customerId);
    const docSnap = await getDoc(customerRef);

    if (docSnap.exists()) {
        var newData = docSnap.data();
        // no dictionaries, nothing to do
        if (!("dictionaries" in newData)) {
            return;
        }
        // no positions, nothing to do
        if (!("positions" in newData.dictionaries)) {
            return;
        } 
        const indexExists = newData.dictionaries.positions.findIndex((pos) => pos === deletePositionName)
        if (indexExists === -1) {
            return;
        }

        newData.dictionaries.positions.splice(indexExists, 1);
        await updateDoc(customerRef, newData);
        
    } else {
        console.log("removeDictionariesPosition - No such document!");
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
            removeSet,
            addDictionariesPosition,
            removeDictionariesPosition
        }