import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './page/Layout';
import Home from './page/Home';
import LoginRegister from './page/LoginRegister';
import Config from './page/Config';
import Templates from './page/Templates';
import Sets from './page/Sets';
import NoPage from './page/NoPage';
import { AuthProvider } from "./data/AuthProvider"
import { UsersDataProvider } from "./data/UsersDataProvider"
import { CurrentCustomerProvider } from "./data/CurrentCustomerProvider"
// import { TournamentsDataProvider } from "./data/TournamentsDataProvider"
// import { ScorecardsDataProvider } from "./data/ScorecardsDataProvider"


function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>} />
            <Route path="login" element={<LoginRegister/>} />
            <Route path="config" element={<Config/>} />
            <Route path="templates" element={<Templates/>} />
            <Route path="sets" element={<Sets/>} />
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
          {/* <TournamentsDataProvider> */}
            {/* <ScorecardsDataProvider> */}
              <AppRouter/>
            {/* </ScorecardsDataProvider> */}
          {/* </TournamentsDataProvider> */}
        </CurrentCustomerProvider>
      </UsersDataProvider>
    </AuthProvider>
  )
      
}
 
export default App;
