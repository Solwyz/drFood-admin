import React, { useEffect, useState } from "react";
import addIco from "@assets/products/Add.svg";
import eyeBlue from "@assets/products/blueEye.svg";
import eyeIco from "@assets/products/blackEye.svg";
import deletIco from "@assets/products/delete.svg";
import deleteHover from "@assets/products/deleteHover.svg";
import editIco from "@assets/products/edit.svg";
import editHover from "@assets/products/editHover.svg";
import close from "@assets/products/close.svg";
import Api from "../../Services/Api";
import searchIcon from "@assets/layouts/search.svg";
import arrowRight from "@assets/layouts/arrow_right.svg";
import AddRecipe from "./AddRecipe";

function Recipe() {
  const [recipe, setRecipe] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchRecipe();
  }, [search, filter]);

  const fetchRecipe = () => {
    Api.get("recipie/all").then((response) => {
      if (response && response.status === 200) {
        console.log("recipes", response);
        setRecipe(response.data.data);
      } else {
        console.error("Failed to fetch recipe", response);
      }
    });
  };
  if (showForm) {
    return <AddRecipe />;
  }

  // ✅ Add new recipie
  const handleAddRecipe = (e) => {
    e.preventDefault();

    if (!newRecipe.trim()) {
      setError("Recipie name cannot be empty");
      return;
    } else {
      setError("");
    }

    const formData = new FormData();
    if (recipeImage) {
      formData.append("image", recipeImage);
    }

    console.log("Form Data:", formData);
  };

  // ✅ Update existing recipie
  const handleUpdateRecipe = (e) => {
    e.preventDefault();

    if (!newRecipe.trim()) {
      setError("Recipe name cannot be empty");
      return;
    } else {
      setError("");
    }

    // 🔹 Use FormData again for updates
    const formData = new FormData();
    // formData.append("name", newRecipe);
    if (recipeImage) {
      formData.append("image", recipeImage);
    }
  };

  // ✅ Delete recipe
  const handleDeleteRecipe = () => {
    if (!deleteId) return;
    Api.delete(`recipe/${deleteId}`)
      .then((response) => {
        if (response && response.status === 200) {
          setShowDeleteModal(false);
          setDeleteId(null);
          fetchRecipe();
        } else {
          console.error("Failed to delete recipe", response);
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  // ✅ Open modal for adding
  const openAddForm = () => {
    setIsEditing(false);
    setNewRecipe("");
    setError("");
    setShowForm(true);
  };

  // ✅ Open modal for editing
  const openEditForm = (cat) => {
    setIsEditing(true);
    setEditId(cat.id);
    setNewRecipe(cat.name);
    setError("");
    setShowForm(true);
  };

  // ✅ Close modal
  const closeForm = () => {
    setShowForm(false);
    setNewRecipe("");
    setError("");
    setIsEditing(false);
    setEditId(null);
  };

  // ✅ Open delete modal
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex">
          <h1 className="text-4 leading-[22px] font-light text-[#717171]">
            Recipe
          </h1>
          <img src={arrowRight} alt="" />
          <h1 className="text-4 leading-[22px] font-light ">Breakfast</h1>
        </div>
        <div className="flex gap-4">
          <button
            className="flex bg-[#BF6A02] hover:bg-[#965B13] duration-300 h-10 items-center rounded-lg text-white text-sm font-light px-4"
            onClick={() => {
              setShowForm(true);
            }}
          >
            <img src={addIco} className="mr-2 w-4 h-4" alt="" />
            Add new Receipe
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-[361px] p-4 rounded-lg ">
            <img src={deleteWarning} className="w-12 h-12" alt="" />
            <p className="mt-4 text-[#030300] text-sm leading-4 font-medium">
              Confirm delete item?
            </p>
            <p className="mt-2 text-[#818180] text-sm font-light leading-5">
              {" "}
              Are you sure you want to delete the category ? <br />
              This action cannot be undone.
            </p>
            <div className="flex mt-8 gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="border-[#D5D5D5] hover:border-[#050505] duration-300 border w-full text-base font-light px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="bg-[#DA1818] hover:bg-[#DE5555] duration-300 text-white w-full text-base font-light px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Table */}

      <div className="bg-white min-h-[665px] p-4 mt-4">
        <div className="grid grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <div className="p-4 bg-[#F8F8F8]">
              <img className="w-full h-[146px]" src={searchIcon} alt="" />
              <p className="mt-2 text-[12px] font-light text-[#929292]">
                25/05/2025
              </p>
              <p className="mt-2 text-[14px] leading-5 font-light text-black">
                A healthy smile Lorem impsum A healthy smile Lorem impsum
              </p>
              <div className="flex gap-4">
                <button className="border border-[#B3B3B3] rounded-[8px] w-full py-2 mt-4">
                  <p className="text-black text-[14px] font-light leading-5">
                    View
                  </p>
                </button>
                <button className="bg-[#ED1C24] rounded-[8px] w-full py-2 mt-4">
                  <p className="text-white text-[14px] font-light leading-5">
                    Delete
                  </p>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recipe;
