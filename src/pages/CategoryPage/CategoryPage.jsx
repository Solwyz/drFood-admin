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
import filterIcon from "@assets/layouts/filter_alt.svg";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [search, filter]);

  const fetchCategories = () => {
    Api.get("category/all").then((response) => {
      if (response && response.status === 200) {
        console.log("categories", response);
        setCategories(response.data.data);
      } else {
        console.error("Failed to fetch categories", response);
      }
    });
  };

  // ✅ Add new category
  const handleAddCategory = (e) => {
    e.preventDefault();

    if (!newCategory.trim()) {
      setError("Category name cannot be empty");
      return;
    } else {
      setError("");
    }

    const formData = new FormData();
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    console.log("Form Data:", formData);

    Api.post(`category/create?name=${newCategory}`, formData, {
      "Content-Type": "multipart/form-data",
    })
      .then((response) => {
        console.log("Response:", response);
        if (response && response.status === 200) {
          console.log("Category added", response);
          closeForm();
          fetchCategories();
        } else {
          console.error("Failed to add category", response);
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  // ✅ Update existing category
  const handleUpdateCategory = (e) => {
    e.preventDefault();

    if (!newCategory.trim()) {
      setError("Category name cannot be empty");
      return;
    } else {
      setError("");
    }

    // 🔹 Use FormData again for updates
    const formData = new FormData();
    // formData.append("name", newCategory);
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    Api.put(
      `category/update?categoryId=${editId}&name=${newCategory}`,
      formData,
      {
        "Content-Type": "multipart/form-data",
      }
    )
      .then((response) => {
        if (response && response.status === 200) {
          console.log("Category updated", response);
          closeForm();
          fetchCategories();
        } else {
          console.error("Failed to update category", response);
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  // ✅ Delete category
  const handleDeleteCategory = () => {
    if (!deleteId) return;
    Api.delete(`category/${deleteId}`)
      .then((response) => {
        if (response && response.status === 200) {
          setShowDeleteModal(false);
          setDeleteId(null);
          fetchCategories();
        } else {
          console.error("Failed to delete category", response);
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  // ✅ Open modal for adding
  const openAddForm = () => {
    setIsEditing(false);
    setNewCategory("");
    setError("");
    setShowForm(true);
  };

  // ✅ Open modal for editing
  const openEditForm = (cat) => {
    setIsEditing(true);
    setEditId(cat.id);
    setNewCategory(cat.name);
    setError("");
    setShowForm(true);
  };

  // ✅ Close modal
  const closeForm = () => {
    setShowForm(false);
    setNewCategory("");
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
        <h1 className="text-xl leading-6 font-regular">Product Management</h1>
        <div className="flex gap-4">
          <button
            className="flex bg-[#BF6A02] hover:bg-[#965B13] duration-300 h-10 items-center rounded-lg text-white text-sm font-light px-4"
            onClick={openAddForm}
          >
            <img src={addIco} className="mr-2 w-4 h-4" alt="" />
            Add Category
          </button>
        </div>
      </div>

      {/* Modal Form (used for Add & Editt) */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-[434px]">
            <div className="flex justify-between items-center bg-[#FEF8F0]">
              <h2 className="text-[16px] text-normal text-[#814E10] font-medium py-4 px-6">
                {isEditing ? "Edit Category" : "Add New Category"}
              </h2>
              {/* <button onClick={closeForm}>
                <img src={close} alt="close" className="w-5 h-5" />
              </button> */}
            </div>
            <form
              className="my-6 px-6"
              onSubmit={isEditing ? handleUpdateCategory : handleAddCategory}
            >
              {/* Category Name Input */}
              <input
                type="text"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 placeholder:text-#A8A8A8 placeholder:text-light"
              />

              {/* Category Image Upload Field */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCategoryImage(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div> */}

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded-lg border border-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 font-light text-[16px] leading-[22px] py-[12px] rounded-lg bg-[#BF6A02] hover:bg-[#965B13] text-white duration-300"
                >
                  {isEditing ? "Update" : "Add category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
        <div className="flex justify-between">
          <div className="flex">
            <div className="relative  w-[584px] h-10 ">
              <img
                src={searchIcon}
                alt="search"
                className="absolute left-4 top-3 w-4 h-4"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Product , Product ID"
                className="border border-[#D5D5D5] pl-10 p-[10px] placeholder:text-[#C1C1C1] focus:outline-none hover:border-black  font-light text-sm leading-5 rounded-lg w-full h-10"
              />
            </div>
            <div className="relative  h-10 ml-4">
              <img
                src={filterIcon}
                alt="filter"
                className="absolute top-3 left-3 w-4 h-4 pointer-events-none"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none pl-9 text-[#2C2B2B] hover:border-black duration-300 font-normal pr-3 border border-[#D5D5D5] h-10 rounded-lg text-sm focus:outline-none bg-white w-auto min-w-[80px]"
              >
                <option value="">Filter</option>
                <option value="in">In Stock</option>
                <option value="out">Out Of Stock</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-auto rounded-t-lg mt-4">
          <table className="min-w-full text-sm text-left">
            <thead className=" bg-[#F0F0F0] rounded-tl-lg rounded-tr-lg border-[#D9D9D9] text-black">
              <tr>
                <th className="py-[14px] px-4 font-normal">Category name</th>
                <th className="py-[14px] px-4 font-normal">No. of Products</th>
                <th className="py-[14px] px-4 font-normal">Total quantity</th>
                <th className="py-[14px] px-4 font-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr
                  className="border-b border-[#F0F0F0] text-[#171717] font-medium text-sm leading-4 hover:bg-[#F8F3F1]"
                  key={index}
                >
                  <td className="py-3 px-4 font-normal">{cat.name}</td>
                  <td className="py-3 px-4 font-normal">24</td>
                  <td className="py-3 px-4 font-normal">500</td>
                  <td className="py-3 px-4 font-normal">
                    <div className="flex gap-[22px]">
                      {/* Delete Button */}
                      <button
                        className="duration-300"
                        onClick={() => openDeleteModal(cat.id)}
                        onMouseEnter={(e) =>
                          (e.currentTarget.querySelector("img").src =
                            deleteHover)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.querySelector("img").src = deletIco)
                        }
                      >
                        <img
                          src={deletIco}
                          className="w-[26px] h-[26px]"
                          alt="delete"
                        />
                      </button>

                      {/* Edit Button */}
                      <button
                        className="duration-300"
                        onClick={() => openEditForm(cat)}
                        onMouseEnter={(e) =>
                          (e.currentTarget.querySelector("img").src = editHover)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.querySelector("img").src = editIco)
                        }
                      >
                        <img
                          src={editIco}
                          className="w-[26px] h-[26px]"
                          alt="edit"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Categories;
