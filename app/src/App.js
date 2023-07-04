import './App.css';
import React, { useState, useEffect } from 'react';
import Container from './components/Container';
import Footer from './components/Footer';
import Header from './components/Header';
import Wallet from './components/Wallet';
import { checkConnection } from './API/api';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletPublicKey, setWalletPublicKey] = useState('');

  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const connectionData = await checkConnection() ;
        setIsConnected(connectionData.isConnected);
        setWalletPublicKey(connectionData.walletPublicKey);
      } catch (error) {
        console.error('Error checking server connection:', error);
      }
    };

    checkServerConnection();
  }, []);


  return (
    <>
      {isConnected ? (
        <>
          <Header walletPublicKey={walletPublicKey} />
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
