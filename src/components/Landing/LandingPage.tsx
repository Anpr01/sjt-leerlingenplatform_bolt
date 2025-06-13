import React, { useState } from 'react';
import Turnstile from 'react-turnstile';

interface LandingPageProps {
  onBypass: (code: string) => void;
  onVerify: (token: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onBypass, onVerify }) => {
  const [code, setCode] = useState('');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Welkom</h1>
        <p className="text-center text-gray-600">Voer de bypasscode in of doorloop de verificatie.</p>
        <input
          type="password"
          className="border rounded w-full p-2"
          placeholder="Bypass code"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={() => onBypass(code)}
        >
          Bypass
        </button>
        <Turnstile
          sitekey={import.meta.env.VITE_CF_TURNSTILE_SITEKEY!}
          onSuccess={onVerify}
          onError={() => alert('Turnstile verification failed')}
        />
      </div>
    </div>
  );
};
