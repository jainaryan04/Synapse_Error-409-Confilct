import React, { useState } from 'react';

const FingerprintAuth = () => {
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
        // Here you would typically send the credential to your server for verification
        console.log('Authentication successful:', credential);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Authentication failed');
      console.error('Authentication error:', error);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: '16px' }}>Fingerprint Authentication</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Use your fingerprint to authenticate
      </p>

      {status === 'error' && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '20px',
          color: '#dc2626'
        }}>
          {errorMessage}
        </div>
      )}

      {status === 'success' && (
        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #22c55e',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '20px',
          color: '#16a34a'
        }}>
          Authentication successful!
        </div>
      )}

      <button 
        onClick={startAuthentication}
        disabled={status === 'authenticating'}
        style={{
          width: '100%',
          padding: '16px',
          fontSize: '16px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: status === 'authenticating' ? 'not-allowed' : 'pointer',
          opacity: status === 'authenticating' ? 0.7 : 1
        }}
      >
        {status === 'authenticating' ? 'Authenticating...' : 'Authenticate with Fingerprint'}
      </button>
    </div>
  );
};

export default FingerprintAuth;