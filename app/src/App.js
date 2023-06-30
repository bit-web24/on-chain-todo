import './App.css';
import React from 'react';
import Container from './components/Container';
import Footer from './components/Footer';
import Header from './components/Header';
import Wallet from './components/Wallet';
import { checkConnection } from './API/api';

const isConnected = checkConnection();

function App() {
  return (
    <>
      {isConnected ? (
        <>
          <Header />
          <Container />
          <Footer />
        </>
      ) : (
        <Wallet isConnected={isConnected} />
      )}
    </>
  );
}

export default App;
