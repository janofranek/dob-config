import React, {useState, useEffect, useContext} from 'react';
import { db } from '../cred/firebase';
import { doc, onSnapshot } from "firebase/firestore";
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
    if (!currentUser) {
      setCustomer(null)
    } else {
      const unsub = onSnapshot(doc(db, "customers", currentUser.customerId),
        (doc) => {
          setCustomer({...doc.data(), id:doc.id });
        },
        (error) => {
          console.log("Nepovedlo se načíst klienta")
        });
      return () => { 
        unsub();
        setCustomer(null) 
      }
    }
  }, [currentUser])


  return (
    <Context.Provider value={customer}>
      {children}
    </Context.Provider>
  )
}

export const useCurrentCustomer = () => useContext(Context);