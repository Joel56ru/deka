import React,{useState,useEffect} from 'react';
import Lists from './pages/Lists';
import {Context} from './pages/context';
import {Container,Row,Col} from 'reactstrap';
import CardAdd from './pages/add';

function App() {
  const [cards, setCards] = useState([]);
    const removeCard = id => {
      setCards(cards.filter(card =>{
        return card.id !== id
      }));
    }
    const addCardRow = (urlVideo,startVideo,endVideo,labelVideo) => {
      setCards([...cards, {
        id: Date.now(),
        label: labelVideo,
        src: urlVideo,
        start: startVideo,
        end: endVideo,
      }]);
    }
    useEffect(()=>{
      if (localStorage.getItem('cards') !== null){
        const raw = localStorage.getItem('cards');
        setCards(JSON.parse(raw));
      }
    },[]);
    useEffect(()=>{
      localStorage.setItem('cards',JSON.stringify(cards));
    },[cards]);
    
  return (
    <Context.Provider value={{
      removeCard, addCardRow
    }}>
      <Container fluid={true}>
        <Row>
        <Lists cards={cards}/>
        <Col xs={12} sm={6} md={6} lg={4} xl={3}>
          <CardAdd/>
        </Col>
      </Row>
      </Container>
    </Context.Provider>
  );
}

export default App;
