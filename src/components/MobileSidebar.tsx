import React from 'react';
import { X } from 'lucide-react';

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  years: string[];
  streams: string[];
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ open, onClose, years, streams }) => (
  <>
    <div
      className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    />
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-lg p-4 overflow-y-auto transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Chatrooms</h2>
        <button onClick={onClose} aria-label="Close sidebar">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        {years.map((year) => (
          <div key={year}>
            <h3 className="text-sm font-medium text-gray-700 mb-1">{year} middelbaar</h3>
            <ul className="pl-4 space-y-1">
              {streams.map((stream) => (
                <li key={`${year}-${stream}`} className="text-sm text-gray-600">
                  {stream}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  </>
);
