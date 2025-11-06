import React, { useEffect, useState } from "react";
import Api from "../../Services/Api";
import SaveIcon from "@assets/products/save.svg";
import cancelIcon from "@assets/products/cancel.svg";
import infoIcon from "@assets/products/info.svg";
import uploadImgIcon from "@assets/products/photo.svg";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function ProductAddForm({ product, onClose, onSuccess }) {
  const [imageFiles, setImageFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    description: "",
    initialPrice: "",
    discount: "",
    price: "",
    createdDate: "",
    updatedDate: "",
    vendor: "",
    returnPolicy: "7 Days",
    imageFiles: [],
    specification: {
      Material: [],
    },
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
    if (formData.discount === "" || isNaN(formData.discount))
      newErrors.discount = "Discount is required";
    if (!formData.createdDate)
      newErrors.createdDate = "Created date is required";
    if (!formData.updatedDate)
      newErrors.updatedDate = "Updated date is required";
    if (!formData.returnPolicy)
      newErrors.returnPolicy = "Return policy is required";
    if (!formData.vendor) newErrors.vendor = "Vendor is required";
    if (imageFiles.length === 0)
      newErrors.imageFiles = "At least one image is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    console.log("formzzz, ", formData);

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const payload = new FormData();
    imageFiles.forEach((file) => {
      payload.append("images", file);
    });

    try {
      const res = await Api.post(
        `api/product/create?name=${formData.name}&description=${formData.description}&initialPrice=${formData.initialPrice}&discount=${formData.discount}&stockQuantity=2500&stockAlertThreshold=10&returnPolicy=${formData.returnPolicy}&vendorName=${formData.vendor}`,
        payload,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );

      if (res.status === 200 || res.status === 201) {
        console.log("saved res, ", res);
        // alert("Product created successfully!");
        // toast.success("Product created successfully!")
        mySwal.fire({
          title: "Success!",
          text: "Product created successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        onSuccess();
        onClose();
      } else if (res.status === 409) {
        console.log("errrrr res, ", res);
        mySwal.fire({
          icon: "error",
          title: "Oops...",
          text: "Product with this name already exists.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      console.error("Error saving product:", err);
      // alert("Error saving product.");
      // toast.error("Error saving product.")
      mySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error saving product.",
        confirmButtonColor: "#d33",
      });
    }
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
        <form onSubmit={handleSubmit} className="flex">
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
              Price
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
                    <span className="absolute left-0 top-0 mt-2 h-12 flex items-center justify-center bg-[#F5F5F5] text-[#555] text-sm px-3 rounded-l-lg border border-[#C3C3C3] border-r-0">
                      INR
                    </span>
                    <input
                      type="number"
                      name="initialPrice"
                      placeholder="120.00"
                      value={formData.initialPrice}
                      onChange={handleChange}
                      className="w-full rounded-lg  p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
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
                  <input
                    type="number"
                    name="price"
                    placeholder="120.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="flex mt-4 gap-4">
              <div>
                <label className="font-normal text-sm text-[#050710] leading-4">
                  Created Date
                </label>
                <input
                  type="date"
                  name="createdDate"
                  value={formData.createdDate}
                  onChange={handleChange}
                  className="w-[331px] rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                />
                {isSubmitted && errors.createdDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.createdDate}
                  </p>
                )}
              </div>
              <div>
                <label className="font-normal text-sm text-[#050710] leading-4">
                  Last Updated Date
                </label>
                <input
                  type="date"
                  name="updatedDate"
                  value={formData.updatedDate}
                  onChange={handleChange}
                  className="w-[332px] rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                />
                {isSubmitted && errors.updatedDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.updatedDate}
                  </p>
                )}
              </div>
            </div>

            {/* Return Policy & Vendor */}
            <div className="flex gap-4 mt-4">
              <div>
                <label className="font-normal text-sm text-[#050710] leading-4">
                  Return Policy
                </label>
                <select
                  name="returnPolicy"
                  value={formData.returnPolicy}
                  onChange={handleChange}
                  className="w-[328px] rounded-lg px-4 py-3 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                >
                  <option value="7 Days">7 Days</option>
                  <option value="14 Days">14 Days</option>
                  <option value="30 Days">30 Days</option>
                </select>
                {isSubmitted && errors.returnPolicy && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.returnPolicy}
                  </p>
                )}
              </div>
              <div>
                <label className="font-normal text-sm text-[#050710] leading-4">
                  Vendor
                </label>
                <select
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  className="w-[332px] rounded-lg px-4 py-3 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                >
                  <option value="">Select Vendor</option>
                  <option value="Nolta Enterprises">Nolta Enterprises</option>
                  <option value="Other Vendor">Other Vendor</option>
                </select>
                {isSubmitted && errors.vendor && (
                  <p className="text-red-500 text-xs mt-1">{errors.vendor}</p>
                )}
              </div>
            </div>

            {/* Specification (Optional) */}
            <div className="flex gap-4 pb-[100px] mt-4">
              <div>
                <label className="font-normal text-sm text-[#050710] leading-4">
                  Specification (Material)
                </label>
                <input
                  type="text"
                  name="Material"
                  onChange={handleChange}
                  placeholder="Enter Specification"
                  className="w-[331px] rounded-lg placeholder:text-[#B5B5B5] p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                />
              </div>
              <div>
                <label className="font-normal text-sm text-[#050710] leading-4">
                  Enter Specification
                </label>
                <input
                  type="text"
                  className="w-[332px] rounded-lg placeholder:text-[#B5B5B5] p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                  placeholder="Enter Specification"
                />
              </div>
            </div>
          </div>

          {/* Upload Files */}
          <p className="border-r border-[#EFEFEF] px-4"></p>
          <div className="pl-4 col-span-2">
            <label className="font-normal text-sm text-[#050710] leading-4">
              Product Images & Videos
            </label>
            <div
              className="w-full mt-2 border border-dashed border-[#E6E6E7] p-6 text-center rounded-md cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFiles = Array.from(e.dataTransfer.files);
                setImageFiles((prev) => [...prev, ...droppedFiles]);
              }}
            >
              <img
                src={uploadImgIcon}
                alt="Upload"
                className="w-8 h-8 mx-auto mb-2 opacity-60"
              />
              <p className="font-normal text-xs text-[#050710] leading-4">
                Drop your images & videos <br />
                or
                <span className="text-[#304BA0] ml-1 hover:text-[#0036E2] underline">
                  click to browse
                </span>
              </p>
            </div>
            <input
              type="file"
              id="fileInput"
              name="imageFiles"
              multiple
              accept="image/*,video/*"
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files);
                setImageFiles((prev) => [...prev, ...selectedFiles]);
              }}
              className="hidden"
            />
            {isSubmitted && errors.imageFiles && (
              <p className="text-red-500 text-xs mt-1">{errors.imageFiles}</p>
            )}

            <p className="text-xs items-center flex text-[#828388] leading-4 mt-4">
              <img src={infoIcon} className="w-4 h-4 mr-2" alt="" />
              Pay attention to the quality of the pictures & videos you <br />
              add (important)
            </p>

            {imageFiles.length > 0 && (
              <div className="mt-4 flex gap-3 flex-wrap">
                {imageFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 border rounded overflow-hidden group"
                  >
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <video className="object-cover w-full h-full" controls>
                        <source src={URL.createObjectURL(file)} />
                      </video>
                    )}
                    <button
                      onClick={() =>
                        setImageFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 opacity-80 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductAddForm;
