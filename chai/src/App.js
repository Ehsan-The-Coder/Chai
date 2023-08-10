import ABI from './contracts/Chai.json';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Buy from "./components/Buy.js";
import Memos from "./components/Memos.js"
import './App.css';

function App() {
  const [state, setState] = useState
  ({
    provider: null,
    signer: null,
    contract: null
  });

  useEffect(() => 
  {
    const connectWallet = async () => 
    {
      const contractAddress = "0x54C7490117bdA8E940896b7d3057c7bf546785C1";
      const contractABI = ABI.abi;
      try 
      {
        const { ethereum } = window;
        if (ethereum) 
        {
          await ethereum.request({ method: "eth_requestAccounts" }); // Request access to the user's accounts
          const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/2ad3189140a545cbb1ee872c98ab40ee`);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractABI, signer);
          setState({ provider, signer, contract });
        } else 
        {
          console.error("Ethereum not found. Make sure you have Metamask installed and unlocked.");
        }
      } 
      catch (error) 
      {
        // Handle any potential errors here
        console.error("Error connecting to wallet:", error);
      }
    };

    connectWallet(); // Call the function to connect to the wallet on component mount
  }, []); // Empty dependency array to run the effect only once on mount

  //console.log(state);

  return (
    <div className="App">
      <Buy state={state}></Buy>
    </div>
  );
}

export default App;
