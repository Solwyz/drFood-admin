import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../services/Api";
import searchIcon from "@assets/layouts/search.svg";
import addIco from "@assets/products/Add.svg";
import BlogForm from "./BlogForm";

function BlogPage() {
  const [showForm, setShowForm] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    Api.get("blog/all")
      .then((res) => {
        if (res.status === 200 && res) {
          setBlogs(res.data.data);
          console.log("Blogs fetched successfully:", res.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      });
  }, []);

  const openModal = (id) => {
    setSelectedBlogId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlogId(null);
  };

  const handleDelete = () => {
    Api.delete(`blog/${selectedBlogId}`)
      .then((res) => {
        if (res.status === 200) {
          setBlogs((prevBlogs) =>
            prevBlogs.filter((blog) => blog.id !== selectedBlogId)
          );
        }
      })
      .catch((error) => {
        console.error("Error deleting blog:", error);
      })
      .finally(closeModal);
  };

  if (showForm) {
    return <BlogForm />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="leading-[22px] text-[20px] font-light ">All Blogs</h1>

        <div className="flex gap-4">
          <button
            className="flex bg-[#BF6A02] hover:bg-[#965B13] duration-300 h-10 items-center rounded-lg text-white text-sm font-light px-4"
            onClick={() => {
              setShowForm(true);
            }}
          >
            <img src={addIco} className="mr-2 w-4 h-4" alt="" />
            Add Blog
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
              <button className="bg-[#DA1818] hover:bg-[#DE5555] duration-300 text-white w-full text-base font-light px-4 py-2 rounded-lg">
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

export default BlogPage;
