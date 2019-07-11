import React from 'react';
import Launches from './components/Launches'
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { HttpLink, createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Launch from './components/Launch';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
})


const authLink = setContext((_, { headers }) => {

  const token = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ""
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
  
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
