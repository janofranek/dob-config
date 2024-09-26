import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './page/Layout';
import Home from './page/Home';
import LoginRegister from './page/LoginRegister';
import Positions from './page/Positions';
import Templates from './page/Templates';
import Designs from './page/Designs';
import Mockup from './page/Mockup';
import NoPage from './page/NoPage';
import { AuthProvider } from "./data/AuthProvider"
import { UsersDataProvider } from "./data/UsersDataProvider"
import { CurrentCustomerProvider } from "./data/CurrentCustomerProvider"

function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>} />
            <Route path="login" element={<LoginRegister/>} />
            <Route path="positions" element={<Positions/>} />
            <Route path="templates" element={<Templates/>} />
            <Route path="designs" element={<Designs/>} />
            <Route path="mockup" element={<Mockup/>} />
            <Route path="*" element={<NoPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <UsersDataProvider>
        <CurrentCustomerProvider>
          <AppRouter/>
        </CurrentCustomerProvider>
      </UsersDataProvider>
    </AuthProvider>
  )
      
}
 
export default App;
