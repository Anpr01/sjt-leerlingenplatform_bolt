
import React from 'react';
import Turnstile from 'react-turnstile';

interface LandingPageProps {
  onBypass: () => void;
  onVerify: (token: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onBypass, onVerify }) => {
import React, { useState } from 'react';

interface LandingPageProps {
  onBypass: (code: string) => void;
  onContinue: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onBypass, onContinue }) => {
  const [code, setCode] = useState('');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Welkom</h1>
        <p className="text-center text-gray-600">Klik op de knop om de beveiligingscheck te overslaan of voltooi de verificatie.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={onBypass}
        >
          Bypass
        </button>
        <Turnstile
          sitekey={import.meta.env.VITE_CF_TURNSTILE_SITEKEY!}
          onSuccess={onVerify}
          onError={() => alert('Turnstile verification failed')}
        />
        <p className="text-center text-gray-600">Voer de bypasscode in of ga verder naar de verificatie.</p>
        <input
          type="password"
          className="border rounded w-full p-2"
          placeholder="Bypass code"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <div className="flex justify-between">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => onBypass(code)}
          >
            Bypass
          </button>
          <button
            className="bg-gray-200 px-4 py-2 rounded"
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
