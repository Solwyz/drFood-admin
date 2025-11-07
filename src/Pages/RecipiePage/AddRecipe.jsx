import React, { useState } from "react";
import arrowRight from "@assets/layouts/arrow_right.svg";
import SaveIcon from "@assets/products/save.svg";
import addIco from "@assets/products/Add.svg";
import cancel from "@assets/layouts/cancelTag.svg";
import img from "@assets/layouts/image.svg";
import upload from "@assets/layouts/upload.svg";

const AddRecipe = () => {
  const [showImageModal, setImageModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [tags, setTags] = useState([""]);
  const [ingredients, setIngredients] = useState([""]);

  const handleAddTag = (e) => {
    e.preventDefault();
    setTags([...tags, ""]);
  };

  const handleRemoveTag = (e) => {
    e.preventDefault();
    if (tags.length > 1) setTags(tags.slice(0, -1));
  };

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      tags,
      ingredients,
    });
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
          <button className="flex bg-[#BF6A02] hover:bg-[#965B13] duration-300 h-10 items-center rounded-lg text-white text-sm font-normal px-4">
            <img src={SaveIcon} className="mr-2 w-4 h-4" alt="" />
            Save
          </button>
        </div>
      </div>
      <div className="bg-white min-h-[665px] p-4 mt-4 rounded-t-lg">
        <form className="flex justify-between">
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

            {/* Difficulty + Time */}
            <div className="flex gap-4">
              <div className="w-full mt-4">
                <label className="font-normal text-sm text-[#050710] leading-4">
                  Difficulty
                </label>
                <input
                  type="text"
                  name="difficulty"
                  placeholder="Easy, Medium, Hard"
                  className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12 placeholder:text-[#9C9C9C]"
                />
              </div>
              <div className="w-full mt-4">
                <label className="font-normal text-sm text-[#050710] leading-4">
                  Estimated Time
                </label>
                <input
                  type="text"
                  name="time"
                  placeholder="20 mins"
                  className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12 placeholder:text-[#9C9C9C]"
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
                className="w-full rounded-lg p-4 resize-none font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-[200px] placeholder:text-[#9C9C9C]"
              />
            </div>

            {/* Tags */}
            <p className="text-[14px] leading-5 mt-4">Tags</p>
            <div className="w-full border border-[#C3C3C3] p-8 mt-2 rounded-[8px]">
              {tags.map((tag, index) => (
                <div className="w-full mt-4 first:mt-0" key={index}>
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Tag {index + 1}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Tag"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12 placeholder:text-[#9C9C9C]"
                  />
                </div>
              ))}
              <div className="flex gap-4 mt-8">
                <button
                  className="flex w-full justify-center bg-[#BF6A02] hover:bg-[#965B13] duration-300 h-12 items-center rounded-lg text-white text-sm font-light py-4"
                  onClick={handleAddTag}
                >
                  <img src={addIco} className="mr-2 w-4 h-4" alt="" />
                  Add New Tag
                </button>
                <button
                  className="flex w-full justify-center border border-[#BF6A02] text-[#BF6A02] duration-300 h-12 items-center rounded-lg text-sm font-light py-4"
                  onClick={handleRemoveTag}
                >
                  <img src={cancel} className="mr-2 w-4 h-4" alt="" />
                  Remove Tag
                </button>
              </div>
            </div>

            {/* Ingredients */}
            <p className="text-[14px] leading-5 mt-4">Ingredients</p>
            <div className="w-full border border-[#C3C3C3] p-8 mt-2 rounded-[8px]">
              {ingredients.map((ing, index) => (
                <div className="w-full mt-4 first:mt-0" key={index}>
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
                    className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12 placeholder:text-[#9C9C9C]"
                  />
                </div>
              ))}
              <div className="flex gap-4 mt-8">
                <button
                  className="flex w-full justify-center bg-[#BF6A02] hover:bg-[#965B13] duration-300 h-12 items-center rounded-lg text-white text-sm font-light py-4"
                  onClick={handleAddIngredient}
                >
                  <img src={addIco} className="mr-2 w-4 h-4" alt="" />
                  Add New Ingredient
                </button>
                <button
                  className="flex w-full justify-center border border-[#BF6A02] text-[#BF6A02] duration-300 h-12 items-center rounded-lg text-sm font-light py-4"
                  onClick={handleRemoveIngredient}
                >
                  <img src={cancel} className="mr-2 w-4 h-4" alt="" />
                  Remove Ingredient
                </button>
              </div>
            </div>
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
                    name="difficulty"
                    placeholder="Enter Caloires"
                    className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12 placeholder:text-[#9C9C9C] placeholder:font-light"
                  />
                </div>
                <div className="w-full">
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Protein
                  </label>
                  <input
                    type="text"
                    name="difficulty"
                    placeholder="Enter Protein"
                    className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12 placeholder:text-[#9C9C9C] placeholder:font-light"
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
                    name="difficulty"
                    placeholder="Enter fat"
                    className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12 placeholder:text-[#9C9C9C] placeholder:font-light"
                  />
                </div>
                <div className="w-full">
                  <label className="font-normal text-sm text-[#050710] leading-4">
                    Carbohytrates
                  </label>
                  <input
                    type="text"
                    name="difficulty"
                    placeholder="Enter carbohytrates"
                    className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12 placeholder:text-[#9C9C9C] placeholder:font-light"
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
                    name="difficulty"
                    placeholder="Enter fiber"
                    className="w-full rounded-lg p-4 font-normal text-sm border focus:outline-[#363636] border-[#C3C3C3] bg-white mt-1 h-12 placeholder:text-[#9C9C9C] placeholder:font-light"
                  />
                </div>
                <div className="w-full"></div>
              </div>
            </div>
          </div>
          <div>
            <div className="w-[368px] h-[238px] bg-[#EEEEEE]"></div>
            <p
              onClick={() => setImageModal(true)}
              className="text-center text-[#0539BC] text-[12px] font-light leading-4 mt-6"
            >
              Change Photo
            </p>
          </div>
        </form>
      </div>
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[600px] p-6 relative shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-[#050710]">
              Add Product Image
            </h2>

            {/* Drop zone */}
            <div
              className="border flex justify-between items-center border-dashed border-[#C3C3C3] rounded-md px-4 py-[9px] text-center cursor-pointer hover:border-[#BF6A02] transition"
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

            {/* File previews */}
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
                className=" px-[25px] py-[11px] text-sm border rounded mr-2"
                onClick={() => setImageModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#BF6A02] flex items-center gap-2 text-white px-[25px] py-[11px] rounded hover:bg-[#a55a00]"
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
                    setImageModal(false);
                    setUploadFiles([]);
                    setProgress({});
                  }, 1600);
                }}
              >
                <img className="w-4 h-4" src={upload} alt="" />
                <p className="text-[14px] font-light">Upload</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRecipe;
