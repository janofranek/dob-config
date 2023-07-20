import React from 'react';
import { Navigate } from "react-router-dom";
import "./Common.css"
import { useAuth } from '../data/AuthProvider';
import { useUsers } from '../data//UsersDataProvider';
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { getCurrentUser } from '../data/DataUtils';


const Home = () => {

  //load data
  const authEmail = useAuth();
  const users = useUsers();
  const currentCustomer = useCurrentCustomer();

  //if not logged in, redirect to login page
  if (!authEmail) {
    return <Navigate to="/login" />;
  }

  //wait for data
  // if (!currentUser || !currentCustomer ) return "Loading...";

  if (!users ) return "Loading...users";
  if (!currentCustomer ) return "Loading...currentCustomer";
  
  const currentUser = getCurrentUser(users, authEmail);

  return (
    <>
      <p>
        TODO Home page
      </p>
      <p>id: {currentUser.id}</p>
      <p>name: {currentUser.name}</p>
      <p>customerId: {currentUser.customerId}</p>
      <p>customerId: {currentCustomer.id}</p>
    </>
  )

}

export default Home