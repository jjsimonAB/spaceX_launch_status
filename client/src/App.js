import React from 'react';
import ApolloClient from 'apollo-boost';
import Launches from './components/Launches'
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Route} from 'react-router-dom'; 
import Launch from './components/Launch';
import './App.css';

const client = new ApolloClient({
  uri: '/graphql'
})

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="container">
          <div className="App">
            <img src='https://www.spacex.com/sites/spacex/files/spacex_logo_white.png' alt="SpaceX" style={{ width:300, display: 'block', margin: "auto"}} />

            <Route exact path="/" component={Launches}/>
            <Route exact path="/launch/:flight_number" component={Launch}/>

          </div>
        </div>
      </Router>
    </ApolloProvider>

  );
}

export default App;
