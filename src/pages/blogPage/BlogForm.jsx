import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../../services/Api";
import Swal from "sweetalert2";
import arrowRight from "@assets/layouts/arrow_right.svg";
import SaveIcon from "@assets/products/save.svg";

function BlogForm({ blogId }) {
  const navigate = useNavigate();

  const [blogForm, setBlogForm] = useState({
    name: "",
    image: null,
    paragraph: "",
    sections: [
      { heading: "", paragraph: "" } // Section 1 default
    ],
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [blogData, setBlogData] = useState(null);
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  // ✅ Handle form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Handle section inputs
  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...blogForm.sections];
    updatedSections[index][field] = value;
    setBlogForm((prev) => ({ ...prev, sections: updatedSections }));
  };

  // ✅ Add new section dynamically
  const handleAddSection = () => {
    const newSectionNumber = blogForm.sections.length + 1;
    const newSection = {
      heading: "",
      paragraph: "",
    };
    setBlogForm((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  // ✅ Handle image upload
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

  // ✅ Validation
  const validateForm = () => {
    let newErrors = {};
    if (!blogForm.name.trim()) newErrors.name = "Title is required";
    if (!blogForm.paragraph.trim()) newErrors.paragraph = "Main Description is required";

    blogForm.sections.forEach((sec, idx) => {
      if (!sec.paragraph.trim()) {
        newErrors[`section_${idx}_paragraph`] = `Section ${idx + 1} paragraph is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Save blog
  // const handleSave = async () => {
  //   if (!validateForm()) return;

  //   try {
  //     const formData = new FormData();
  //     formData.append("name", blogForm.name);
  //     formData.append("paragraph", blogForm.paragraph);
  //     formData.append("sections", JSON.stringify(blogForm.sections));
  //     if (blogForm.image) formData.append("image", blogForm.image);

  //     console.log("Saving blog form:", blogForm);

  //     const queryParams = new URLSearchParams();

  //     queryParams.append("name", blogForm.name);
  //     queryParams.append("paragraphs", blogForm.paragraph);
  //     queryParams.append("sections", blogForm.sections);

  //     // Example save call (uncomment when API is ready)
  //     const res = await Api.post(`blog/create?${queryParams.toString()}`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (res.status === 200 || res.status === 201) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success",
  //         text: "Blog saved successfully!",
  //         confirmButtonColor: "#04A391",
  //       }).then(() => {
  //         navigate("/blogPage");
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Blog save error:", err);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Something went wrong while saving the blog.",
  //       confirmButtonColor: "#d33",
  //     });
  //   }
  // };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      // Build the query params
      const queryParams = new URLSearchParams();

      // Append base fields
      queryParams.append("name", blogForm.name);

      // Append main paragraph(s)
      queryParams.append("paragraphs", blogForm.paragraph);

      // Append each section’s heading and paragraph
      if (blogForm.sections && blogForm.sections.length > 0) {
        blogForm.sections.forEach((sec) => {
          if (sec.heading) queryParams.append("sectionHeadings", sec.heading);
          if (sec.paragraph) queryParams.append("sectionParagraphs", sec.paragraph);
        });
      }

      // Prepare FormData (for image only)
      const formData = new FormData();
      if (blogForm.image) formData.append("imageFile", blogForm.image);

      console.log('tknn',token)
      console.log("Saving blog form:", blogForm);
      console.log("Final API URL:", `blog/create?${queryParams.toString()}`);

      // ✅ API POST request
      const res = await Api.post(`blog/create?${queryParams.toString()}`, formData, {
        
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
       
      });

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Blog saved successfully!",
          confirmButtonColor: "#04A391",
        }).then(() => navigate("/blogs"));
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


  // ✅ Fetch blog data if editing
  useEffect(() => {
    if (blogId) {
      Api.get(`blog/${blogId}`).then((res) => {
        if (res?.status === 200) {
          const blog = res.data.data.blog;
          setBlogData(blog);
        }
      });
    }
  }, [blogId]);

  // ✅ Set form values on load
  useEffect(() => {
    if (blogData) {
      setBlogForm({
        name: blogData.name || "",
        image: null,
        paragraph: blogData.description || "",
        sections: blogData.sections || [{ heading: "Heading 1", paragraph: "" }],
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
          <h1 className="text-4 leading-[22px] font-light ">
            {blogId ? "Edit Blog" : "New Blog"}
          </h1>
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
        <div className="flex justify-between">
          <div className="w-[679px]">
            {/* Title */}
            <div className="col-span-2">
              <label className="font-normal text-sm text-[#050710] leading-4">
                Title
              </label>
              <input
                type="text"
                name="name"
                value={blogForm.name}
                onChange={handleInputChange}
                className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12"
              />
            </div>

            {/* Main Paragraph */}
            <label className="block text-sm font-normal mt-4">Paragraph</label>
            <textarea
              name="paragraph"
              value={blogForm.paragraph}
              onChange={handleInputChange}
              className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-[220px]"
              placeholder="Enter text"
            ></textarea>
            <div className="flex justify-between">
              <div>
                {errors.paragraph && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.paragraph}
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
                  className={`mb-2 w-[285px] h-[231px] object-cover rounded-lg border ${errors.image ? "border-red-500" : "border-gray-200"
                    }`}
                  alt="Preview"
                />
              ) : (
                <div
                  className={`mb-2 px-[160px] py-[95px] border border-dashed rounded-lg bg-[#F5F5F5] text-gray-400 ${errors.image ? "border-red-500" : "border-[#E8E8E8]"
                    }`}
                ></div>
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

        {/* Dynamic Sections */}
        {blogForm.sections.map((section, index) => (
          <div key={index} className="mt-8">
            <p className="text-[16px] font-normal text-[#BF6A02]">
              Section {index + 1}
            </p>

            <label className="font-normal text-sm text-[#050710] leading-4 mt-2">
              Heading {index + 1}
            </label>
            <input
              type="text"
              value={section.heading}
              onChange={(e) =>
                handleSectionChange(index, "heading", e.target.value)
              }
              placeholder="Enter title"
              className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12 placeholder:text-[#9C9C9C]"
            />

            <label className="block text-sm font-normal mt-4">
              Paragraph {index + 1}
            </label>
            <textarea
              value={section.paragraph}
              onChange={(e) =>
                handleSectionChange(index, "paragraph", e.target.value)
              }
              className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-[220px]"
              placeholder="Enter text"
            ></textarea>

            {errors[`section_${index}_paragraph`] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[`section_${index}_paragraph`]}
              </p>
            )}
          </div>
        ))}

        {/* Add Section Button */}
        <div className="flex justify-end mt-4">
          <p
            onClick={handleAddSection}
            className="text-[14px] text-[#126538] underline font-normal cursor-pointer"
          >
            + Add New Section
          </p>
        </div>
      </form>
    </div>
  );
}

export default BlogForm;
