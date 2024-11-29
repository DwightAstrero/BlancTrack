import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  toggleSidebar: () => void;
  handleLogout: () => Promise<void>;
  userId: string | null;
  position: string | null;
  ping: number; // Added ping prop
}

const HamburgerIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16m-7 6h7"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const LeftSidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  toggleSidebar,
  handleLogout,
  userId,
  position,
  ping, // Destructuring ping prop
}) => {
  // Map to easily handle different positions
  const roleToDashboard = {
    admin: '/admin',
    manager: '/manager',
    staff: '/staff',
  };

  const dashboardLink = roleToDashboard[position as keyof typeof roleToDashboard] || null;

  return (
    <div className="relative">
      {/* Hamburger Icon Button - Always visible */}
      <button
        className={`fixed top-4 left-4 z-10 text-brown ${isOpen ? 'invisible' : 'visible'}`}
        onClick={toggleSidebar}
        aria-label="Open Sidebar"
      >
        <HamburgerIcon />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 h-full w-64 bg-[#181c24] text-white p-4 flex flex-col ${isOpen ? 'left-0 z-20' : '-left-full'} transition-all duration-300 ease-in-out`}
      >
        <div className="flex justify-between mb-4 border-b border-gray-700 pb-4">
          <h2 className="text-lg font-bold text-white">BlancTrack</h2>
          <button className="text-white" onClick={toggleSidebar} aria-label="Close Sidebar">
            <CloseIcon />
          </button>
        </div>
        <ul className="space-y-2">
          <li>
            <Link href={`/account/${userId}`}>
              <h2 className="cursor-pointer p-2 hover:bg-gray-700">Account</h2>
            </Link>
          </li>

          {dashboardLink && (
            <li>
              <Link href={dashboardLink}>
                <h2 className="cursor-pointer p-2 hover:bg-gray-700 flex items-center">
                  Dashboard
                  {ping > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-2">{ping}</span>
                  )}
                </h2>
              </Link>
            </li>
          )}

          <li>
            <Link href="/announcement">
              <h2 className="cursor-pointer p-2 hover:bg-gray-700">Announcements</h2>
            </Link>
          </li>
        </ul>

        <div className="mt-auto flex items-center">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-red-400 flex items-center space-x-2"
            aria-label="Log out"
          >
            <h2 className="text-sm">Log out</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-box-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
              />
              <path
                fillRule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
