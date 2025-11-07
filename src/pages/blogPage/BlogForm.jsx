import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import TiptapEditor from "./TipTapEditor";
import Api from "../../services/Api";
import Swal from "sweetalert2";
import arrowRight from "@assets/layouts/arrow_right.svg";
import SaveIcon from "@assets/products/save.svg";

function BlogForm() {
  const navigate = useNavigate();
  const { blogId } = useParams();

  const [blogForm, setBlogForm] = useState({
    name: "",
    shortDescription: "",
    image: null,
    mainDescription: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [blogData, setBlogData] = useState(null);
  const [errors, setErrors] = useState({});

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error when typing
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlogForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // ✅ Validation logic
  const validateForm = () => {
    let newErrors = {};

    if (!blogForm.name.trim()) newErrors.name = "Title is required";
    if (!blogForm.shortDescription.trim())
      newErrors.shortDescription = "Short Description is required";
    if (!blogForm.mainDescription.trim())
      newErrors.mainDescription = "Main Description is required";
    if (!blogId && !blogForm.image) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // inside handleSave
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("name", blogForm.name);
      formData.append("description", blogForm.mainDescription);
      formData.append("shortDescription", blogForm.shortDescription);
      if (blogForm.image) formData.append("image", blogForm.image);

      const res = await Api.post("blog/create", formData, {
        "Content-Type": "multipart/form-data",
      });

      if (res.status === 200 || res.status === 201) {
        // ✅ Show success alert
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Blog saved successfully!",
          confirmButtonColor: "#04A391",
        }).then(() => {
          navigate("/blogPage"); // redirect after alert
        });
      }
    } catch (err) {
      console.error("Blog save error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while saving the blog.",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Fetch blog data if editing
  useEffect(() => {
    if (blogId) {
      Api.get(`blog/${blogId}`).then((res) => {
        if (res?.status === 200) setBlogData(res.data);
      });
    }
  }, [blogId]);

  // Set form values on load
  useEffect(() => {
    if (blogData) {
      setBlogForm({
        name: blogData.title || "",
        shortDescription: blogData.shortDescription || "",
        image: null,
        mainDescription: blogData.paragraphs || "",
      });
      setPreviewImage(blogData.image || null);
    }
  }, [blogData]);
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex">
          <Link to="/blogs">
            <h1 className="text-4 leading-[22px] font-light text-[#717171]">
              Blogs
            </h1>
          </Link>
          <img src={arrowRight} alt="" />
          <h1 className="text-4 leading-[22px] font-light ">Breakfast</h1>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex bg-[#BF6A02] hover:bg-[#965B13] duration-300 h-10 items-center rounded-lg text-white text-sm font-normal px-4"
          >
            <img src={SaveIcon} className="mr-2 w-4 h-4" alt="" />
            Save
          </button>
        </div>
      </div>

      {/* Form */}
      <form className="bg-white min-h-[665px] p-4 mt-4 rounded-t-lg">
        <div className="flex  justify-between">
          <div className="w-[679px]">
            {/* Title */}
            <div className="col-span-2">
              <label className="font-normal text-sm text-[#050710] leading-4">
                Title
              </label>
              <input
                type="text"
                name="name"
                className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12"
              />
            </div>

            {/* Short Description */}
            <label className="block text-sm font-normal mt-4">Paragraph</label>
            <textarea
              name="shortDescription"
              value={blogForm.shortDescription}
              onChange={handleInputChange}
              className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-[220px]"
              placeholder="Enter text"
            ></textarea>
            <div className="flex justify-between">
              <div className="">
                {errors.shortDescription && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.shortDescription}
                  </p>
                )}
              </div>
              <p className="text-[14px] text-[#122E65] underline font-normal">
                Add New Paragraph
              </p>
            </div>
          </div>

          {/* Image upload */}
          <div className="mt-4">
            <div className="flex flex-col items-center w-fit">
              {previewImage ? (
                <img
                  src={previewImage}
                  className={`mb-2 w-[285px] h-[231px] object-cover rounded-lg border ${
                    errors.image ? "border-red-500" : "border-gray-200"
                  }`}
                  alt="Preview"
                />
              ) : (
                <div
                  className={`mb-2 px-[160px] py-[95px] border border-dashed rounded-lg bg-[#F5F5F5] text-gray-400 ${
                    errors.image ? "border-red-500" : "border-[#E8E8E8]"
                  }`}
                >
                  {/* <img src={uploadIcon} alt="Upload Icon" /> */}
                </div>
              )}
              <label
                htmlFor="photo-upload"
                className="text-[#0539BC] text-[12px] font-normal cursor-pointer mt-3"
              >
                Add photo (max size 2Mb)
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <p className="text-[16] font-normal text-[#BF6A02]">Section 1</p>
          <label className="font-normal text-sm text-[#050710] leading-4 mt-2">
            Heading 1
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter title"
            className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12 placeholder:text-[#9C9C9C]"
          />
        </div>

        {/* Short Description */}
        <label className="block text-sm font-normal mt-4">Paragraph</label>
        <textarea
          name="shortDescription"
          value={blogForm.shortDescription}
          onChange={handleInputChange}
          className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-[220px]"
          placeholder="Enter text"
        ></textarea>
        <div className="flex justify-between">
          <div className="">
            {errors.shortDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.shortDescription}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <p className="text-[14px] text-[#126538] underline font-normal">
              Add New Section
            </p>
            <p className="text-[14px] text-[#122E65] underline font-normal">
              Add New Paragraph
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BlogForm;
