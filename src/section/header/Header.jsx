import React, { useState, useRef, useEffect } from "react";
import alert from "@assets/layouts/alert.svg";
import user from "@assets/layouts/usercIco.svg";
import { useNavigate } from "react-router-dom";

function Header() {
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const alertRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        alertRef.current &&
        !alertRef.current.contains(event.target) &&
        userRef.current &&
        !userRef.current.contains(event.target)
      ) {
        setShowAlertDropdown(false);
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dummy alerts (replace with API data later)
  const alerts = [
    "New user registered",
    "Server backup completed",
    "New message from support",
  ];

  return (
    <div className="w-full h-[80px] bg-white flex items-center justify-end px-8 py-6 shadow-lg relative">
      {/* Left side (title or breadcrumb) */}

      {/* Right side (actions) */}
      <div className="flex items-center gap-6 relative">
        {/* Alert Dropdown */}
        <div className="relative w-8 h-8" ref={alertRef}>
          <button
            onClick={() => {
              setShowAlertDropdown(!showAlertDropdown);
              setShowUserDropdown(false); // close user dropdown if open
            }}
            className="hover:opacity-70 focus:outline-none"
          >
            <img src={alert} className="" alt="alerts" />
          </button>

          {showAlertDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
              <div className="px-4 py-2 font-semibold border-b">Alerts</div>
              <ul className="max-h-60 overflow-y-auto">
                {alerts.length > 0 ? (
                  alerts.map((item, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-gray-500">
                    No alerts
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowAlertDropdown(false); // close alerts dropdown if open
            }}
            className="flex items-center gap-2 hover:opacity-70 focus:outline-none"
          >
            <img src={user} className="w-8 h-8" alt="user" />
            <span className="text-base leading-6 font-medium">Hi Admin</span>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
              <ul>
                <li className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/settings')}>
                  Settings
                </li>
                <li className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/enquiries')}>
                  Enquiries
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
