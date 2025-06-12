import React from 'react';
import Turnstile from 'react-turnstile';

interface GateProps {
  onSuccess: (token: string) => void;
}

export const CloudflareGate: React.FC<GateProps> = ({ onSuccess }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <Turnstile
      sitekey={import.meta.env.VITE_CF_TURNSTILE_SITEKEY!}
      onSuccess={onSuccess}
      onError={() => alert('Turnstile verification failed')}
    />
  </div>
);
