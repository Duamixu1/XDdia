Step 1: Project Setup
First, let's create a new React project using Vite (it's fast and efficient) and install the necessary libraries.

Create the React App:

Bash

npm create vite@latest xdiamond-dapp -- --template react
Navigate into the project directory:

Bash

cd xdiamond-dapp
Install Dependencies:

ethers: To communicate with the user's wallet (e.g., MetaMask).

react-tsparticles & tsparticles-slim: For the animated background.

Bash

npm install ethers react-tsparticles tsparticles-slim
Start the Development Server:

Bash

npm run dev
You should now have a basic React application running in your browser.

Step 2: Create the Animated Background
Let's create the dynamic "hyperspace" background as a separate, reusable component.

Create a config file for the particle effect. Inside the src folder, create a new file named particlesConfig.js:

JavaScript

// src/particlesConfig.js
const config = {
  background: {
    color: { value: '#000' },
  },
  fpsLimit: 120,
  particles: {
    number: {
      value: 200, // Adjust for more/less "stars"
      density: { enable: true, value_area: 800 },
    },
    color: { value: '#fff' },
    shape: { type: 'line' },
    opacity: { value: 1 },
    size: {
      value: { min: 1, max: 50 }, // Creates the line length effect
      animation: {
        enable: true,
        speed: 5,
        sync: true,
        startValue: "min",
        destroy: "max",
      },
    },
    move: {
      enable: true,
      speed: { min: 5, max: 10 },
      direction: 'none',
      outModes: { default: 'destroy' },
      straight: true,
    },
  },
  interactivity: {},
  detectRetina: true,
  emitters: {
    direction: "none",
    rate: {
      quantity: 1,
      delay: 0.25,
    },
    size: {
      width: 0,
      height: 0,
    },
    position: {
      x: 50,
      y: 50,
    },
  },
};
export default config;
Create the Background Component. Inside the src folder, create StarfieldBackground.jsx:

JavaScript

// src/StarfieldBackground.jsx
import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import particlesConfig from './particlesConfig';

const StarfieldBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particlesConfig}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

export default StarfieldBackground;
Step 3: Build the Main Application Component (App.jsx)
Now, let's edit src/App.jsx to include all the state, logic, and UI elements. This will be the heart of your application.

JavaScript

// src/App.jsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import StarfieldBackground from './StarfieldBackground';
import './App.css';

// --- MOCK API CALL ---
// In a real project, you would use fetch() or axios to call a real API.
// This mock function simulates the API call for demonstration.
const checkApiForWhitelist = async (address) => {
  console.log(`Checking whitelist status for address: ${address}`);
  // Replace this with your actual API call.
  // We'll simulate a 1.5 second delay.
  await new Promise(resolve => setTimeout(resolve, 1500));

  // For testing: let's pretend addresses starting with "0xf39" are on the whitelist.
  if (address.toLowerCase().startsWith('0xf39')) {
    return { isWhitelisted: true };
  } else {
    return { isWhitelisted: false };
  }
};
// --- END MOCK API CALL ---


function App() {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Function to handle wallet connection
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const connectedAddress = await signer.getAddress();
      setAccount(connectedAddress);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setMessage("Failed to connect wallet. Please try again.");
    }
  };

  // Function to handle disconnection
  const disconnectWallet = () => {
    setAccount(null);
    setMessage('');
  };

  // useEffect Hook: This runs automatically when the `account` state changes.
  useEffect(() => {
    if (account) {
      // Wallet has just been connected, so check whitelist status.
      setIsLoading(true);
      setMessage('Verifying your address...');
      
      const verifyAddress = async () => {
        const { isWhitelisted } = await checkApiForWhitelist(account);
        if (isWhitelisted) {
          setMessage('Verification successful! You are on the whitelist.');
        } else {
          setMessage('Verification failed, you are not on the whitelist. Welcome to participate in the public sale.');
        }
        setIsLoading(false);
      };

      verifyAddress();
    }
  }, [account]);

  return (
    <div className="app-container">
      <StarfieldBackground />
      <div className="content-wrapper">
        <header className="header">
          <h1>XDiamond</h1>
          <p>First Algorithm Generative NFT On XLayer</p>
        </header>

        <main className="main-content">
          {!account ? (
            <button className="connect-button" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <button className="connect-button" onClick={disconnectWallet}>
              Disconnect
            </button>
          )}

          <div className="status-message">
            {/* Show a loading indicator while verifying */}
            {isLoading && <div className="spinner"></div>}
            {/* Show the final message once loading is complete */}
            {!isLoading && message && <p>{message}</p>}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
Step 4: Add Styling (App.css)
Finally, replace the contents of src/App.css with the following styles to match the visual appearance of the screenshot.

CSS

/* src/App.css */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #000;
  color: white;
  overflow: hidden; /* Important to hide scrollbars */
}

.app-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  text-align: center;
  position: relative;
  z-index: 1;
}

.content-wrapper {
  padding: 20px;
}

.header h1 {
  font-size: 4rem;
  margin: 0;
  font-weight: 600;
}

.header p {
  font-size: 1.25rem;
  margin-top: 10px;
  color: #ccc;
}

.main-content {
  margin-top: 40px;
  height: 100px; /* Reserve space for the message */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.connect-button {
  background-color: rgba(70, 70, 90, 0.8);
  border: 1px solid rgba(100, 100, 120, 0.9);
  color: white;
  padding: 12px 32px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.connect-button:hover {
  background-color: rgba(85, 85, 110, 0.8);
}

.status-message {
  margin-top: 30px;
  font-size: 1rem;
  min-height: 24px; /* Prevents layout shift */
  color: #ddd;
}

/* Simple CSS spinner for loading state */
.spinner {
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
You are all set! Now run your app (npm run dev), and you will have a fully functional and visually