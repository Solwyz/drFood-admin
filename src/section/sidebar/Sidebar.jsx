import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoWhite from "@assets/Login/logo.png";
import dashboard from "@assets/layouts/dashboard.svg";
import dashboardWhite from "@assets/layouts/dashboardActive.svg";
import Products from "@assets/layouts/product.svg";
import ProductsWhite from "@assets/layouts/ProductAct.svg";
import OrderM from "@assets/layouts/order.svg";
import OrderMWhite from "@assets/layouts/OrderWhite.svg";
import Ads from "@assets/layouts/ad.svg";
import AdsWhite from "@assets/layouts/Adwhite.svg";
import Coupon from "@assets/layouts/coupon.svg";
import CouponWhite from "@assets/layouts/couponACt.svg";
import UseraM from "@assets/layouts/userManagement.svg";
import UseraMWhite from "@assets/layouts/userWhite.svg";
import Enquiries from "@assets/layouts/enquiries.svg";
import EnquiriesWhite from "@assets/layouts/enquiryActive.svg";
import Settings from "@assets/layouts/settings.svg";
import SettingsWhite from "@assets/layouts/settingswhite.svg";
import Logout from "@assets/layouts/logout.svg";
import LogoutWhite from "@assets/layouts/LogoutWhite.svg";
import logoutIcn from "@assets/layouts/logoutIvon.svg";

function Sidebar() {
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const menuItems = [
    {
      section: "MAIN MENU",
      items: [
        { label: "Dashboard", to: "/", icon: dashboard, activeIcon: dashboardWhite },
        { label: "Products", to: "/products", icon: Products, activeIcon: ProductsWhite },
        { label: "Order management", to: "/order", icon: OrderM, activeIcon: OrderMWhite },
        { label: "Category management", to: "/categories", icon: Products, activeIcon: ProductsWhite },
        { label: "Ads and Banners", to: "/adds-banners", icon: Ads, activeIcon: AdsWhite },
        { label: "Coupon Management", to: "/coupon", icon: Coupon, activeIcon: CouponWhite },
        { label: "User management", to: "/users", icon: UseraM, activeIcon: UseraMWhite },
      ],
    },
    {
      section: "HELP & SUPPORT",
      items: [
        { label: "Enquiries", to: "/enquiries", icon: Enquiries, activeIcon: EnquiriesWhite },
        { label: "Settings", to: "/settings", icon: Settings, activeIcon: SettingsWhite },
        {
          label: "Logout",
          to: "#", // Prevent navigation for logout
          icon: Logout,
          activeIcon: LogoutWhite,
          onClick: () => setShowLogoutModal(true),
        },
      ],
    },
  ];

  return (
    <div className="left-0 top-0 h-screen w-[272px] bg-[#192030] shadow-lg flex flex-col justify-between overflow-y-auto">
      {/* Logo Section */}
      <div className="pt-[30px]">
        <img src={logoWhite} className="mx-auto w-[107px] h-[80px]" alt="Logo" />
        <p className="text-[#6F7583] mt-2 font-medium text-center text-sm leading-5">
          Admin Dashboard
        </p>
        <div className="flex items-center text-[#6F7583] mt-6 gap-2">
          <div className="border-t border-[#6F7583] flex-1"></div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="flex-1">
        {menuItems.map((section, i) => (
          <div key={i}>
            <p className="text-[#919191] font-semibold text-xs leading-5 px-6 mt-6 mb-4">
              {section.section}
            </p>
            {section.items.map((item, index) => (
              <SidebarItem
                key={index}
                label={item.label}
                to={item.to}
                icon={item.icon}
                activeIcon={item.activeIcon}
                isActive={location.pathname === item.to}
                onClick={item.onClick}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-lg w-[360px] rounded-lg">
            <img src={logoutIcn} className="w-12 h-12" alt="" />
            <h1 className="mt-6 text-base font-medium text-[#030300]">Confirm Logout?</h1>
            <h2 className="font-normal text-sm text-[#818180] mt-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-between mt-8">
              <button
                className="w-[147px] h-12 border rounded-lg font-normal text-base border-[#D5D5D5] hover:border-black text-black"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#ED1C24] hover:bg-[#DE5555] w-[150px] h-12 font-normal text-base rounded-lg text-white"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ label, to, icon, activeIcon, isActive, onClick }) {
  return (
    <Link
      to={to}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault(); // Prevent navigation for special actions like logout
          onClick();
        }
      }}
    >
      <div
        className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${
          isActive ? "bg-[#2D364B]" : "hover:bg-[#2D364B]"
        }`}
      >
        <img src={isActive ? activeIcon : icon} alt={`${label} icon`} />
        <span className={`text-sm font-medium ${isActive ? "text-white" : "text-[#B0B3B9]"}`}>
          {label}
        </span>
      </div>
    </Link>
  );
}

export default Sidebar;
