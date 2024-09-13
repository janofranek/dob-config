import { db } from '../cred/firebase';
import { doc, updateDoc, getDoc } from "firebase/firestore";

const getCurrentUser = (users, authEmail) => {
    if (!users || !authEmail) {
        return null;
    } else {
        return users.filter(s => s.id === authEmail)[0];
    }
}

const addTemplatePosition = async (customerId, templateIndex, newTemplatePosition, oldTemplatePositionName) => {

    var errorMsg = ""
    const customerRef = doc(db, "customers", customerId)
    const docSnap = await getDoc(customerRef)

    if (docSnap.exists()) {
        var newData = docSnap.data()
        if (!("templates" in newData)) {
            errorMsg = `Problém - nenašel jsem žádné podklady`
        } else if (newData.templates.length < templateIndex + 1) {
            errorMsg = `Problém - nenašel jsem správný podklady`
        } else {
            if (!("positions" in newData.templates[templateIndex])) {
                newData.templates[templateIndex]["positions"] = []
            }
            //if we have oldTemplatePositionName, it is update
            if (oldTemplatePositionName) {
                const indexExists = newData.templates[templateIndex].positions.findIndex((pos) => pos.positionName === oldTemplatePositionName);
                //but if oldTemplatePositionName is not there, there is nothing to update
                if (indexExists === -1) {
                    errorMsg = `Nenašel jsem obrázek - ${oldTemplatePositionName}`;
                }
                //if oldTemplatePositionName is not the same as new one and new one exists, we have a unique key violation
                else if (oldTemplatePositionName !== newTemplatePosition.positionName) {
                    const indexExistsNew = newData.templates[templateIndex].positions.findIndex((pos) => pos.positionName === newTemplatePosition.positionName);
                    if (indexExistsNew !== -1) {
                        errorMsg = `Tento název je již obsazený - ${newTemplatePosition.positionName}`;
                    }
                }
                //if all is peachy, replace old data
                if (!errorMsg) {
                    newData.templates[templateIndex].positions.splice(indexExists, 1, newTemplatePosition);
                }
            } else {
                //if new object name already exists, no no
                const indexExistsNew = newData.templates[templateIndex].positions.findIndex((pos) => pos.positionName === newTemplatePosition.positionName);
                if (indexExistsNew !== -1) {
                    errorMsg = `Tento název je již obsazený - ${newTemplatePosition.positionName}`;
                }
                //otherwise just add new data
                else { 
                    newData.templates[templateIndex].positions.push(newTemplatePosition);
                }
            }
            //if there is no error, beam it up
            if (!errorMsg) {
                try {
                    await updateDoc(customerRef, newData)
                } catch(error) {
                    errorMsg = `Chyba při zápisu do databáze - ${error.message}`;
                }
            }
        }
    } else {
        errorMsg = `Nenašel jsem data zákazníka - ${customerId}`;
    }
    if (errorMsg) {
        throw new Error(errorMsg)
    }
}

const addCustomerConfig = async (customerId, datasetName, newObject, nameFieldName, oldObjectName) => {
    var errorMsg = ""
    const customerRef = doc(db, "customers", customerId);
    const docSnap = await getDoc(customerRef);

    if (docSnap.exists()) {
        var newData = docSnap.data();
        //if there is no datase array - add it
        if (!(datasetName in newData)) {
            newData[datasetName] = [];
        } 
        //if we have oldObjectName, it is update
        if (oldObjectName) {
            const indexExists = newData[datasetName].findIndex((pos) => pos[nameFieldName] === oldObjectName);
            //but if oldObjectName is not there, there is nothing to update
            if (indexExists === -1) {
                errorMsg = `Nenašel jsem objekt - ${oldObjectName}`;
            }
            //if oldObjectName is not the same as new one and new one exists, we have a unique key violation
            else if (oldObjectName !== newObject[nameFieldName]) {
                const indexExistsNew = newData[datasetName].findIndex((pos) => pos[nameFieldName] === newObject[nameFieldName]);
                if (indexExistsNew !== -1) {
                    errorMsg = `Tento název je již obsazený - ${newObject[nameFieldName]}`;
                }
            }
            //if all is peachy, replace old data
            if (!errorMsg) {
                newData[datasetName].splice(indexExists, 1, newObject);
            }
        } else {
            //if new object name already exists, no no
            const indexExistsNew = newData[datasetName].findIndex((pos) => pos[nameFieldName] === newObject[nameFieldName]);
            if (indexExistsNew !== -1) {
                errorMsg = `Tento název je již obsazený - ${newObject[nameFieldName]}`;
            }
            //otherwise just add new data
            else { 
                newData[datasetName].push(newObject);
            }
        }
        //if there is no error, beam it up
        if (!errorMsg) {
            try {
                await updateDoc(customerRef, newData)
            } catch(error) {
                errorMsg = `Chyba při zápisu do databáze - ${error.message}`;
            }
        }
    } else {
        errorMsg = `Nenašel jsem data zákazníka - ${customerId}`;
    }
    if (errorMsg) {
        throw new Error(errorMsg)
    }
}

