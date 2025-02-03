import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../src/index.css";

export default function Home() {
  const imageCount = 5;
  const images = Array.from({ length: imageCount });
  const rowsCount = 5;
  const rows = Array.from({ length: rowsCount });

  const [flippedCards, setFlippedCards] = useState(Array(imageCount * rowsCount).fill(false)); // Track flipped state for each card
  const navigate = useNavigate();

  const handleClick = () => {
    let columnIndex = 0;  // Start with the first column

    const flipColumn = () => {
      if (columnIndex < imageCount) { // Iterate through each column
        let rowIndex = 0;

        const flipCardInColumn = () => {
          if (rowIndex < rowsCount) { // Flip cards in the current column, row by row
            const cardIndex = rowIndex * imageCount + columnIndex;
            setFlippedCards(prevState => {
              const newState = [...prevState];
              newState[cardIndex] = true; // Flip the current card
              return newState;
            });

            rowIndex++;
            setTimeout(flipCardInColumn, 100); // Flip next card in the same column after a short delay
          } else {
            columnIndex++; // Move to the next column
            setTimeout(flipColumn, 300); // Delay before flipping the next column
          }
        };

        flipCardInColumn(); // Start flipping the first row in the column
      } else {
        setTimeout(() => {
          // Redirect after all flips are done
        }, 1500); // Delay before navigating after all flips are complete
      }
    };

    flipColumn(); // Start flipping columns
  };

  const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
  
    const startAuthentication = async () => {
      if (!window.PublicKeyCredential) {
        setStatus('error');
        setErrorMessage('Your browser does not support fingerprint authentication');
        return;
      }
  
      try {
        setStatus('authenticating');
  
        // Check if device supports fingerprint authentication
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (!available) {
          throw new Error('Fingerprint authentication is not available on this device');
        }
  
        // Create challenge
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
  
        // Authentication options
        const options = {
          publicKey: {
            challenge,
            timeout: 60000,
            userVerification: 'required',
            rpId: window.location.hostname,
          }
        };
  
        // Start authentication
        const credential = await navigator.credentials.get(options);
  
        if (credential) {
          setStatus('success');
          navigate('/webcam');
          console.log('Authentication successful:', credential);
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage(error.message || 'Authentication failed');
        console.error('Authentication error:', error);
      }
    };

  return (
    <div className="h-screen w-screen relative overflow-hidden grid-container">
      <div
        className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
        onClick={handleClick}
      >
        <button onClick={startAuthentication}
        disabled={status === 'authenticating'} className="text-2xl lg:text-4xl font-bold text-white px-6 py-3 font-press-start">
          Get Started
        </button>
      </div>

      <img
                    src="/home-bg.jpg"
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />

      {/* <div className="grid grid-rows-5 grid-cols-5 h-full w-full">
        {rows.map((_, rowIndex) =>
          images.map((_, imgIndex) => {
            const cardIndex = rowIndex * imageCount + imgIndex;
            const flipDelay = cardIndex * 100; // Adjust flip delay based on index

            return (
              <div
                key={`${rowIndex}-${imgIndex}`}
                className={`flip-card ${flippedCards[cardIndex] ? 'flip' : ''}`}
                style={{ animationDelay: `${flipDelay}ms` }}
              >
                <div className="flip-card-front">
                  <img
                    src="/text-bg.jpg"
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flip-card-back">
                  <img
                    src="/text-bg.jpg"
                    alt="Banner"
                    className="w-full h-full object-cover opacity-50"
                  />
                </div>
              </div>
            );
          })
        )}
      </div> */}
    </div>
  );
}
