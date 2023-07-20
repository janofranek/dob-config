import { db } from '../cred/firebase';
import { doc, updateDoc } from "firebase/firestore";

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

export {getCurrentUser, setConfiguration}