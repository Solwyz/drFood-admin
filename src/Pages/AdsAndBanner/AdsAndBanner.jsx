import React, { useState } from "react";
import mobile from "@assets/layouts/mob.svg";
import web from "@assets/layouts/web.svg";
import arrowDwn from "@assets/layouts/downArrow.svg";
import arrowUp from "@assets/layouts/upArrow.svg";
import uploadIcn from "@assets/layouts/upload.svg";
import closeIcn from "@assets/layouts/close.svg";
import imageIcn from "@assets/layouts/image.svg";
import Api from "../../Services/Api";

function AdsAndBanners() {
  const [openSection, setOpenSection] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [selectedBannerName, setSelectedBannerName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

  const sections = [
    {
      id: "mobile",
      title: "Mobile",
      icon: mobile,
      categoryId: 1,
      banners: [
        "Home - top slider banners",
        "Home - MYO branding ads",
        "Coupon Banners",
        "Section 4 (Future)",
        "Section 5 (Future)",
      ],
    },
    {
      id: "website",
      title: "Website",
      icon: web,
      categoryId: 2,
      banners: [
        "Home - Hero banner",
        "Home - New Arrivals",
        "Home - branding ads",
        "Home - Top selling section",
        "Home - Lucky draw ad",
        "Coupon banner",
      ],
    },
  ];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + "mb",
      progress: 0,
    }));
    setUploadFiles(files);

    files.forEach((fileObj, index) => {
      let prog = 0;
      const interval = setInterval(() => {
        prog += 10;
        setUploadFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, progress: Math.min(prog, 100) } : f
          )
        );
        if (prog >= 100) clearInterval(interval);
      }, 200);
    });
  };

  const handleUpload = async () => {
    console.log('upld files', uploadFiles)
    if (!uploadFiles.length) {
      alert("Please select at least one image");
      return;
    }

    const formData = new FormData();

    uploadFiles.forEach((file) => {
      formData.append("imageUrls", file.file); // ✅ correct
    });
  
    // Debug: log all entries
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // formData.append("imageUrls", uploadFiles);
  
  
    setLoading(true);
    try {
      
      // append each file
      // uploadFiles.forEach((file) => {
      //   formData.append("imageUrls", file.file); // ✅ actual File object
      // });

      
      // send as multipart/form-data
      await Api.post(`api/banner/add?name=${selectedBannerName}&bannerCategoryId=${selectedCategoryId}`, formData, {
        
          "Content-Type": "multipart/form-data",
        
      });
  
      console.log('formdataaaa',formData);
      setOpenModal(false);
      setUploadFiles([]);
    } catch (error) {
      console.error(`❌ Failed to upload ${selectedBannerName}:`, error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-xl leading-6 text-[#2C2B2B] font-medium">
        Ads and Banner
      </h1>

      <div className="bg-white mt-4">
        {sections.map((section) => (
          <div key={section.id} className="border-b">
            <div
              className="flex items-center justify-between p-6 cursor-pointer"
              onClick={() =>
                setOpenSection(openSection === section.id ? null : section.id)
              }
            >
              <div className="flex items-center gap-2">
                <img src={section.icon} alt="" className="w-5 h-5" />
                <span className="text-base leading-5 font-medium">
                  {section.title}
                </span>
              </div>
              <img
                src={openSection === section.id ? arrowUp : arrowDwn}
                alt=""
                className="w-6 h-6"
              />
            </div>

            {openSection === section.id && (
              <div className="grid grid-cols-3 gap-4 px-4 pb-4">
                {section.banners.map((banner, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedBannerName(banner);
                      setSelectedCategoryId(section.categoryId);
                      setOpenModal(true);
                    }}
                    className="bg-[#F8F8F8] text-[#5F6D99] hover:text-[#192030] font-medium text-base leading-5 rounded-lg p-4 text-left hover:bg-[#E2EBFF] transition"
                  >
                    {banner}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start pt-[132px] justify-center z-50">
          <div className="bg-white rounded-lg w-[620px] relative">
            <div className="bg-[#F0F5FF] py-4 px-6 flex justify-between items-center">
              <h2 className="text-base leading-5 text-[#192030] font-medium">
                Upload Banners - {selectedBannerName}
              </h2>
              <button onClick={() => setOpenModal(false)}>
                <img src={closeIcn} alt="Close" className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {/* File upload area */}
              <label className="border-2 border-dashed border-gray-300 px-4 py-2 flex items-center h-12 justify-between rounded-lg cursor-pointer">
                <img src={imageIcn} alt="" className="w-8 h-8" />
                <p className="text-sm text-gray-500">
                  Drag and drop files here
                </p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept="image/jpeg,image/png"
                  onChange={handleFileSelect}
                />
                <p className="px-4 py-[6px] bg-[#BEC3E8] text-[#394073] text-xs font-medium rounded-md">
                  Choose File
                </p>
              </label>
              <p className="text-[10px] flex justify-between mt-2 text-[#747474]">
                Files supported: JPEG, PNG <span>Max size: 5MB</span>
              </p>

              {/* Preview upload progress */}
              <div className="mt-4 space-y-2 overflow-y-auto">
                {uploadFiles.map((file, i) => (
                  <div
                    key={i}
                    className="relative border border-[#EDEDED] rounded-lg p-2 flex items-center gap-3"
                  >
                    <button
                      onClick={() =>
                        setUploadFiles((prev) =>
                          prev.filter((_, index) => index !== i)
                        )
                      }
                      className="absolute top-2 right-2"
                    >
                      <img src={closeIcn} alt="Remove" className="w-5 h-5" />
                    </button>

                    <img
                      src={URL.createObjectURL(file.file)}
                      alt={file.name}
                      className="w-[71px] h-10 rounded"
                    />
                    <div className="flex-1">
                      <p className="text-xs">{file.name}</p>
                      <p className="text-xs">{file.size}</p>
                      <div className="w-full bg-[#E7E7E7] rounded-full h-[6px] mt-2.5">
                        <div
                          className="bg-[#39961B] h-[6px] rounded-full"
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs mt-[22px]">
                      {file.progress}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="bg-[#004D96] text-white px-4 py-3 rounded-lg w-[120px] h-10 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <img src={uploadIcn} alt="" className="w-4 h-4" />
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdsAndBanners;
