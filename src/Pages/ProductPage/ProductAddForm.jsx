"use client";
import React, { useEffect, useState } from "react";
import Api from "../../Services/Api";
import SaveIcon from "@assets/products/save.svg";
import cancelIcon from "@assets/products/cancel.svg";
import img from "@assets/layouts/img.svg";
import add from "@assets/layouts/add.svg";
import addIco from "@assets/products/Add.svg";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function ProductAddForm({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    productCategoryId: "",
    packageingType: "",
    application: "",
    style: "",
    slife: "",
    stock: "0",
    stockAlertThreshold: 10,
    vendor: "",
    returnPolicy: "7 Days",
  });

  const [variants, setVariants] = useState([
    { size: "", price: "", stock: "", discount: "" },
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [mainImage, setMainImage] = useState(null);
  const [secondaryFiles, setSecondaryFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const mySwal = withReactContent(Swal);
  const [token] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        productCategoryId: product.category?.id || "",
        packageingType: product.packageingType || "",
        application: product.application || "",
        style: product.style || "",
        slife: product.slife || "",
        countryOfOrigin: product.countryOfOrigin || "",
        stock: product.stock?.toString() || "0",
        stockAlertThreshold: product.stockAlertThreshold || 10,
        vendor: product.vendor || "",
        returnPolicy: product.returnPolicy || "7 Days",
      });

      // load variants
      if (Array.isArray(product.variants) && product.variants.length > 0) {
        const loadedVariants = product.variants.map((v) => ({
          size: v.size || "",
          price: v.initialPrice?.toString() || "",
          stock: v.stock?.toString() || "",
          discount: v.discount?.toString() || "",
        }));
        setVariants(loadedVariants);
      }

      // load images
      if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
        setMainImage(product.imageUrls[0]);
        if (product.imageUrls.length > 1) {
          setSecondaryFiles(product.imageUrls.slice(1));
        }
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: "", price: "", stock: "", discount: "" },
    ]);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};

    // Product name
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    else if (formData.name.length < 3)
      newErrors.name = "Product name must be at least 3 characters";

    // Description
    if (!formData.description.trim())
      newErrors.description = "Product description is required";
    else if (formData.description.length < 10)
      newErrors.description =
        "Description should be at least 10 characters long";

    // Packaging Type
    if (!formData.packageingType.trim())
      newErrors.packageingType = "Packaging Type is required";

    // Application
    if (!formData.application.trim())
      newErrors.application = "Application is required";

    // Style
    if (!formData.style.trim()) newErrors.style = "Style is required";

    // Shelf Life
    if (!formData.slife.trim()) newErrors.slife = "Shelf life is required";

    // Stock
    if (!formData.stock || isNaN(formData.stock))
      newErrors.stock = "Stock must be a valid number";
    else if (parseInt(formData.stock) < 0)
      newErrors.stock = "Stock cannot be negative";

    // Stock threshold
    if (!formData.stockAlertThreshold || isNaN(formData.stockAlertThreshold))
      newErrors.stockAlertThreshold = "Stock threshold is required";
    else if (parseInt(formData.stockAlertThreshold) < 0)
      newErrors.stockAlertThreshold = "Stock threshold cannot be negative";

    // Image validation
    if (!mainImage && secondaryFiles.length === 0)
      newErrors.imageFiles = "At least one product image is required";

    // Variant validation
    variants.forEach((variant, index) => {
      console.log(variant.discount);
      if (!variant.size.trim())
        newErrors[`variant_size_${index}`] = `Size is required for variant ${
          index + 1
        }`;
      if (!variant.price || isNaN(variant.price) || variant.price <= 0)
        newErrors[
          `variant_price_${index}`
        ] = `Valid price required for variant ${index + 1}`;
      if (
        variant.discount === "" ||
        isNaN(variant.discount) ||
        Number(variant.discount) < 0 ||
        Number(variant.discount) > 100
      ) {
        newErrors[
          `variant_discount_${index}`
        ] = `Discount must be between 0–100% for variant ${index + 1}`;
      }
      if (!variant.stock || isNaN(variant.stock) || variant.stock < 0)
        newErrors[
          `variant_stock_${index}`
        ] = `Valid stock quantity required for variant ${index + 1}`;
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = document.querySelector(".text-red-500");
      if (firstErrorField)
        firstErrorField.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Extract arrays from variants
    const variantSizes = variants.map((v) => v.size.trim());
    const variantPrices = variants.map((v) => parseFloat(v.price) || 0);
    const variantStocks = variants.map((v) => parseInt(v.stock) || 0);
    const variantDiscounts = variants.map((v) => parseFloat(v.discount) || 0);

    // Build query parameters
    const query = new URLSearchParams();

    query.append("productCategoryId", formData.productCategoryId);
    query.append("name", formData.name);
    query.append("description", formData.description);
    query.append("packageingType", formData.packageingType);
    query.append("application", formData.application);
    query.append("style", formData.style);
    query.append("slife", formData.slife);
    query.append("discount", formData.discount || "0");
    query.append("stockAlertThreshold", formData.stockAlertThreshold);
    query.append("totalPrice", formData.totalPrice || "0");
    query.append("stock", formData.stock);

    // Append variants correctly
    variantSizes.forEach((v) => query.append("variantSizes", v));
    variantPrices.forEach((v) => query.append("variantPrices", v));
    variantStocks.forEach((v) => query.append("variantStocks", v));
    variantDiscounts.forEach((v) => query.append("variantDiscounts", v));

    // Combine all images
    const payload = new FormData();
    if (mainImage) payload.append("images", mainImage);
    secondaryFiles.forEach((file) => payload.append("images", file));

    try {
      let res;

      if (product?.id) {
        // ✅ UPDATE existing product
        res = await Api.put(
          `product/update/${product.id}?${query.toString()}`,
          payload,
          {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }
        );
      } else {
        // ✅ ADD new product
        res = await Api.post(`product/add?${query.toString()}`, payload, {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        });
      }

      if (res.status === 200 || res.status === 201) {
        mySwal.fire({
          title: "Success!",
          text: "Product created successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        onSuccess?.();
        onClose?.();
      }
    } catch (err) {
      console.error("Error saving product:", err);
      mySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error saving product.",
      });
    }
  };

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
    setSecondaryFiles((prev) => prev.filter((_, idx) => idx !== i));
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

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 mt-4 rounded-lg overflow-auto"
      >
        <div className="">
          <div className="flex justify-between">
            {/* Product Name */}
            <div className="col-span-2 w-[679px]">
              <div>
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
              </div>
            </div>
            <div className="mr-6">
              <label className="font-normal text-sm text-[#050710]">
                Product Images & Videos
              </label>

              {/* Main image/video uploader */}
              <div
                className="relative w-[330px] py-10 mt-2 border border-dashed border-[#C3C3C3] rounded-md cursor-pointer flex flex-col items-center justify-center bg-white text-center"
                onClick={() => document.getElementById("mainUpload").click()}
              >
                {mainImage ? (
                  // ✅ Handle both File and URL types
                  typeof mainImage === "string" ? (
                    mainImage.endsWith(".mp4") ||
                    mainImage.endsWith(".mov") ||
                    mainImage.endsWith(".webm") ? (
                      <video
                        src={mainImage}
                        controls
                        className="w-full h-[152px] object-cover rounded-md"
                      />
                    ) : (
                      <img
                        src={mainImage}
                        alt="Main"
                        className="w-full h-[152px] object-cover rounded-md"
                      />
                    )
                  ) : mainImage.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(mainImage)}
                      alt="Main"
                      className="w-full h-[152px] object-cover rounded-md"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(mainImage)}
                      controls
                      className="w-full h-[152px] object-cover rounded-md"
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
                {secondaryFiles.map((file, index) => {
                  const isFile = typeof file !== "string";
                  const src = isFile ? URL.createObjectURL(file) : file;
                  const isVideo =
                    (isFile && file.type?.startsWith("video/")) ||
                    (typeof file === "string" &&
                      (file.endsWith(".mp4") ||
                        file.endsWith(".mov") ||
                        file.endsWith(".webm")));

                  return (
                    <div
                      key={index}
                      className="relative w-14 h-14 border border-dashed border-[#C3C3C3] rounded-md overflow-hidden"
                    >
                      {isVideo ? (
                        <video
                          src={src}
                          className="object-cover w-full h-full"
                          controls
                        />
                      ) : (
                        <img
                          src={src}
                          alt="secondary"
                          className="object-cover w-full h-full"
                        />
                      )}
                      <button
                        onClick={() => removeSecondary(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 opacity-80 hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}

                {/* Empty slots for remaining uploads */}
                {Array.from({ length: 4 - secondaryFiles.length }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="w-14 h-14 border border-dashed border-[#C3C3C3] rounded-md flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        document.getElementById("secondaryUpload").click()
                      }
                    >
                      <img src={add} alt="add" className="w-5 h-5 opacity-60" />
                    </div>
                  )
                )}
              </div>

              <input
                id="secondaryUpload"
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleSecondaryChange}
              />

              {isSubmitted && errors.imageFiles && (
                <p className="text-red-500 text-xs mt-2 text-center">
                  {errors.imageFiles}
                </p>
              )}
            </div>
          </div>

          {/* Product ID - disabled */}

          {/* Price Section */}
          <h1 className="font-normal text-sm text-[#050710] leading-4 mt-4">
            Varients
          </h1>
          <div className="border mt-2 rounded-lg px-6 pb-6">
            {variants.map((variant, i) => (
              <div key={i}>
                <div className="flex gap-4 mt-6">
                  <div className="w-full sm:w-[22%]">
                    <label className="text-sm text-[#050710]">Size</label>
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) =>
                        handleVariantChange(i, "size", e.target.value)
                      }
                      placeholder="Quantity"
                      className="w-full rounded-lg p-4 border mt-2 h-12 placeholder:text-[14px]"
                    />
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`variant_size_${i}`]}
                    </p>
                  </div>
                  <div className="w-full sm:w-[22%]">
                    <label className="text-sm text-[#050710]">Price</label>
                    <div className="relative">
                      <span className="absolute left-0 top-0 m-[3px] mt-[11px]  flex items-center justify-center bg-[#F9F9FB] text-[#696A70] text-sm px-[13px] rounded-l border h-[42px]">
                        INR
                      </span>
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(i, "price", e.target.value)
                        }
                        placeholder="120.00"
                        className="w-full rounded-lg p-4 border mt-2 h-12  pl-[69px]  placeholder:text-[14px]"
                      />
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`variant_price_${i}`]}
                      </p>
                    </div>
                  </div>
                  <div className="w-full sm:w-[22%]">
                    <label className="text-sm text-[#050710]">
                      Discounted Percentage
                    </label>

                    <input
                      type="number"
                      max={100}
                      min={0}
                      value={variant.discount}
                      onChange={(e) =>
                        handleVariantChange(i, "discount", e.target.value)
                      }
                      placeholder="Enter % value"
                      className="w-full rounded-lg p-4 border mt-2 h-12  placeholder:text-[14px]"
                    />
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`variant_discount_${i}`]}
                    </p>
                  </div>
                  <div className="w-full sm:w-[22%]">
                    <label className="text-sm text-[#050710]">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        handleVariantChange(i, "stock", e.target.value)
                      }
                      placeholder="Stock Quantity"
                      className="w-full rounded-lg p-4 border mt-2 h-12 placeholder:text-[14px]"
                    />
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`variant_stock_${i}`]}
                    </p>
                  </div>
                  <div className="w-full sm:w-[22%]">
                    <label className="text-sm text-[#050710]">
                      Stock Threshold
                    </label>
                    <input
                      type="number"
                      defaultValue={10}
                      disabled
                      className="w-full rounded-lg p-4 border mt-2 h-12 placeholder:text-[14px]"
                    />
                  </div>
                </div>

                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="mt-3 text-red-500 text-xs underline"
                  >
                    Remove this variant
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="flex bg-[#BF6A02] hover:bg-[#965B13] mt-4 duration-300 py-[14px] w-[198px] ms-auto items-center justify-center rounded-lg text-white text-sm font-normal"
            >
              <img src={addIco} className="mr-2 w-4 h-4" alt="" />
              Add New Variant
            </button>
          </div>

          {/* Details Section */}
          <div className="w-[679px]">
            <h1 className="font-normal text-sm text-[#050710] leading-4 mt-4">
              Product Details
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
                    value={product?.packageingType || formData.packageingType}
                    onChange={handleChange}
                    className="w-full rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                  />
                  {isSubmitted && errors.packageingType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.packageingType}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Application
                  </label>
                  <input
                    type="text"
                    name="application"
                    placeholder="Application"
                    value={product?.application || formData.application}
                    onChange={handleChange}
                    className="w-full rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                  />
                  {isSubmitted && errors.application && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.application}
                    </p>
                  )}
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
                    value={product?.slife || formData.slife}
                    onChange={handleChange}
                    className="w-full rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                  />
                  {isSubmitted && errors.slife && (
                    <p className="text-red-500 text-xs mt-1">{errors.slife}</p>
                  )}
                </div>

                <div className="w-full">
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Style
                  </label>
                  <input
                    type="text"
                    name="style"
                    placeholder="Style"
                    value={product?.style || formData.style}
                    onChange={handleChange}
                    className="w-full rounded-lg p-4 font-normal text-sm border  focus:outline-[#363636] border-[#C3C3C3] bg-white mt-2 h-12"
                  />
                  {isSubmitted && errors.style && (
                    <p className="text-red-500 text-xs mt-1">{errors.style}</p>
                  )}
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
          </div>
        </div>
        {/* Upload Files */}

        {/* Main Upload Box */}
      </form>
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
