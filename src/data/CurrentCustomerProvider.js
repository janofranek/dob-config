import React, {useState, useEffect, useContext} from 'react';
import { db } from '../cred/firebase';
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from '../data/AuthProvider';
import { useUsers } from './UsersDataProvider';
import { getCurrentUser } from './DataUtils';

const Context = React.createContext();

export const CurrentCustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState();

  const authEmail = useAuth();
  const users = useUsers();
  const currentUser = getCurrentUser( users, authEmail);

  useEffect( () => {
    const fetchCustomer = async () => {
      if (!currentUser) {
        setCustomer(null)
      } else {
        const docSnap = await getDoc(doc(db, "customers", currentUser.customerId))
        if (docSnap.exists()) {
          setCustomer({...docSnap.data(), id:docSnap.id })
        } else {
          setCustomer(null)
        }
      }
    } 
    fetchCustomer();
    return () => { setCustomer(null) };
  }, [currentUser])

  return (
    <Context.Provider value={customer}>
      {children}
    </Context.Provider>
  )
}

export const useCurrentCustomer = () => useContext(Context);