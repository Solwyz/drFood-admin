import React, { useState } from "react";
import Arrow from "../../assets/layouts/arrowRight.svg";
import Image from "../../assets/layouts/image.svg";
import Upload from "../../assets/layouts/upload.svg";
import save from "../../assets/layouts/save.svg";
import Api from "../../services/Api";

function AdsAndBanner() {
  const [active, setActive] = useState("");
  const [banneractive, setBannerActive] = useState("");
  const [posteractive, setPosterActive] = useState("");
  const [posterImages, setPosterImages] = useState([null, null, null]);
  const [uploadPhotosOpen, setUploadPhotosOpen] = useState(false);
  const [selectedPosterIndex, setSelectedPosterIndex] = useState(null);


  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("token");

  const getUploadApiUrl = () => {
    if (active === "home") {
      if (banneractive === "Desktop")
        return "banner/subcategory/add?name=desktop&bannerCategoryId=1";
      if (banneractive === "mobile")
        return "banner/subcategory/add?name=mobile&bannerCategoryId=1";
    }

    if (active === "category") {
      if (posteractive === "Desktop") return "banner/subcategory/add?name=desktop&bannerCategoryId=2";
      if (posteractive === "mobile") return "banner/subcategory/add?name=mobile&bannerCategoryId=2";
      if (posteractive === "tab") return "banner/subcategory/add?name=tab&bannerCategoryId=2";
    }

    return null;
  };

  const getPosterSize = () => {
    if (posteractive === "Desktop") return "h-[300px] w-[252px]";
    if (posteractive === "mobile") return "h-[260px] w-[343px]";
    if (posteractive === "tab") return "h-[219px] w-[343px]";
    return "h-[250px]";
  };


  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    if (banneractive) {
      // home banner (single preview)
      setPreviewUrl(url);
      setSelectedFile(file);
    }

    if (posteractive) {
      // update correct poster box
      const updated = [...posterImages];
      updated[selectedPosterIndex] = {
        file: file,
        preview: url
      };
      setPosterImages(updated);
    }

    setUploadPhotosOpen(false);
  };


  /* SELECT FILE */
  // const handleFileSelect = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const url = URL.createObjectURL(file);
  //   setPreviewUrl(url);
  //   setSelectedFile(file);

  //   setUploadPhotosOpen(false); // close modal after selecting
  // };

  /* SAVE IMAGE TO API */

  const handleSaveImage = async () => {
    const apiUrl = getUploadApiUrl();
    if (!apiUrl) return alert("Invalid selection!");

    const formData = new FormData();

    if (active === "home") {
      if (!selectedFile) return alert("Please select an image first!");
      formData.append("image", selectedFile);
    }

    if (active === "category") {
      const postersToUpload = posterImages.filter(p => p?.file);

      if (postersToUpload.length === 0)
        return alert("Please upload at least one poster!");

      postersToUpload.forEach((poster, index) => {
        formData.append(`poster${index + 1}`, poster.file);
      });
    }

    try {
      const response = await Api.post(apiUrl, formData, {

        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`

      });

      console.log("Upload successful:", response);
      alert("Uploaded successfully!");

      // clear after upload
      setSelectedFile(null);
      setPreviewUrl("");
      setPosterImages([null, null, null]);

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed");
    }
  };


  return (
    <div className="p-6">

      {/* -------------------- BREADCRUMB -------------------- */}
      <div className="flex justify-between items-center">
        <h1 className="text-[#2C2B2B] font-medium text-[15px] mb-3 flex gap-1 ">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => {
              setActive("");
              setBannerActive("");
              setPosterActive("");
            }}
          >
            Ads and Banners
          </span>

          {active === "home" && (
            <>
              <span>›</span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => setBannerActive("")}
              >
                Home Banner
              </span>

              {banneractive && (
                <>
                  <span>›</span>
                  <span>{banneractive}</span>
                </>
              )}
            </>
          )}

          {active === "category" && (
            <>
              <span>›</span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => setPosterActive("")}
              >
                Home Ads Posters
              </span>

              {posteractive && (
                <>
                  <span>›</span>
                  <span className="capitalize">{posteractive}</span>
                </>
              )}
            </>
          )}


        </h1>

        <div className="flex justify-end">
          <button
            onClick={handleSaveImage}
            className="bg-[#C27000] text-white w-[100px] py-2 rounded-md flex items-center justify-center gap-2"
          >
            <img src={save} alt="Save" />
            Save
          </button>
        </div>
      </div>

      {/* -------------------- MAIN OPTIONS -------------------- */}
      {active === "" && (
        <div className="bg-white p-4 pr-[316px] rounded-lg mt-4 flex gap-3">
          <div
            onClick={() => setActive("home")}
            className="cursor-pointer flex items-center justify-between w-full px-4 py-3 bg-[#F8F8F8] hover:bg-[#FFEEDA] rounded-lg"
          >
            <span className="text-[#383838] text-[16px] font-medium">
              Home Banner
            </span>
            <img src={Arrow} alt="" className="ml-[187px]" />
          </div>

          <div
            onClick={() => setActive("category")}
            className="cursor-pointer flex items-center justify-between w-full px-4 py-3 bg-[#F8F8F8] hover:bg-[#FFEEDA] rounded-lg"
          >
            <span className="text-[#383838] text-[16px] font-medium">
              Home Ads Posters
            </span>
            <img src={Arrow} alt="" className="ml-[187px]" />
          </div>
        </div>
      )}



      {/* -------------------- HOME OPTIONS -------------------- */}
      {active === "home" && !banneractive && !posteractive && (
        <div className="bg-white p-4 pr-[316px] rounded-lg mt-4 flex gap-3">
          <div
            onClick={() => setBannerActive("Desktop")}
            className={`cursor-pointer flex items-center justify-between w-full px-4 py-3 rounded-lg ${banneractive === "Desktop"
              ? "bg-[#FFEEDA]"
              : "bg-[#F8F8F8] hover:bg-[#FFEEDA]"
              }`}
          >
            <span className="text-[#383838] text-[16px] font-medium">Desktop</span>
            <img src={Arrow} alt="" className="ml-[187px]" />
          </div>

          <div
            onClick={() => setBannerActive("mobile")}
            className={`cursor-pointer flex items-center justify-between w-full px-4 py-3 rounded-lg ${banneractive === "mobile"
              ? "bg-[#FFEEDA]"
              : "bg-[#F8F8F8] hover:bg-[#FFEEDA]"
              }`}
          >
            <span className="text-[#383838] text-[16px] font-medium">Mobile</span>
            <img src={Arrow} alt="" className="ml-[187px]" />
          </div>
        </div>
      )}


      {/* -------------------- CATEGORY OPTIONS -------------------- */}
      {active === "category" && !posteractive && !banneractive && (
        <div className="bg-white p-4 rounded-lg mt-4 flex gap-3">
          {["Desktop", "mobile", "tab"].map((item) => (
            <div
              key={item}
              onClick={() => setPosterActive(item)}
              className={`cursor-pointer flex items-center justify-between w-full px-4 py-3 rounded-lg ${posteractive === item
                ? "bg-[#FFEEDA]"
                : "bg-[#F8F8F8] hover:bg-[#FFEEDA]"
                }`}
            >
              <span className="text-[#383838] text-[16px] font-medium capitalize">
                {item}
              </span>
              <img src={Arrow} alt="" className="ml-[187px]" />
            </div>
          ))}
        </div>
      )}


      {/* -------------------- UPLOAD PREVIEW BEFORE API CALL -------------------- */}
      {banneractive && (
        <div className={`mt-6 bg-white p-6 border border-[#E5E5E5] rounded-lg  ${banneractive === "mobile" ? "w-[377px]" : "w-full"}
        `}>

          {/* If NO file selected → show upload box */}
          {!previewUrl && (
            <div
              className={`border border-dashed border-[#C9C9C9] h-[350px] flex flex-col items-center justify-center text-center cursor-pointer 
    ${banneractive === "mobile" ? "" : "w-full"}`}
              onClick={() => setUploadPhotosOpen(true)}
            >

              <img src={Image} alt="" className="w-12 opacity-50" />
              <p className="text-[#676767] mt-3 text-sm">
                Drop your images & videos
              </p>
              <p className="text-[#F5A623] font-medium text-sm">
                or click to browse
              </p>
            </div>
          )}

          {/* If PREVIEW selected → show preview same as screenshot */}
          {previewUrl && (
            <div className="text-center">
              <img
                src={previewUrl}
                className="w-full h-[350px] object-cover rounded-md"
                alt="preview"
              />

              <button
                onClick={() => setUploadPhotosOpen(true)}
                className="text-[#0539BC] mt-3  text-[14px]"
              >
                Change Photo
              </button>


            </div>
          )}
        </div>
      )}

      {/* -------------------- POSTER PREVIEW WHEN posteractive IS ACTIVE -------------------- */}
      {posteractive && (
        <div className="mt-6 bg-white p-6 rounded-lg">

          <div className="flex gap-6">

            {posterImages.map((poster, index) => (
              <div
                key={index}
                className=""
              >

                {poster ? (
                  <div className="text-center">
                    <img
                      src={poster.preview}
                      className={`object-cover rounded-md ${getPosterSize()}`}
                      alt="preview"
                    />

                    <button
                      onClick={() => {
                        setSelectedPosterIndex(index);
                        setUploadPhotosOpen(true);
                      }}
                      className="text-[#0539BC] mt-3 text-[14px]"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <div
                    className={`border border-dashed border-[#C9C9C9] flex flex-col items-center justify-center text-center cursor-pointer ${getPosterSize()}`}
                    onClick={() => {
                      setSelectedPosterIndex(index);
                      setUploadPhotosOpen(true);
                    }}
                  >
                    <img src={Image} alt="" className="w-12 opacity-50" />
                    <p className="text-[#676767] mt-3 text-sm">
                      Drop your images & videos
                    </p>
                    <p className="text-[#F5A623] font-medium text-sm">
                      or click to browse
                    </p>
                  </div>
                )}

              </div>
            ))}

          </div>
        </div>
      )}




      {/* -------------------- MODAL -------------------- */}
      {uploadPhotosOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[750px] rounded-xl shadow-lg overflow-hidden">

            {/* HEADER */}
            <div className="bg-[#FBF4EB] px-6 py-4 flex items-center justify-between">
              <h2 className="text-[#2C2B2B] text-xl font-semibold">
                Upload Photos
              </h2>
              <button onClick={() => setUploadPhotosOpen(false)}>✕</button>
            </div>

            {/* BODY */}
            <div className="p-6">
              <div className="border border-dashed border-[#C9C9C9] h-[130px] flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                  <img src={Image} className="w-10 opacity-50" />
                  <p className="text-[#676767]">Drag and drop files here</p>
                </div>

                <label className="bg-[#F5A623] bg-opacity-20 text-[#C27A01] px-4 py-2 rounded-md cursor-pointer">
                  Choose file
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>

              <div className="flex justify-between text-xs text-[#747474] mt-2">
                <span>Files supported: JPEG, PNG</span>
                <span>Maximum size: 5MB</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdsAndBanner;
