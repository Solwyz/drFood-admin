import React, { useEffect, useRef, useState } from "react";
import mobile from "@assets/layouts/mobile.png";
import web from "@assets/layouts/desktop.png";
import tab from "@assets/layouts/tablet.png";
import arrowDwn from "@assets/layouts/chevronleft.svg";
import uploadIcn from "@assets/layouts/upload.svg";
import closeIcn from "@assets/layouts/close.svg";
import imageIcn from "@assets/layouts/image.svg";
import save from "@assets/layouts/save1.svg";
import Api from "../../Services/Api";



function AdsAndBanners() {
    const [activePage, setActivePage] = useState("main"); // main | homeBanner | categoryPoster | homeAdsPoster
    const [selectedSection, setSelectedSection] = useState(""); // "Mobile" | "Desktop" | "Tab"
    const [selectedBannerName, setSelectedBannerName] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [formData, setFormData] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);


    // files to upload in the modal
    const [uploadFiles, setUploadFiles] = useState([]); // { file, name, size, progress, preview }
    const [modalOpen, setModalOpen] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [loading, setLoading] = useState(false);

    // preview shown on full page (after successful upload)
    const [previewUrl, setPreviewUrl] = useState(null);

    const fileInputRef = useRef(null);
    const modalFileInputRef = useRef(null);
    const token = localStorage.getItem("token");

    // Sections helpers
    const DEFAULT_SECTIONS = [
        { id: "mobile", title: "Mobile", icon: mobile, categoryId: 1 },
        { id: "website", title: "Desktop", icon: web, categoryId: 2 },
    ];
    const ADS_SECTIONS = [
        ...DEFAULT_SECTIONS,
        { id: "tab", title: "Tab", icon: tab, categoryId: 3 },
    ];
    const getSectionsForPage = () => (activePage === "homeAdsPoster" ? ADS_SECTIONS : DEFAULT_SECTIONS);

    // cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            uploadFiles.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // revoke previews when uploadFiles cleared
    useEffect(() => {
        if (!uploadFiles.length) return;
        return () => {
            // This cleanup revokes when uploadFiles change next time
            uploadFiles.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
        };
    }, [uploadFiles]);

    // Add files and open modal if requested
    const addFiles = (fileList, openModalAfterAdd = true) => {
        const files = Array.from(fileList).map((file) => ({
            file,
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(1) + "mb",
            progress: 0,
            preview: URL.createObjectURL(file),
        }));
        setUploadFiles(files);
        if (openModalAfterAdd) setModalOpen(true);

        // simulate a brief initial progress on each file so user sees activity in modal
        files.forEach((_, index) => {
            let prog = 0;
            const id = setInterval(() => {
                prog += 10;
                setUploadFiles((prev) => prev.map((f, i) => (i === index ? { ...f, progress: Math.min(prog, 100) } : f)));
                if (prog >= 100) clearInterval(id);
            }, 120);
        });
    };

    // full-page drop handlers: on drop, add files and open modal
    const handleDropOnFullPage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        if (e.dataTransfer?.files && e.dataTransfer.files.length) {
            addFiles(e.dataTransfer.files, true);
        }
    };

    // clicking the big full page drop area should open the modal (without selecting files)
    // user can then choose files inside the modal
    const handleClickFullPageDrop = () => {
        setModalOpen(true);
    };

    // modal's file input
    const handleModalFileSelect = (e) => {
        if (e.target.files && e.target.files.length) {
            addFiles(e.target.files, false); // files already added and modal is open
        }
    };

    // remove a single file from uploadFiles
    const removeFile = (index) => {
        const f = uploadFiles[index];
        if (f?.preview) URL.revokeObjectURL(f.preview);
        setUploadFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // upload to server
    const handleUpload = async () => {
        console.log('upplldddddd')
        if (!uploadFiles.length) {
            alert("Please select at least one image");
            return;
        }

        const formData = new FormData();
        uploadFiles.forEach((f) => formData.append("imageUrls", f.file));

        setLoading(true);

        try {
            // If Api is an axios instance, we can use onUploadProgress; if not, fallback to no-progress
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
                onUploadProgress: (progressEvent) => {
                    if (!progressEvent) return;
                    const { loaded, total } = progressEvent;
                    const percent = total ? Math.round((loaded * 100) / total) : 0;
                    // set a simple overall progress on each file (visual feedback)
                    setUploadFiles((prev) => prev.map((f) => ({ ...f, progress: percent })));
                },
            };


            const firstFile = uploadFiles[0];
            if (firstFile) {
                // create a new safe object URL (separate from the uploadFiles array)
                const newPreviewUrl = URL.createObjectURL(firstFile.file);
                setPreviewUrl(newPreviewUrl);
            }
            setUploadFiles([]); // clear after setting new preview URL
            setModalOpen(false);

            console.log('upldfilresdsdfdsffdf', firstFile)
            setUploadedFile(firstFile.file)

            // keep the user on the same page with the preview visible
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Upload failed. See console for details.");
        } finally {
            setLoading(false);
        }
    };

    // Save button behavior: depends on your API. For now we will simply log the action.
    // If you have a specific save endpoint (to persist which banner is active), call it here.
    // const handleSave = async () => {
    //     if (!previewUrl) {
    //         alert("Please upload a banner before saving.");
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append("imageUrls", uploadedFile)

    //     try {

    //         const response = await fetch(previewUrl);
    //         // const blob = await response.blob();
    //         // uploadFiles.forEach((f) => formData.append("imageUrls", f.file));
    //         // formData.append("imageUrls", blob);
    //         console.log('formData:', formData);
    //         console.log('tknnn:', token);
    //         // console.log('blooobb:', blob.type);
    //         console.log('imageeee', uploadFiles);

    //         const config = {
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //                 Authorization: `Bearer ${token}`
    //             },
    //         };

    //         const res = await Api.post(`banner/create?name=${encodeURIComponent(selectedBannerName)}`, formData, config);


    //         if (res.data && res.data.success) {
    //             alert("Banner saved successfully!");
    //         } else {
    //             alert("Save failed. Please try again.");
    //         }
    //         console.log("Banner saved:", res);
    //     } catch (err) {
    //         console.error("Save failed:", err);
    //         alert("Save failed. See console for details.");
    //     }
    // };

    const handleSave = async () => {
        if (!uploadedFile) {
            alert("Please upload a banner before saving.");
            return;
        }

        const formData = new FormData();
        formData.append("images", uploadedFile); // ✅ use the uploaded image file

        console.log('tokkkkn', token)
        console.log('formdataaaaaz', formData);
        console.log('upldfileeeee', uploadedFile);

        try {
            const config = {
                
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
               
            };

            const res = await Api.post(
                `banner/create?name=${encodeURIComponent(selectedBannerName)}`,
                formData,
                config
            );

            console.log('save res', res)

            if (res && res.status === 200) {
                alert("Banner saved successfully!");
            } else {
                alert("Save failed. Please try again.");
            }
        } catch (err) {
            console.error("Save failed:", err);
            alert("Save failed. See console for details.");
        }
    };



    // "Change Photo" re-opens the modal so user can replace the image
    const handleChangePhoto = () => {
        setModalOpen(true);
    };

    // UI
    return (
        <div className="p-4">
            {/* Breadcrumb */}
            <h1 className={`text-base flex items-center  leading-6 text-[#2C2B2B] font-medium mb-4 ${activePage !== "main" ? "text-[#717171]" : ""}`}>
                <span
                    className="cursor-pointer text-[#717171]"
                    onClick={() => {
                        setActivePage("main");
                        setSelectedSection("");
                        // clear preview? no - keep preview unless user navigates away completely
                    }}
                >
                    Ads and Banners
                </span>

                {activePage !== "main" && (
                    <>
                        <span className="mx-2 text-[#9b9b9b]">›</span>
                        <span
                            className="cursor-pointer text-[#717171]"
                            onClick={() => {
                                setSelectedSection("");
                            }}
                        >
                            {activePage === "homeBanner" ? "Home Banner" : activePage === "categoryPoster" ? "Category Poster" : "Home Ads Poster"}
                        </span>

                        {selectedSection && (
                            <>
                                <span className="mx-2 text-[#9b9b9b]">›</span>
                                <span className="text-black">{selectedSection}</span>
                            </>
                        )}
                    </>
                )}
                {selectedSection && (


                    <div className="flex flex-1 justify-end">
                        <button
                            onClick={handleSave}
                            className="bg-[#C36A00] text-white px-4 py-2 rounded text-sm font-normal flex "
                        >
                            <img src={save} alt="" className="mr-2" />
                            Save
                        </button>
                    </div>
                )}

            </h1>

            {/* Main page */}
            {activePage === "main" && (
                <div className="bg-white flex gap-4 p-4 ">
                    {[
                        { title: "Home Banner", key: "homeBanner" },
                        { title: "Categories Poster", key: "categoryPoster" },
                        { title: "Home Ads Posters", key: "homeAdsPoster" },
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => {
                                setActivePage(item.key);
                                setSelectedSection("");
                                setSelectedBannerName("");
                                setPreviewUrl(null);
                            }}
                            className="flex-1 bg-[#F8F8F8] text-[#787878] hover:text-[#383838] hover:bg-[#FFF2E5] font-medium text-base leading-5 rounded-lg p-4 text-left transition flex items-center justify-between"
                        >
                            {item.title}
                            <span className="text-[24px]">›</span>
                        </button>
                    ))}
                </div>
            )}

            {/* sections (Desktop/Mobile/Tab) */}
            {activePage !== "main" && !selectedSection && (
                <div className="bg-white mt-4 grid grid-cols-3 gap-4 p-4">
                    {getSectionsForPage().map((section) => (
                        <div key={section.id} className="bg-[#F8F8F8] rounded-lg hover:bg-[#FFF2E5]">
                            <div
                                className="flex items-center justify-between py-4 pl-4 pr-6 cursor-pointer"
                                onClick={() => {
                                    setSelectedSection(section.title);
                                    setSelectedBannerName(
                                        `${activePage === "homeBanner" ? "Home Banner" : activePage === "categoryPoster" ? "Category Poster" : "Home Ads Poster"} - ${section.title}`
                                    );
                                    setSelectedCategoryId(section.categoryId);
                                    // keep previewUrl from previous if any; user can change photo
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <img src={section.icon} alt="" className="w-5 h-5" />
                                    <span className="text-base leading-5 font-medium text-[#787878]">{section.title}</span>
                                </div>
                                <img src={arrowDwn} alt="" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* full page upload area or preview */}
            {selectedSection && (
                <div className="mt-8 bg-white p-6">
                    {/* If no previewUrl -> show the empty large drop area */}
                    {!previewUrl ? (
                        <div
                            className={`border-2 rounded pt-[168px] pb-[128px] relative ${dragOver ? "border-dashed border-[#0066cc] bg-[#fbfdff]" : "border-dashed border-[#e3e3e3] bg-white"}`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                setDragOver(false);
                            }}
                            onDrop={handleDropOnFullPage}
                            onClick={handleClickFullPageDrop}
                            style={{ minHeight: 260 }}
                        >
                            <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-center">
                                <img src={imageIcn} alt="upload" className="w-12 h-12 opacity-60" />
                                <div>
                                    <p className="text-sm text-[#050710]">
                                        Drop your images & videos <br />
                                        or
                                        <button
                                            type="button"
                                            className=" text-[#BF6A02] ml-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalOpen(true);
                                                // allow modal to open and user to choose files there
                                            }}
                                        >
                                            click to browse
                                        </button>
                                    </p>
                                </div>

                                <div className="mt-3">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/png"
                                        className="hidden"
                                        onChange={(e) => {
                                            // if user chooses directly from top-level file input (not modal)
                                            if (e.target.files && e.target.files.length) {
                                                addFiles(e.target.files, true);
                                            }
                                        }}
                                    />
                                    {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 bg-[#BEC3E8] text-[#394073] rounded-md text-xs font-medium"
                  >
                    Choose File
                  </button> */}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // show large preview with "Change Photo" and "Save"
                        <div className="bg-white  ">
                            <div className=" ">
                                <img src={previewUrl} alt="preview" className="w-full h-[512px] object-cover object-center rounded" />
                                <div className="text-center mt-2">
                                    <button
                                        className="text-blue-600 underline text-sm"
                                        onClick={() => {
                                            handleChangePhoto();
                                        }}
                                    >
                                        Change Photo
                                    </button>
                                </div>
                            </div>


                        </div>
                    )}
                </div>
            )}

            {/* ------------------ Modal (appears when modalOpen === true) ------------------ */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start pt-[120px] justify-center z-50">
                    <div className="bg-white w-[620px] relative">
                        <div className="bg-[#FEF8F0] py-4 px-6 flex justify-between items-center">
                            <h2 className="text-base leading-5 text-[#192030] font-medium">{selectedBannerName || "Upload Banners"}</h2>
                            <button
                                onClick={() => {
                                    setModalOpen(false);
                                    // keep selectedSection (full page) visible
                                    // clear uploadFiles only if you want; we keep them so user can resume
                                }}
                            >
                                <img src={closeIcn} alt="Close" className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* modal file input area */}
                            <label
                                className="border-2 border-dashed border-gray-300 px-4 py-2 flex items-center h-12 justify-between cursor-pointer"
                                onDragOver={(e) => {
                                    e.preventDefault();
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    if (e.dataTransfer?.files && e.dataTransfer.files.length) {
                                        addFiles(e.dataTransfer.files, false);
                                    }
                                }}
                            >
                                <img src={imageIcn} alt="" className="w-8 h-8" />
                                <p className="text-sm text-gray-500">Drag and drop files here</p>

                                <input
                                    ref={modalFileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png"
                                    className="hidden"
                                    onChange={handleModalFileSelect}
                                />
                                <p
                                    className="px-5 py-[6px] bg-[#FCEFDF] text-[#BF6A02] text-xs font-medium rounded-md"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        modalFileInputRef.current?.click();
                                    }}
                                >
                                    Choose File
                                </p>
                            </label>

                            <p className="text-[10px] flex justify-between mt-2 text-[#747474]">
                                Files supported: JPEG, PNG <span>Max size: 5MB</span>
                            </p>

                            {/* Files list */}
                            <div className="mt-4 space-y-2 max-h-[220px] overflow-y-auto">
                                {uploadFiles.map((file, i) => (
                                    <div key={i} className="relative border border-[#EDEDED] rounded-lg p-2 flex items-center gap-3">
                                        <button
                                            onClick={() => removeFile(i)}
                                            className="absolute top-2 right-2"
                                        >
                                            <img src={closeIcn} alt="Remove" className="w-5 h-5" />
                                        </button>

                                        <img src={file.preview} alt={file.name} className="w-[71px] h-10 rounded object-cover" />
                                        <div className="flex-1">
                                            <p className="text-xs">{file.name}</p>
                                            <p className="text-xs">{file.size}</p>
                                            <div className="w-full bg-[#E7E7E7] rounded-full h-[6px] mt-2.5">
                                                <div className="bg-[#39961B] h-[6px] rounded-full" style={{ width: `${file.progress}%` }} />
                                            </div>
                                        </div>
                                        <span className="text-xs mt-[22px]">{file.progress}%</span>
                                    </div>
                                ))}

                                {!uploadFiles.length && (
                                    <div className="text-center text-xs text-[#999] py-6">No files selected</div>
                                )}
                            </div>

                            {/* Upload button */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleUpload}
                                    disabled={loading || !uploadFiles.length}
                                    className="bg-[#BF6A02] text-white px-4 py-3 rounded-lg w-[120px] h-10 flex items-center justify-center gap-2 disabled:opacity-50"
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
