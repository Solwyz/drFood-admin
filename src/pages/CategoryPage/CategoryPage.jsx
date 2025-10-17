import React, { useEffect, useState } from 'react'
import addIco from "@assets/products/Add.svg";
import eyeBlue from "@assets/products/blueEye.svg";
import eyeIco from "@assets/products/blackEye.svg";
import deletIco from "@assets/products/delete.svg";
import deleteHover from "@assets/products/deleteHover.svg";
import editIco from "@assets/products/edit.svg";
import editHover from "@assets/products/editHover.svg";
import close from "@assets/products/close.svg";
import Api from '../../Services/Api';

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

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        Api.get('category/all')
            .then(response => {
                if (response && response.status === 200) {
                    console.log('categories', response);
                    setCategories(response.data.data);
                } else {
                    console.error('Failed to fetch categories', response);
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
            .then(response => {
                console.log("Response:", response);
                if (response && response.status === 200) {
                    console.log("Category added", response);
                    closeForm();
                    fetchCategories();
                } else {
                    console.error("Failed to add category", response);
                }
            })
            .catch(err => console.error("Error:", err));
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

        Api.put(`category/update?categoryId=${editId}&name=${newCategory}`, formData, {
            "Content-Type": "multipart/form-data"
        })
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
            .then(response => {
                if (response && response.status === 200) {
                    setShowDeleteModal(false);
                    setDeleteId(null);
                    fetchCategories();
                } else {
                    console.error("Failed to delete category", response);
                }
            })
            .catch(err => console.error("Error:", err));
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
                <h1 className="text-xl leading-6 font-medium">Category Management</h1>
                <div className="flex gap-4">
                    <button
                        className="flex bg-[#004D96] hover:bg-[#347DC0] duration-300 h-10 items-center rounded-lg text-white text-sm font-normal px-4"
                        onClick={openAddForm}
                    >
                        <img src={addIco} className="mr-2 w-4 h-4" alt="" />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Modal Form (used for Add & Editt) */}
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">
                                {isEditing ? "Edit Category" : "Add New Category"}
                            </h2>
                            <button onClick={closeForm}>
                                <img src={close} alt="close" className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={isEditing ? handleUpdateCategory : handleAddCategory}>
                            {/* Category Name Input */}
                            <input
                                type="text"
                                placeholder="Enter category name"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
                            />

                            {/* Category Image Upload Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Category Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setCategoryImage(e.target.files[0])}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>

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
                                    className="px-4 py-2 rounded-lg bg-[#004D96] text-white hover:bg-[#347DC0] duration-300"
                                >
                                    {isEditing ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]">
                        <h2 className="text-lg font-medium mb-4">Confirm Delete</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this category?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteCategory}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 duration-300"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Category Table */}
            <div className="bg-white min-h-[665px] p-4 mt-4">
                <div className="overflow-auto mt-8">
                    <table className="min-w-full text-sm text-left">
                        <thead className="border-b font-semibold border-[#D9D9D9] text-[#252525]">
                            <tr>
                                <th className="py-4 px-4">Sl.No</th>
                                <th className="py-4 px-4">Category ID</th>
                                <th className="py-4 px-4">Category name</th>
                                <th className="py-4 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat, index) => (
                                <tr
                                    className="border-b border-[#F2F2F2] text-[#2C2B2B] font-medium text-sm leading-4 hover:bg-[#F8F8F8]"
                                    key={index}
                                >
                                    <td className="py-4 px-4">{index + 1}</td>
                                    <td className="py-4 px-4">{cat.id}</td>
                                    <td className="py-4 px-4">{cat.name}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex gap-[22px]">

                                            {/* Delete Button */}
                                            <button
                                                className="duration-300"
                                                onClick={() => openDeleteModal(cat.id)}
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.querySelector("img").src = deleteHover)
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
