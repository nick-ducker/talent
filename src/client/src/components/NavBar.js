import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <Navbar bg='dark' variant='dark'>
      <Navbar.Brand as={Link} to='/'>
        Talent
      </Navbar.Brand>
      <Nav className='ml-auto'>
        <Nav.Link as={Link} to='/'>
          Login
        </Nav.Link>
        <Nav.Link as={Link} to='/signup'>
          Sign Up
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default NavBar;
