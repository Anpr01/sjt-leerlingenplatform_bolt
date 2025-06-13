import React from 'react';
import Turnstile from 'react-turnstile';

interface LandingPageProps {
  onBypass: () => void;
  onVerify: (token: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onBypass, onVerify }) => {

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
      </div>
    </div>
  );
};
