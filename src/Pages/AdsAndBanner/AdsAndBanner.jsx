import React, { useState } from "react";
import Arrow from "../../assets/layouts/arrowRight.svg";

function AdsAndBanner() {
  const [active, setActive] = useState("");
  const [banneractive, setBannerActive] = useState("");
  const [posteractive, setPosterActive] = useState("");

  // Function to return current breadcrumb text
  const getBreadcrumb = () => {
    if (active === "home") {
      if (banneractive === "desktop") return "Ads and Banners > Home Banner > Desktop";
      if (banneractive === "mobile") return "Ads and Banners > Home Banner > Mobile";
      return "Ads and Banners > Home Banner";
    }
    if (active === "category") {
      if (posteractive === "desktop") return "Ads and Banners > Home Ads Posters > Desktop";
      if (posteractive === "mobile") return "Ads and Banners > Home Ads Posters > Mobile";
      if (posteractive === "tab") return "Ads and Banners > Home Ads Posters > Tab";
      return "Ads and Banners > Home Ads Posters";
    }
    return "Ads and Banners";
  };

  return (
    <div className="p-6">

      {/* Breadcrumb */}
      <h1 className="text-[#2C2B2B] font-medium text-[15px] mb-3">
        {getBreadcrumb()}
      </h1>

      {/* OPTIONS ONLY SHOWN WHEN NOTHING SELECTED */}
      {active === "" && (
        <div className="bg-white p-4 pr-[316px] rounded-lg mt-4 flex gap-3">

          {/* Home Banner */}
          <div
            onClick={() => setActive("home")}
            className={`cursor-pointer flex items-center justify-between w-full px-4 py-3 rounded-lg transition
              ${active === "home" ? "bg-[#FFEEDA]" : "bg-[#F8F8F8] hover:bg-[#FFEEDA]"}`}
          >
            <span className="text-[#383838] text-[16px] font-medium">Home Banner</span>
            <img src={Arrow} alt="" className="ml-[187px]" />
          </div>

          {/* Home Ads Posters */}
          <div
            onClick={() => setActive("category")}
            className={`cursor-pointer flex items-center justify-between w-full px-4 py-3 rounded-lg transition
              ${active === "category" ? "bg-[#FFEEDA]" : "bg-[#F8F8F8] hover:bg-[#FFEEDA]"}`}
          >
            <span className="text-[#383838] text-[16px] font-medium">Home Ads Posters</span>
            <img src={Arrow} alt="" className="ml-[187px]" />
          </div>

        </div>
      )}

      {/* ======================= HOME SECTION ======================= */}
      {active === "home" && (
        <div className="bg-white p-4 pr-[316px] rounded-lg mt-4 flex gap-3">

          {/* Desktop */}
          <div
            onClick={() => setBannerActive("desktop")}
            className={`cursor-pointer flex items-center justify-between w-full px-4 py-3 rounded-lg transition
              ${banneractive === "desktop" ? "bg-[#FFEEDA]" : "bg-[#F8F8F8] hover:bg-[#FFEEDA]"}`}
          >
            <span className="text-[#383838] text-[16px] font-medium">Desktop</span>
            <img src={Arrow} alt="" className="ml-[187px]" />
          </div>

          {/* Mobile */}
          <div
            onClick={() => setBannerActive("mobile")}
            className={`cursor-pointer flex items-center justify-between w-full px-4 py-3 rounded-lg transition
              ${banneractive === "mobile" ? "bg-[#FFEEDA]" : "bg-[#F8F8F8] hover:bg-[#FFEEDA]"}`}
          >
            <span className="text-[#383838] text-[16px] font-medium">Mobile</span>
            <img src={Arrow} alt="" className="ml-[187px]" />
          </div>

        </div>
      )}

      {/* ======================= CATEGORY SECTION ======================= */}
      {active === "category" && (
        <div className="bg-white p-4 rounded-lg mt-4 flex gap-3">

          {/* Desktop */}
          <div
            onClick={() => setPosterActive("desktop")}
            className={`cursor-pointer flex items-center justify-between w-full px-4 py-3 rounded-lg transition
              ${posteractive === "desktop" ? "bg-[#FFEEDA]" : "bg-[#F8F8F8] hover:bg-[#FFEEDA]"}`}
          >
            <span className="text-[#383838] text-[16px] font-medium">Desktop</span>
            <img src={Arrow} alt="" className="ml-[187px]" />
          </div>

          {/* Mobile */}
          <div
            onClick={() => setPosterActive("mobile")}
            className={`cursor-pointer flex items-center justify-between w-full px-4 py-3 rounded-lg transition
              ${posteractive === "mobile" ? "bg-[#FFEEDA]" : "bg-[#F8F8F8] hover:bg-[#FFEEDA]"}`}
          >
            <span className="text-[#383838] text-[16px] font-medium">Mobile</span>
            <img src={Arrow} alt="" className="ml-[187px]" />
          </div>

          {/* Tab */}
          <div
            onClick={() => setPosterActive("tab")}
            className={`cursor-pointer flex items-center justify-between w-full px-4 py-3 rounded-lg transition
              ${posteractive === "tab" ? "bg-[#FFEEDA]" : "bg-[#F8F8F8] hover:bg-[#FFEEDA]"}`}
          >
            <span className="text-[#383838] text-[16px] font-medium">Tab</span>
            <img src={Arrow} alt="" className="ml-[187px]" />
          </div>

        </div>
      )}
    </div>
  );
}

export default AdsAndBanner;
