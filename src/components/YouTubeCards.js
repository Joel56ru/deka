import React,{useState,useEffect} from 'react';
import {
  Row,
  Col,
  Container,
} from 'reactstrap';
import Lists from '../components/YoutubeCards/Lists';
import {Context} from './YoutubeCards/Context';
import CardAdd from './YoutubeCards/Add';
import NavbarComponent from './Navbar';


const YouTubeComponent = () => {
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
    <Row>
        <Lists cards={cards}/>
        <Col xs={12} sm={6} md={6} lg={4} xl={3}>
            <CardAdd/>
        </Col>
    </Row>
    </Context.Provider>
  );
}

const YouTubeCards = () =>{
    return (
        <>
        <NavbarComponent/>
        <Container fluid={true}>
          <YouTubeComponent/>
        </Container>
        </>
    );
}

export default YouTubeCards;
