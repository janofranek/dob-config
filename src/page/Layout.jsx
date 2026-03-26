import React, {useState} from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../cred/firebase';
import { Outlet, Link } from "react-router-dom";
import { Container, Navbar, Nav, Button, Alert } from "react-bootstrap";
// import { useUsers } from '../data/UsersDataProvider';
import { useAuth } from '../data/AuthProvider';

const NavText = (props) => {
  if (props.userEmail) {
    return (
      <>
        ({props.userEmail})
        <Button variant='link' type='submit' onClick={props.onLogout}>Odhlásit</Button>
      </>
    )
  } else {
    return (
      <>
        Nepřihlášen
      </>
    )
  }
}

const Layout = () => {
  const [errorMsg, seterrorMsg] = useState('')

  // const users = useUsers();
  const authEmail = useAuth();

  // if (!users) return "Loading...";

  const onLogout = async (e) => {
    e.preventDefault()
    signOut(auth)
      .then(() => {
        seterrorMsg(null)
      })
      .catch((error) => {
        seterrorMsg(error.message);
      });
  }

  return (
      <>
      <Container fluid>
        <Navbar bg="dark" variant="dark" fixed="top">
          <Container>
          <Navbar.Brand as={Link} to="/">DOBconfig</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {authEmail &&
                  <>
                  <Nav.Link as={Link} to="/positions">Obrázky</Nav.Link>
                  <Nav.Link as={Link} to="/templates">Podklady</Nav.Link>
                  <Nav.Link as={Link} to="/designs">Vzory</Nav.Link>
                  <Nav.Link as={Link} to="/Mockup">Mockup</Nav.Link>
                  </>
              }
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <NavText userEmail={authEmail} onLogout={onLogout}/>
            </Navbar.Text>
          </Navbar.Collapse>
          </Container>
        </Navbar>
        {errorMsg && <Alert variant="danger" className="v-100"><p>{errorMsg}</p></Alert>}
        <Outlet />
      </Container>  
      </>
  )
}

export default Layout;