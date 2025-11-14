"use client";
import React, { useState } from "react";
import arrowRight from "@assets/layouts/arrow_right.svg";
import SaveIcon from "@assets/products/save.svg";
import addIco from "@assets/products/Add.svg";
import cancel from "@assets/layouts/cancelTag.svg";
import arrowDown from "@assets/layouts/downArrow.svg";

import img from "@assets/layouts/image.svg";
import addIcon from "@assets/layouts/cancelTag.svg";

import upload from "@assets/layouts/upload.svg";
import Api from "../../Services/Api";
import { toast } from "react-toastify";

const AddRecipe = () => {
  const [showImageModal, setImageModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [mainImage, setMainImage] = useState(null);
  const [tags, setTags] = useState(["", "", "", ""]);
  const [seoTags, setSeoTags] = useState(["", "", "", ""]);
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([{ title: "", instructions: [""] }]);

  const [formData, setFormData] = useState({
    title: "",
    difficulty: "",
    estimatedTime: "",
    description: "",
    calories: "",
    protein: "",
    fats: "",
    carbohydrates: "",
    fiber: "",
  });

  // ✅ Update form fields
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // // ✅ Dynamic Tag Handlers
  // const handleAddTag = (e) => {
  //   e.preventDefault();
  //   setTags([...tags, ""]);
  // };

  // const handleRemoveTag = (e) => {
  //   e.preventDefault();
  //   if (tags.length > 1) setTags(tags.slice(0, -1));
  // };

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const handleSeoTagChange = (index, value) => {
    const newTags = [...seoTags];
    newTags[index] = value;
    setSeoTags(newTags);
  };

  // ✅ Dynamic Ingredient Handlers
  const handleAddIngredient = (e) => {
    e.preventDefault();
    setIngredients([...ingredients, ""]);
  };

  const handleRemoveIngredient = (e) => {
    e.preventDefault();
    if (ingredients.length > 1) setIngredients(ingredients.slice(0, -1));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  // ✅ Submit Handler with API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.description.trim())
      return toast.error("Description is required");

    const token = localStorage.getItem("token");
    if (!token) return toast.error("No token found, please login again");

    try {
      const payload = new FormData();
      payload.append("RecipeCategoryId", 1); // hardcoded or dynamic
      payload.append("name", formData.title);
      payload.append("difficulty", formData.title);
      payload.append("time", formData.estimatedTime);
      payload.append("description", formData.description);

      // Join tags into a single string with spaces or commas if backend expects so
      // tags.forEach((tag, i) => {
      //   const formattedTag = tag.trim().startsWith("#")
      //     ? tag.trim()
      //     : `#${tag.trim()}`;
      //   payload.append(`tags[${i}]`, formattedTag);
      // });
      payload.append("tag", tags.join(" "));
      payload.append("tags", seoTags.join(" "));
      payload.append("steps", steps);
      // steps.forEach((step, stepIndex) => {
      //   payload.append(`steps[${stepIndex}][title]`, step.title);
      //   step.instructions.forEach((instruction, instrIndex) => {
      //     payload.append(
      //       `steps[${stepIndex}][instructions][${instrIndex}]`,
      //       instruction
      //     );
      //   });
      // });

      payload.append("calorie", formData.calories);
      payload.append("protein", formData.protein);
      payload.append("fat", formData.fats);
      payload.append("carbohydrate", formData.carbohydrates);
      payload.append("fibre", formData.fiber);

      // Ingredients array
      ingredients.forEach((item) => payload.append("ingredients", item));

      // You can also support steps later:
      // steps.forEach((step) => payload.append("steps", step));

      if (mainImage) payload.append("images", mainImage);

      const res = await Api.post(`recipe/add?RecipeCategoryId=1`, payload, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      });

      if (res.status === 200) {
        toast.success("Recipe added successfully!");
        setFormData({
          title: "",
          difficulty: "",
          estimatedTime: "",
          description: "",
          calories: "",
          protein: "",
          fats: "",
          carbohydrates: "",
          fiber: "",
        });
        setTags([""]);
        setIngredients([""]);
        setMainImage(null);
      } else {
        toast.error("Failed to add recipe");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while adding recipe");
    }
  };

  // ➕ Add a new step
  const handleAddStep = () => {
    setSteps([...steps, { title: "", instructions: [""] }]);
  };

  // 🗑️ Delete last step
  const handleDeleteLastStep = () => {
    if (steps.length > 1) setSteps(steps.slice(0, -1));
  };

  // ✏️ Update step title
  const handleStepTitleChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].title = value;
    setSteps(newSteps);
  };

  // ➕ Add instruction inside a step
  const handleAddInstruction = (stepIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].instructions.push("");
    setSteps(newSteps);
  };

  // ✏️ Update specific instruction
  const handleInstructionChange = (stepIndex, instrIndex, value) => {
    const newSteps = [...steps];
    newSteps[stepIndex].instructions[instrIndex] = value;
    setSteps(newSteps);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex">
          <h1 className="text-4 leading-[22px] font-light text-[#717171]">
            Recipe
          </h1>
          <img src={arrowRight} alt="" />
          <h1 className="text-4 leading-[22px] font-light text-[#717171]">
            Breakfast
          </h1>
          <img src={arrowRight} alt="" />
          <h1 className="text-4 leading-[22px] font-light ">Breakfast</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            type="button"
            className="flex bg-[#BF6A02] hover:bg-[#965B13] duration-300 h-10 items-center rounded-lg text-white text-sm font-normal px-4"
          >
            <img src={SaveIcon} className="mr-2 w-4 h-4" alt="" />
            Save
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white min-h-[665px] p-4 mt-4 rounded-t-lg">
        <form className="">
          <div className="flex justify-between">
            <div className="w-[679px]">
              {/* Title */}
              <div className="col-span-2">
                <label className="font-normal text-sm text-[#050710] leading-4">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12"
                />
              </div>

              {/* Difficulty + Time */}
              <div className="flex gap-4">
                <div className="w-[166px] mt-4 relative">
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Difficulty
                  </label>

                  <select
                    className="w-full appearance-none rounded-lg px-4 pr-10 text-[#2B2B2B] font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12"
                    name="difficulty"
                    onChange={handleInputChange}
                    value={formData.difficulty}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <img
                    className="w-6 h-6 absolute right-3 top-[68%] -translate-y-1/2 text-[#BF6A02] pointer-events-none"
                    src={arrowDown}
                    alt=""
                  />
                  {/* Custom dropdown arrow */}
                </div>

                <div className="w-[166px] mt-4">
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    name="estimatedTime"
                    value={formData.estimatedTime}
                    onChange={handleInputChange}
                    placeholder="20 mins"
                    className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="col-span-2 mt-4">
                <label className="font-normal text-sm text-[#050710] leading-4">
                  Description
                </label>
                <textarea
                  placeholder="Enter Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full rounded-lg p-4 resize-none font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-[200px]"
                />
              </div>

              {/* Tags */}
              <p className="text-[14px] leading-5 mt-4">Tags</p>
              <div className="w-full flex gap-4 border border-[#C3C3C3] p-8 mt-2 rounded-[8px]">
                {tags.map((tag, index) => (
                  <div key={index} className="w-full first:mt-0">
                    <label className="font-normal text-sm text-[#050710] leading-4">
                      Tag {index + 1}
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Tag"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12"
                    />
                  </div>
                ))}
              </div>

              {/* Ingredients */}
              <p className="text-[14px] leading-5 mt-4">Ingredients</p>
              <div className="w-full border border-[#C3C3C3] p-8 mt-2 rounded-[8px]">
                <div className="grid grid-cols-2 gap-4">
                  {ingredients.map((ing, index) => (
                    <div key={index} className="w-full first:mt-0">
                      <label className="font-normal text-sm text-[#050710] leading-4">
                        Ingredient {index + 1}
                      </label>
                      <input
                        type="text"
                        placeholder="Enter ingredient"
                        value={ing}
                        onChange={(e) =>
                          handleIngredientChange(index, e.target.value)
                        }
                        className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleAddIngredient}
                    className="flex w-full justify-center bg-[#BF6A02] hover:bg-[#965B13] duration-300 h-12 items-center rounded-lg text-white text-sm font-light py-4"
                  >
                    <img src={addIco} className="mr-2 w-4 h-4" alt="" />
                    Add New Ingredient
                  </button>
                  <button
                    onClick={handleRemoveIngredient}
                    className="flex w-full justify-center border border-[#BF6A02] text-[#BF6A02] h-12 items-center rounded-lg text-sm font-light py-4"
                  >
                    <img src={cancel} className="mr-2 w-4 h-4" alt="" />
                    Remove Ingredient
                  </button>
                </div>
              </div>

              {/* Nutritional Information */}
              <p className="text-[14px] leading-5 mt-4">
                Nutritional Information
              </p>
              <div className="w-full border border-[#C3C3C3] p-8 mt-2 rounded-[8px]">
                <div className="flex gap-4">
                  <div className="w-full">
                    <label className="font-normal text-sm text-[#050710] leading-4">
                      Total Calories
                    </label>
                    <input
                      type="text"
                      name="calories"
                      value={formData.calories}
                      onChange={handleInputChange}
                      placeholder="Enter Calories"
                      className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12"
                    />
                  </div>
                  <div className="w-full">
                    <label className="font-normal text-sm text-[#050710] leading-4">
                      Protein
                    </label>
                    <input
                      type="text"
                      name="protein"
                      value={formData.protein}
                      onChange={handleInputChange}
                      placeholder="Enter Protein"
                      className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <div className="w-full">
                    <label className="font-normal text-sm text-[#050710] leading-4">
                      Fats
                    </label>
                    <input
                      type="text"
                      name="fats"
                      value={formData.fats}
                      onChange={handleInputChange}
                      placeholder="Enter Fats"
                      className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12"
                    />
                  </div>
                  <div className="w-full">
                    <label className="font-normal text-sm text-[#050710] leading-4">
                      Carbohydrates
                    </label>
                    <input
                      type="text"
                      name="carbohydrates"
                      value={formData.carbohydrates}
                      onChange={handleInputChange}
                      placeholder="Enter Carbohydrates"
                      className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <div className="w-full">
                    <label className="font-normal text-sm text-[#050710] leading-4">
                      Fiber
                    </label>
                    <input
                      type="text"
                      name="fiber"
                      value={formData.fiber}
                      onChange={handleInputChange}
                      placeholder="Enter Fiber"
                      className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12"
                    />
                  </div>
                  <div className="w-full"></div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div>
              <div className="w-[368px] h-[238px] bg-[#EEEEEE] flex items-center justify-center overflow-hidden rounded-lg">
                {mainImage ? (
                  <img
                    src={URL.createObjectURL(mainImage)}
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <p className="text-sm text-gray-500">No image selected</p>
                )}
              </div>
              <p
                onClick={() => setImageModal(true)}
                className="text-center text-[#0539BC] text-[12px] font-light leading-4 mt-6 cursor-pointer"
              >
                Change Photo
              </p>
            </div>
          </div>
          <div className="w-full p-4 border border-[#C3C3C3] rounded-[8px] mt-[16px]">
            <div className="flex justify-between">
              <p className="text-[16px] font-regular mt-2 ps-2">
                Preparation Instructions
              </p>
              <div className="flex gap-4">
                <p
                  onClick={handleAddStep}
                  className="font-regular text-[14px] text-[#126538] underline cursor-pointer"
                >
                  Add New Step
                </p>
                <p
                  onClick={handleDeleteLastStep}
                  className="font-regular text-[14px] text-[#E00000] underline cursor-pointer"
                >
                  Delete Last Step
                </p>
              </div>
            </div>

            {/* Scrollable Steps */}
            <div className="mt-[22px] ps-2 gap-8 flex overflow-x-auto max-h-[600px]">
              {steps.map((step, stepIndex) => (
                <div key={stepIndex} className="min-w-[347px] max-w-[347px]">
                  <p className="font-light text-[14px]">Step {stepIndex + 1}</p>
                  <input
                    type="text"
                    placeholder="Step Title"
                    value={step.title}
                    onChange={(e) =>
                      handleStepTitleChange(stepIndex, e.target.value)
                    }
                    className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12"
                  />

                  {step.instructions.map((instruction, instrIndex) => (
                    <textarea
                      key={instrIndex}
                      placeholder={`Instruction ${instrIndex + 1}`}
                      value={instruction}
                      onChange={(e) =>
                        handleInstructionChange(
                          stepIndex,
                          instrIndex,
                          e.target.value
                        )
                      }
                      className="w-full mt-2 rounded-lg p-4 resize-none font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white h-[80px] placeholder:text-[12px]"
                    />
                  ))}

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddInstruction(stepIndex);
                    }}
                    className="w-full border border-[#BF6A02] mt-2 rounded-lg mb-10"
                  >
                    <div className="flex justify-center items-center gap-2 py-[14px]">
                      <img className="w-4 h-4 rotate-45" src={addIcon} alt="" />
                      <p className="text-[#BF6A02] text-[14px]">
                        Add Instruction
                      </p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="font-light text-[14px]">SEO Tags</p>
            <div className="mt-2 border flex gap-4 border-[#C3C3C3] p-8 w-[679px] rounded-lg">
              {seoTags.map((tag, index) => (
                <div key={index} className="w-full first:mt-0">
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Tag {index + 1}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Tag"
                    value={tag}
                    onChange={(e) => handleSeoTagChange(index, e.target.value)}
                    className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[600px] p-6 relative shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-[#050710]">
              Add Recipe Image
            </h2>

            {/* Drop zone */}
            <div
              className="border flex justify-between items-center border-dashed border-[#C3C3C3] rounded-md px-4 py-[9px] text-center cursor-pointer hover:border-[#BF6A02]"
              onClick={() => document.getElementById("uploadInput").click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files);
                setUploadFiles((prev) => [...prev, ...files]);
              }}
            >
              <div className="flex gap-4">
                <img className="w-5 h-5" src={img} alt="" />
                <p className="text-sm text-[#555]">Drag and drop files here </p>
              </div>
              <button className="bg-[#FCEFDF] px-5 py-[6px] rounded text-[#BF6A02] text-[12px] font-normal">
                Choose file
              </button>
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

            {/* Preview */}
            {uploadFiles.length > 0 && (
              <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
                {uploadFiles.map((file, i) => (
                  <div
                    key={i}
                    className="border rounded p-3 flex items-center gap-3"
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
                      <div className="w-full bg-gray-200 rounded h-1.5 mt-1">
                        <div
                          className="bg-[#BF6A02] h-1.5 rounded"
                          style={{ width: `${progress[file.name] || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setUploadFiles(uploadFiles.filter((_, j) => j !== i))
                      }
                      className="text-[#BF6A02] text-xs font-medium"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setImageModal(false)}
                className="px-4 py-2 border border-[#C3C3C3] rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (uploadFiles.length > 0) {
                    setMainImage(uploadFiles[0]);
                    setUploadFiles([]);
                    setImageModal(false);
                  }
                }}
                className="px-4 py-2 bg-[#BF6A02] text-white rounded-md text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRecipe;
