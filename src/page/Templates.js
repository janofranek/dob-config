import React from 'react';
import { Navigate } from "react-router-dom";
import "./Common.css"
import { useAuth } from '../data/AuthProvider';

const Templates = () => {

  //load data
  const authEmail = useAuth();

  //if not logged in, redirect to login page
  if (!authEmail) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <p>
        TODO Templates page
      </p>
    </>
  )

}

export default Templates