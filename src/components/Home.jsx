import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../src/index.css";
import { useAuth } from '../AuthContext';

export default function Home() {
  const { authenticate } = useAuth();

  const navigate = useNavigate();

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
  
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (!available) {
          throw new Error('Fingerprint authentication is not available on this device');
        }
  
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
  
        const options = {
          publicKey: {
            challenge,
            timeout: 60000,
            userVerification: 'required',
            rpId: window.location.hostname,
          }
        };
  
        const credential = await navigator.credentials.get(options);
  
        if (credential) {
          setStatus('success');
          authenticate(); 
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
        onClick={startAuthentication}
      >
        <button
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
