import React, { useEffect, useState } from "react";
import Api from "../../Services/Api";
import saveIco from "@assets/layouts/save.svg";
import cancelIco from "@assets/layouts/cancel.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SettingsPage() {
  const [general, setGeneral] = useState({
    email: "",
    mobile: "",
    mobile2: "",
  });
  const [social, setSocial] = useState({
    fbLink: "",
    instaLink: "",
    contactNo: "",
  });
  const [mobile, setMobile] = useState({
    playStoreLink: "",
    applicationLink: "",
  });
  const [chatbotEnabled, setChatbotEnabled] = useState(false);

  const [originalGeneral, setOriginalGeneral] = useState({});
  const [originalSocial, setOriginalSocial] = useState({});
  const [originalMobile, setOriginalMobile] = useState({});

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const token = localStorage.getItem("token");
 

  const fetchSettings = async () => {
    try {
      const config = { 
        Authorization: `Bearer ${token}` 
    };

      const [generalRes, socialRes] = await Promise.all([
        Api.get("api/general/all", config),
        Api.get("api/social/all", config),
        // Api.get("api/mobile/all", config),
      ]);

      console.log("gen", generalRes.data)

      const generalData = generalRes.data?.data?.[0] || {
        email: "",
        mobile: "",
        mobile2: "",
      };
      const socialData = socialRes.data?.data?.[0] || {
        fbLink: "",
        instaLink: "",
        contactNo: "",
      };
    //   const mobileData = mobileRes.data?.data?.[0] || {
    //     playStoreLink: "",
    //     applicationLink: "",
    //   };

      setGeneral(generalData);
      setSocial(socialData);
    //   setMobile(mobileData);

      setOriginalGeneral(generalData);
      setOriginalSocial(socialData);
    //   setOriginalMobile(mobileData);

      validateForm(generalData, socialData);
      checkIfDirty(generalData, socialData);
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const validateForm = (gen, soc) => {
    const newErrors = {};
    if (gen.email && !validateEmail(gen.email))
      newErrors.email = "Invalid email format";
    if (gen.mobile && !validatePhone(gen.mobile))
      newErrors.mobile = "Contact number must be 10 digits";
    if (gen.mobile2 && !validatePhone(gen.mobile2))
      newErrors.mobile2 = "Contact number must be 10 digits";
    if (soc.contactNo && !validatePhone(soc.contactNo))
      newErrors.contactNo = "WhatsApp number must be 10 digits";
    setErrors(newErrors);
  };

  const checkIfDirty = (gen, soc, mob) => {
    const dirty =
      JSON.stringify(gen) !== JSON.stringify(originalGeneral) ||
      JSON.stringify(soc) !== JSON.stringify(originalSocial) ||
      JSON.stringify(mob) !== JSON.stringify(originalMobile);
    setIsDirty(dirty);
  };

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...general, [name]: value };
    setGeneral(updated);
    validateForm(updated, social, mobile);
    checkIfDirty(updated, social, mobile);
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...social, [name]: value };
    setSocial(updated);
    validateForm(general, updated, mobile);
    checkIfDirty(general, updated, mobile);
  };

  const handleMobileChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...mobile, [name]: value };
    setMobile(updated);
    validateForm(general, social, updated);
    checkIfDirty(general, social, updated);
  };

  const handleSave = async () => {
    try {
      const config = { Authorization: `Bearer ${token}` };

      const resGen =  await Api.post("api/general/add", general, config);
      const resSpc =  await Api.post("api/social/add", social, config);
    //   await Api.post("api/mobile/add", mobile, config);

      console.log("resG", resGen);
      console.log('resS', resSpc);

      toast.success("Settings saved successfully!", { position: "top-right" });

      fetchSettings();
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Failed to save settings", { position: "top-right" });
    }
  };

  const handleCancel = () => {
    setGeneral(originalGeneral);
    setSocial(originalSocial);
    setMobile(originalMobile);
    validateForm(originalGeneral, originalSocial, originalMobile);
    setIsDirty(false);
  };

  return (
    <div className=" ">
      <ToastContainer />
      <h1 className="text-xl leading-6 text-[#BF6A02] font-medium ">
        Settings
      </h1>

      {/* General Section */}
      <div className=" bg-white  mt-4 p-4  ">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold leading-[26px] text-[#2C2B2B]">
            General
          </h1>
          <div className="flex gap-3 ">
            {/* <button
              onClick={handleCancel}
              className="border border-[#D5D5D5] hover:border-[#004D96] duration-300 text-center items-center rounded-lg font-normal flex text-sm text-[#2C2B2B] h-10 px-4"
            >
              <img src={cancelIco} alt="" className="w-4 h-4 mr-2" /> Cancel
            </button> */}
            <button
              onClick={handleSave}
              disabled={
                !isDirty ||
                Object.keys(errors).length > 0 ||
                !general.email.trim() ||
                !general.mobile.trim()
              }
              className={`rounded-lg text-center font-normal items-center flex text-sm h-10 px-4 ${!isDirty ||
                  Object.keys(errors).length > 0 ||
                  !general.email.trim() ||
                  !general.mobile.trim()
                  ? "bg-[#BF6A02] text-white cursor-not-allowed opacity-50"
                  : "bg-[#BF6A02] hover:bg-[#965B13] text-white"
                }`}
            >
              <img src={saveIco} className="mr-2 w-4 h-4" alt="" />
              Save changes
            </button>

            {/* <button
              onClick={handleSave}
              disabled={!isDirty || Object.keys(errors).length > 0}
              className={`rounded-lg text-center font-normal items-center flex text-sm h-10 px-4 ${
                !isDirty || Object.keys(errors).length > 0
                  ? "bg-[#004D96] hover:bg-[#347DC0] text-white cursor-not-allowed"
                  : "bg-[#004D96] hover:bg-[#347DC0] text-white"
              }`}
            >
              <img src={saveIco} className="mr-2 w-4 h-4" alt="" />
              Save changes
            </button> */}
          </div>
        </div>
        <div className="mt-6">
          <div>
            <label className="block font-normal text-sm leading-4 text-[#050710]">
              Customer support email
            </label>
            <input
              type="email"
              name="email"
              value={general?.email || ""}
              onChange={handleGeneralChange}
              className="mt-2 w-[317px] h-[48px] font-normal text-sm leading-4 px-4 
                border border-[#E6E6E7] bg-[#F9F9FB] rounded-lg 
                placeholder:text-[#C8C8C8] focus:outline-black"
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="flex mt-4 gap-4">
            <div>
              <label className="block font-normal text-sm leading-4 text-[#050710]">
                Contact number 1
              </label>
              <input
                type="text"
                name="mobile"
                value={general.mobile || ""}
                onChange={handleGeneralChange}
                className="mt-2 w-[317px] h-[48px] font-normal text-sm leading-4  px-4  border border-[#E6E6E7] bg-[#F9F9FB] rounded-lg placeholder:text-[#C8C8C8] focus:outline-black"
                placeholder="Enter number"
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
              )}
            </div>
            <div>
              <label className="block font-normal text-sm leading-4 text-[#050710]">
                Contact number 2
              </label>
              <input
                type="text"
                name="mobile2"
                value={general.mobile2 || ""}
                onChange={handleGeneralChange}
                className="mt-2 w-[317px] h-[48px] font-normal text-sm leading-4  px-4  border border-[#E6E6E7] bg-[#F9F9FB] rounded-lg placeholder:text-[#C8C8C8] focus:outline-black"
                placeholder="Enter number"
              />
              {errors.mobile2 && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile2}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Toggle */}
      <div className="bg-white mt-4 p-4 flex items-center gap-3 ">
        <span className="text-[#050710] text-sm leading-4 font-normal">
          Chatbot {chatbotEnabled ? "Enabled" : "Disabled"}
        </span>
        <button
          onClick={() => setChatbotEnabled(!chatbotEnabled)}
          className={`relative w-10 h-5 flex items-center rounded-full transition-colors duration-300 ${chatbotEnabled ? "bg-[#304BA0]" : "bg-gray-300"
            }`}
        >
          <span
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${chatbotEnabled ? "translate-x-5" : "translate-x-1"
              }`}
          />
        </button>
      </div>

      {/* Social Media Section */}
      <div className=" bg-white  mt-4 p-4  ">
        <h1 className="text-xl font-semibold leading-[26px] text-[#2C2B2B]">
          Social media
        </h1>
        <div className="flex mt-4 gap-4">
          <div>
            <label className="block font-normal text-sm leading-4 text-[#050710]">
              Facebook link
            </label>
            <input
              type="text"
              name="fbLink"
              value={social.fbLink || ""}
              onChange={handleSocialChange}
              className="mt-2 w-[317px] h-[48px] font-normal text-sm leading-4  px-4  border border-[#E6E6E7] bg-[#F9F9FB] rounded-lg placeholder:text-[#C8C8C8] focus:outline-black"
              placeholder="Enter link"
            />
          </div>
          <div>
            <label className="block font-normal text-sm leading-4 text-[#050710]">
              Instagram link
            </label>
            <input
              type="text"
              name="instaLink"
              value={social.instaLink || ""}
              onChange={handleSocialChange}
              className="mt-2 w-[317px] h-[48px] font-normal text-sm leading-4  px-4  border border-[#E6E6E7] bg-[#F9F9FB] rounded-lg placeholder:text-[#C8C8C8] focus:outline-black"
              placeholder="Enter link"
            />
          </div>
          <div>
            <label className="block font-normal text-sm leading-4 text-[#050710]">
              Whatsapp Contact Number
            </label>
            <input
              type="text"
              name="contactNo"
              value={social.contactNo || ""}
              onChange={handleSocialChange}
              className="mt-2 w-[317px] h-[48px] font-normal text-sm leading-4  px-4  border border-[#E6E6E7] bg-[#F9F9FB] rounded-lg placeholder:text-[#C8C8C8] focus:outline-black"
              placeholder="Enter number"
            />
            {errors.contactNo && (
              <p className="text-red-500 text-xs mt-1">{errors.contactNo}</p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Application Section */}
      {/* <div className=" bg-white  mt-4 p-4  ">
        <h1 className="text-xl font-semibold leading-[26px] text-[#2C2B2B]">
          Mobile application link
        </h1>
        <div className="flex mt-4 gap-4">
          <div>
            <label className="block font-normal text-sm leading-4 text-[#050710]">
              Playstore link
            </label>
            <input
              type="text"
              name="playStoreLink"
              value={mobile.playStoreLink || ""}
              onChange={handleMobileChange}
              className="mt-2 w-[317px] h-[48px] font-normal text-sm leading-4  px-4  border border-[#E6E6E7] bg-[#F9F9FB] rounded-lg placeholder:text-[#C8C8C8] focus:outline-black"
              placeholder="Enter link"
            />
          </div>
          <div>
            <label className="block font-normal text-sm leading-4 text-[#050710]">
              Apple store link
            </label>
            <input
              type="text"
              name="applicationLink"
              value={mobile.applicationLink || ""}
              onChange={handleMobileChange}
              className="mt-2 w-[317px] h-[48px] font-normal text-sm leading-4  px-4  border border-[#E6E6E7] bg-[#F9F9FB] rounded-lg placeholder:text-[#C8C8C8] focus:outline-black"
              placeholder="Enter link"
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default SettingsPage;
