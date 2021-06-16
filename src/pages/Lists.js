import React from 'react';
import Cardembd from './card';
import {Col} from 'reactstrap';

const Lists = ({cards}) => {
    
    return (
      <>
      {cards ? 
        (
        cards.map(item => <Col xs={12} sm={6} md={6} lg={4} xl={3} key={item.id}><Cardembd {...item} key={item.id} /></Col>)
        ) :
        (<Col>Нет данных</Col>)}
      </>
    );
  };
  export default Lists;