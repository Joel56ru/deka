import React from 'react';
import {Container} from 'reactstrap';
import NavbarComponent from './components/Navbar';
import YouTubeCards from './components/YouTubeCards';
function App() {
  return (
    <Container fluid={true}>
      <NavbarComponent/>
      <YouTubeCards/>
    </Container>
  );
}

export default App;
