import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Api from "../../services/Api";

import searchIcon from "@assets/layouts/search.svg";

import addIco from "@assets/products/Add.svg";



import BlogForm from "./BlogForm";



function BlogPage() {

  const [showForm, setShowForm] = useState(false);

  const [blogs, setBlogs] = useState([]);

  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  

  const navigate = useNavigate();



  const token = localStorage.getItem('token')



  // ✅ Fetch all blogs on mount

  useEffect(() => {

    fetchBlogs();

  }, []);



  const fetchBlogs = async () => {

    try {

      const res = await Api.get("blog/all",

        {

          Authrization: `Bearer ${token}`

        }

      );

      if (res.status === 200 && res.data?.data) {

        setBlogs(res.data.data);

        console.log("Blogs fetched successfully:", res.data.data);

      }

    } catch (error) {

      console.error("Error fetching blogs:", error);

    }

  };



  // ✅ Handle delete confirmation

  const handleDeleteConfirm = (id) => {

    setSelectedBlogId(id);

    setShowDeleteModal(true);

  };



  // ✅ Delete blog API call

  const handleDelete = async () => {

    try {

      const res = await Api.delete(`blog/${selectedBlogId}`);

      if (res.status === 200) {

        setBlogs((prev) => prev.filter((b) => b.id !== selectedBlogId));

      }

    } catch (error) {

      console.error("Error deleting blog:", error);

    } finally {

      setShowDeleteModal(false);

      setSelectedBlogId(null);

    }

  };



  // ✅ Navigate to details page (you can customize)

  const handleView = (id) => {

    setSelectedBlogId(id)
    setShowForm(true);
    // navigate(`/blogdetails/${id}`);

  };



  if (showForm) {

    return <BlogForm blogId={selectedBlogId} />;

  }



  return (

    <div>

      {/* Header */}

      <div className="flex items-center justify-between">

        <h1 className="leading-[22px] text-[20px] font-light">All Blogs</h1>

        <div className="flex gap-4">

          <button

            className="flex bg-[#BF6A02] hover:bg-[#965B13] duration-300 h-10 items-center rounded-lg text-white text-sm font-light px-4"

            onClick={() => setShowForm(true)}

          >

            <img src={addIco} className="mr-2 w-4 h-4" alt="" />

            Add Blog

          </button>

        </div>

      </div>



      {/* Delete Confirmation Modal */}

      {showDeleteModal && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">

          <div className="bg-white w-[361px] p-4 rounded-lg">

            <img src={deleteWarning} className="w-12 h-12" alt="" />

            <p className="mt-4 text-[#030300] text-sm leading-4 font-medium">

              Confirm delete item?

            </p>

            <p className="mt-2 text-[#818180] text-sm font-light leading-5">

              Are you sure you want to delete this blog? <br />

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

                onClick={handleDelete}

                className="bg-[#DA1818] hover:bg-[#DE5555] duration-300 text-white w-full text-base font-light px-4 py-2 rounded-lg"

              >

                Delete

              </button>

            </div>

          </div>

        </div>

      )}



      {/* Blog Grid */}

      <div className="bg-white min-h-[665px] p-4 mt-4">

        {blogs.length > 0 ? (

          <div className="grid grid-cols-4 gap-5">

            {blogs.map((blog) => (

              <div

                key={blog.id}

                className="p-4 bg-[#F8F8F8] rounded-lg shadow-sm"

              >

                <img

                  className="w-full h-[146px] object-cover rounded-md"

                  src={blog.image || searchIcon}

                  alt={blog.title}

                />

                <p className="mt-2 text-[12px] font-light text-[#929292]">

                  {new Date(blog.createdAt).toLocaleDateString()}

                </p>

                <p className="mt-2 text-[14px] leading-5 font-light text-black line-clamp-2">

                  {blog.name}

                </p>

                <div className="flex gap-4">

                  <button

                    onClick={() => handleView(blog.id)}

                    className="border border-[#B3B3B3] rounded-[8px] w-full py-2 mt-4"

                  >

                    <p className="text-black text-[14px] font-light leading-5">

                      View

                    </p>

                  </button>

                  <button

                    onClick={() => handleDeleteConfirm(blog.id)}

                    className="bg-[#ED1C24] rounded-[8px] w-full py-2 mt-4"

                  >

                    <p className="text-white text-[14px] font-light leading-5">

                      Delete

                    </p>

                  </button>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <p className="text-center text-gray-500 mt-20 text-sm">

            No blogs available.

          </p>

        )}

      </div>

    </div>

  );

}



export default BlogPage;

