import React from 'react';
import Dashboard from './components/Dashboard';
import YouTubeCards from './components/YouTubeCards';
import YouTubeViewer from './components/YouTubeViewer';
import StreamViewer from './components/StreamViewer';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Dashboard}/>
          <Route exact path='/cards' component={YouTubeCards}/>
          <Route exact path='/viewer' component={YouTubeViewer}/>
          <Route exact path='/viewer/obs' component={StreamViewer}/>
          <Redirect to="/"/>
        </Switch>
    </BrowserRouter>
  );
}

export default App;