const removeCustomerConfig = async (customerId, datasetName, nameFieldName, deleteObjectName) => {
    var errorMsg = ""
    const customerRef = doc(db, "customers", customerId);
    const docSnap = await getDoc(customerRef);

    if (docSnap.exists()) {
        var newData = docSnap.data();
        // no dataset, nothing to do
        if (!(datasetName in newData)) {
            return;
        } 
        const indexExists = newData[datasetName].findIndex((pos) => pos[nameFieldName] === deleteObjectName)
        if (indexExists === -1) {
            return;
        }
        newData[datasetName].splice(indexExists, 1);
        try {
            await updateDoc(customerRef, newData);
        }
        catch (error) {
            errorMsg = error.message
        }
    } else {
        errorMsg = `Nenašel jsem data zákazníka - ${customerId}`
    }
    if (errorMsg) {
        throw new Error(errorMsg)
    }
}

const addTemplate = async (customerId, newTemplate, oldTemplateName) => {
    return await addCustomerConfig(customerId, "templates", newTemplate, "templateName", oldTemplateName)
}

const addPosition = async (customerId, newPosition, oldPositionName) => {
    return await addCustomerConfig(customerId, "positions", newPosition, "positionName", oldPositionName)
}

const addDesign = async (customerId, newDesign, oldDesignName ) => {
    console.log("addDesign")
    console.log(customerId)
    console.log(newDesign)
    console.log(oldDesignName)
    return await addCustomerConfig(customerId, "designs", newDesign, "designName", oldDesignName)
}

const removeTemplate = async (customerId, deleteTemplateName) => {
    await removeCustomerConfig(customerId, "templates", "templateName", deleteTemplateName)
}

const removePosition = async (customerId, deletePositionName) => {
    await removeCustomerConfig(customerId, "positions", "positionName", deletePositionName)
}

const removeDesign = async (customerId, deleteDesignName) => {
    await removeCustomerConfig(customerId, "designs", "designName", deleteDesignName)
}

const removeTemplatePosition = async (customerId, templateIndex, positionIndex) => {
    var errorMsg = ""
    const customerRef = doc(db, "customers", customerId)
    const docSnap = await getDoc(customerRef)

    if (docSnap.exists()) {
        var newData = docSnap.data();
        if (!("templates" in newData)) {
            errorMsg = "removeTemplatePosition - No templates in document!"
        } else if (newData.templates.length < templateIndex + 1) {
            errorMsg = "removeTemplatePosition - No template on given index!"
        } else if (!("positions" in newData.templates[templateIndex])) {
            errorMsg = "removeTemplatePosition - No positions in template!"
        } else if (newData.templates[templateIndex].positions.length < positionIndex + 1) {
            errorMsg = "removeTemplatePosition - No position on given index!"
        } else {
            newData.templates[templateIndex].positions.splice(positionIndex, 1)
            try {
                await updateDoc(customerRef, newData)
            }
            catch (error) {
                errorMsg = error.message
            }
        }
    } else {
      errorMsg = "removeTemplatePosition - No such document!"
    }
    if (errorMsg) {
        throw new Error(errorMsg)
    }
}

export {    getCurrentUser, 
            addTemplate, 
            removeTemplate, 
            addTemplatePosition, 
            removeTemplatePosition,
            addDesign,
            removeDesign,
            addPosition,
            removePosition
        }