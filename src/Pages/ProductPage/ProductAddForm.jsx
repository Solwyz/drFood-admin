import React, { useEffect, useState } from "react";
import Api from "../../Services/Api";
import SaveIcon from "@assets/products/save.svg";
import cancelIcon from "@assets/products/cancel.svg";
import infoIcon from "@assets/products/info.svg";
import uploadImgIcon from "@assets/products/photo.svg";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import addIco from "@assets/products/Add.svg";
import img from "@assets/layouts/img.svg";
import add from "@assets/layouts/add.svg";

function ProductAddForm({ product, onClose, onSuccess }) {
  const [imageFiles, setImageFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    productCategoryId: "",
    packageingType: "",
    application: "",
    style: "",
    slife: "",
    stock: "",
    stockAlertThreshold: "",
    sizes: "",
    initialPrice: "",
    discount: "",
    price: "",
    vendor: "",
    returnPolicy: "7 Days",
    imageFiles: [],
    specification: { Material: [] },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const token = localStorage.getItem("token");

  const mySwal = withReactContent(Swal);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        initialPrice: product.initialPrice || "",
        discount: product.discount || "",
        price: product.price || "",
        imageFiles: [],
        specification: {
          Material: product.specification?.Material || [],
        },
        returnPolicy: product.returnPolicy || "7 Days",
        vendor: product.vendor || "Nolta",
        createdDate: product.createdDate || "",
        updatedDate: product.updatedDate || "",
      });
    }
  }, [product]);

  useEffect(() => {
    const ip = parseFloat(formData.initialPrice);
    const d = parseFloat(formData.discount);
    if (!isNaN(ip) && !isNaN(d)) {
      const discounted = ip - (ip * d) / 100;
      setFormData((prev) => ({ ...prev, price: Math.round(discounted) }));
    }
  }, [formData.initialPrice, formData.discount]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFiles") {
      setFormData({ ...formData, imageFiles: Array.from(files) });
    } else if (name === "Material") {
      const materials = value.split(",").map((m) => m.trim());
      setFormData((prev) => ({
        ...prev,
        specification: {
          ...prev.specification,
          Material: materials,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Product description is required";
    if (!formData.initialPrice || parseFloat(formData.initialPrice) <= 0)
      newErrors.initialPrice = "Enter a valid list price";
    if (formData.price === "" || isNaN(formData.price))
      newErrors.price = "Price is required";
    if (!formData.packageingType.trim())
      newErrors.packageingType = "Packaging Type is required";
    if (!formData.application.trim())
      newErrors.application = "Application is required";
    if (!mainImage && secondaryFiles.length === 0)
      newErrors.imageFiles = "At least one product image is required";
    if (!formData.style.trim()) newErrors.style = "Style is required";
    if (!formData.slife.trim()) newErrors.slife = "Shelf life is required";
    if (!formData.stock || isNaN(formData.stock))
      newErrors.stock = "Stock is required";
    if (!formData.stockAlertThreshold || isNaN(formData.stockAlertThreshold))
      newErrors.stockAlertThreshold = "Stock threshold is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    console.log("Called");
    e.preventDefault();
    setIsSubmitted(true);

    const allImages = [];
    if (mainImage) allImages.push(mainImage);
    if (secondaryFiles.length > 0) allImages.push(...secondaryFiles);

    const validationErrors = validate();
    if (allImages.length === 0) {
      validationErrors.imageFiles = "At least one image is required.";
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const query = new URLSearchParams({
      name: formData.name,
      packageingType: formData.packageingType,
      application: formData.application,
      style: formData.style,
      slife: formData.slife,
      stock: formData.stock,
      size: formData.sizes,
      initialPrice: formData.initialPrice,
      discount: formData.discount,
      stockAlertThreshold: formData.stockAlertThreshold,
    });
    console.log("Tholi");

    const payload = new FormData();
    allImages.forEach((file) => payload.append("images", file));

    for (let [key, val] of payload.entries()) {
      console.log(key, val);
    }
    console.log("After payroll");

    try {
      const res = await Api.post(
        `product/add?name=${formData.name}&packageingType=${formData.packageingType}&application=${formData.application}&style=${formData.style}&slife=${formData.slife}&stock=${formData.stock}&sizes=xl&initialPrice=${formData.initialPrice}&discount=${formData.discount}&stockAlertThreshold=${formData.stockAlertThreshold}`,
        payload,

        {
          "Content-Type": "multipart/form-data",
        }
      );
      console.log(res.status);

      if (res.status === 200 || res.status === 201) {
        mySwal.fire({
          title: "Success!",
          text: "Product created successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        onSuccess();
        onClose();
      } else if (res.status === 409) {
        mySwal.fire({
          icon: "error",
          title: "Oops...",
          text: "Product with this name already exists.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      console.error("Error saving product:", err);
      mySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error saving product.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [mainImage, setMainImage] = useState(null);
  const [secondaryFiles, setSecondaryFiles] = useState([]);

  const handleMainChange = (e) => {
    const file = e.target.files[0];
    if (file) setMainImage(file);
  };

  const handleSecondaryChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updated = [...secondaryFiles, ...newFiles].slice(0, 4);
    setSecondaryFiles(updated);
  };

  const removeSecondary = (i) => {
    setSecondaryFiles((prev) => prev.filter((_, index) => index !== i));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl leading-6 text-[#2C2B2B] font-medium">
          Product Management
        </h1>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex bg-white h-10 items-center rounded-lg border border-[#D5D5D5] hover:border-[#004D96] duration-300 text-[#2C2B2B] text-sm font-normal px-4"
          >
            <img src={cancelIcon} className="mr-2 w-4 h-4" alt="" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex bg-[#BF6A02] hover:bg-[#965B13] duration-300 h-10 items-center rounded-lg text-white text-sm font-normal px-4"
          >
            <img src={SaveIcon} className="mr-2 w-4 h-4" alt="" />
            {product ? "Update Product" : "Save"}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 mt-4 rounded-lg overflow-auto">
        <form onSubmit={handleSubmit} className="flex justify-between">
          <div className="w-[679px]">
            {/* Product Name */}
            <div className="col-span-2">
              <label className="font-normal text-sm text-[#050710] leading-4">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
              />
              {isSubmitted && errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Product ID - disabled */}
            <div className="col-span-2 mt-4">
              <label className="font-normal text-sm text-[#050710] leading-4">
                Product ID
              </label>
              <input
                type="text"
                value={product?.id || "Auto Generated"}
                disabled
                className="w-full rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
              />
            </div>

            {/* Description */}
            <div className="col-span-2 mt-4">
              <label className="font-normal text-sm text-[#050710] leading-4">
                Product Description
              </label>
              <textarea
                placeholder="Product Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-lg p-4 resize-none font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-[200px]"
              />
              {isSubmitted && errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Price Section */}
            <h1 className="font-normal text-sm text-[#050710] leading-4 mt-4">
              Varients
            </h1>
            <div className="border mt-2 rounded-lg p-6">
              <div className="flex gap-4">
                <div>
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="discount"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="w-full rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                  />
                  {isSubmitted && errors.quantity && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.quantity}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Sale Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-0 top-0 m-[3px] mt-[11px]  flex items-center justify-center bg-[#F9F9FB] text-[#696A70] text-sm px-[13px] rounded-l border h-[42px]">
                      INR
                    </span>
                    <input
                      type="number"
                      name="initialPrice"
                      placeholder="120.00"
                      value={formData.initialPrice}
                      onChange={handleChange}
                      className="w-full rounded-lg pl-[69px] p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                    />
                  </div>
                  {isSubmitted && errors.initialPrice && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.initialPrice}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Discounted Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-0 top-0 m-[3px] mt-[11px]  flex items-center justify-center bg-[#F9F9FB] text-[#696A70] text-sm px-[13px] rounded-l border h-[42px]">
                      INR
                    </span>
                    <input
                      type="number"
                      name="price"
                      placeholder="120.00"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full rounded-lg pl-[69px] p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                    />
                  </div>
                </div>
              </div>
              <button className="flex bg-[#BF6A02] hover:bg-[#965B13] mt-[31px] w-full duration-300 h-12 items-center justify-center rounded-lg text-white text-sm font-normal p-[14px] ">
                <img src={addIco} className="mr-2 w-4 h-4" alt="" />
                Add New Varient
              </button>
            </div>

            {/* Details Section */}
            <h1 className="font-normal text-sm text-[#050710] leading-4 mt-4">
              Varients
            </h1>
            <div className="border mt-2 rounded-lg p-6">
              <div className="flex gap-4">
                <div className="w-full">
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Packaging Type
                  </label>
                  <input
                    type="text"
                    name="packageingType"
                    placeholder="Packaging Type"
                    value={formData.packageingType}
                    onChange={handleChange}
                    className="w-full rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                  />
                </div>

                <div className="w-full">
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Application
                  </label>
                  <input
                    type="text"
                    name="application"
                    placeholder="Application"
                    value={formData.application}
                    onChange={handleChange}
                    className="w-full rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                  />
                </div>
              </div>
              <div className="flex mt-[26px] gap-4">
                <div className="w-full">
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Shelf life
                  </label>
                  <input
                    type="text"
                    name="slife"
                    placeholder="Shelf Life"
                    value={formData.slife}
                    onChange={handleChange}
                    className="w-full rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                  />
                </div>

                <div className="w-full">
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Style
                  </label>
                  <input
                    type="text"
                    name="style"
                    placeholder="Style"
                    value={formData.style}
                    onChange={handleChange}
                    className="w-full rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                  />
                </div>
              </div>
              <div className="flex mt-[26px] gap-4">
                <div className="w-[49%]">
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Country of Origin
                  </label>
                  <input
                    type="text"
                    name="price"
                    placeholder="Country of Origin"
                    className="w-full rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                  />
                </div>
              </div>
            </div>
            <div className="flex mt-[26px] gap-4">
              <div className="w-[49%]">
                <label className="font-normal text-sm text-[#050710] leading-4">
                  Stock Quantity
                </label>
                <input
                  type="text"
                  name="stock"
                  placeholder="Stock Quantity"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                />
              </div>
              <div className="w-[49%]">
                <label className="font-normal text-sm text-[#050710] leading-4">
                  Stock Threshold
                </label>
                <input
                  type="text"
                  name="stockAlertThreshold"
                  placeholder="Stock Threshold"
                  value={formData.stockAlertThreshold}
                  onChange={handleChange}
                  className="w-full rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                />
              </div>
            </div>
          </div>

          {/* Upload Files */}
          <div className="mr-6">
            <label className="font-normal text-sm text-[#050710]">
              Product Images & Videos
            </label>

            {/* Main Upload Box */}
            <div
              className="relative w-[330px] py-10 mt-2 border border-dashed border-[#C3C3C3] rounded-md cursor-pointer flex flex-col items-center justify-center bg-white text-center"
              onClick={() => setShowModal(true)}
            >
              {mainImage ? (
                mainImage.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(mainImage)}
                    alt="Main"
                    className="w-full h-[152px] object-cover rounded-md"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(mainImage)}
                    controls
                    className="w-full h-full object-cover rounded-md"
                  />
                )
              ) : (
                <>
                  <img
                    src={img}
                    alt="Upload"
                    className="w-8 h-8 mx-auto mb-2 opacity-60"
                  />
                  <p className="font-normal text-xs text-[#050710]">
                    Drop your images & videos <br />
                    or <span className="text-[#BF6A02]">click to browse</span>
                  </p>
                </>
              )}

              {mainImage && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMainImage(null);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1 opacity-80 hover:opacity-100"
                >
                  ✕
                </button>
              )}
            </div>

            <input
              id="mainUpload"
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleMainChange}
            />

            {/* Secondary Upload Boxes */}
            <div className="flex gap-3 mt-3 flex-wrap">
              {secondaryFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative w-14 h-14 border border-dashed border-[#C3C3C3] rounded-md overflow-hidden"
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="secondary"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      className="object-cover w-full h-full"
                      controls
                    />
                  )}
                  <button
                    onClick={() => removeSecondary(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 opacity-80 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Empty slots for remaining uploads */}
              {Array.from({ length: 4 - secondaryFiles.length }).map((_, i) => (
                <div
                  key={i}
                  className="w-14 h-14 border border-dashed border-[#C3C3C3] rounded-md flex items-center justify-center cursor-pointer"
                  onClick={() =>
                    document.getElementById("secondaryUpload").click()
                  }
                >
                  <img src={add} alt="" />
                </div>
              ))}
            </div>

            <input
              id="secondaryUpload"
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleSecondaryChange}
            />
          </div>
        </form>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[600px] p-6 relative shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-[#050710]">
              Add Product Image
            </h2>

            {/* Drop zone */}
            <div
              className="border border-dashed border-[#C3C3C3] rounded-md p-6 text-center cursor-pointer hover:border-[#BF6A02] transition"
              onClick={() => document.getElementById("uploadInput").click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files);
                setUploadFiles((prev) => [...prev, ...files]);
              }}
            >
              <p className="text-sm text-[#555]">
                Drag and drop files here or{" "}
                <span className="text-[#BF6A02] font-medium">Choose file</span>
              </p>
              <p className="text-xs text-[#888] mt-1">
                Files supported: JPEG, PNG • Max size: 5MB
              </p>
            </div>

            <input
              id="uploadInput"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setUploadFiles((prev) => [...prev, ...files]);
              }}
            />

            {/* File previews */}
            {uploadFiles.length > 0 && (
              <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
                {uploadFiles.map((file, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-3 flex items-center gap-3"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-[#050710] truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-[#777]">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                      <div className="w-full bg-gray-200 h-1 rounded mt-1">
                        <div
                          className="bg-green-500 h-1 rounded"
                          style={{ width: `${progress[file.name] || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <button
                      className="text-gray-500 hover:text-red-500"
                      onClick={() =>
                        setUploadFiles((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 text-sm border rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#BF6A02] text-white px-5 py-2 text-sm rounded hover:bg-[#a55a00]"
                onClick={() => {
                  // Simulate upload progress
                  uploadFiles.forEach((file, idx) => {
                    setProgress((p) => ({ ...p, [file.name]: 0 }));

                    const interval = setInterval(() => {
                      setProgress((p) => {
                        const newProgress = (p[file.name] || 0) + 20;

                        if (newProgress >= 100) {
                          clearInterval(interval);

                          // Add main image if it's the first one
                          if (idx === 0) {
                            setMainImage(file);
                          } else {
                            // Avoid duplicates
                            setSecondaryFiles((prev) => {
                              const exists = prev.some(
                                (f) => f.name === file.name
                              );
                              if (exists) return prev;
                              return [...prev, file];
                            });
                          }
                        }

                        return {
                          ...p,
                          [file.name]: Math.min(100, newProgress),
                        };
                      });
                    }, 300);
                  });

                  // Clear upload state once done
                  setTimeout(() => {
                    setShowModal(false);
                    setUploadFiles([]);
                    setProgress({});
                  }, 1600);
                }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductAddForm;
