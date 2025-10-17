import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../../services/Api';



function BlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    const navigate = useNavigate();
  
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
              setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== selectedBlogId));
            }
          })
          .catch((error) => {
            console.error("Error deleting blog:", error);
          })
          .finally(closeModal);
      };
  
    return (
      <div className='max-w-[1200px] mx-auto'>
        <div className="flex justify-between items-center border-b pb-6">
         <div>
            <h2 className=" font-semibold  text-[20px]">All Blogs</h2>
            <div className='text-[16px] text-[#858585] font-medium mt-2'>See all blogs here</div>
         </div>
          <Link to="/blogPageForm">
            <button className="px-6 py-3 bg-[#04A391] hover:bg-[#097468] duration-300 rounded-lg text-white text-sm font-semibold">
              Create New
            </button>
          </Link>
        </div>
  
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {blogs.map((blog) => (
      <div
        key={blog.id}
        className="p-4 bg-[#F1F1F1] flex flex-col items-center w-full"
      >
        <img
          src={blog.image}
          className="w-full h-[146px] object-cover"
          alt="Blog"
        />
        <h1 className="text-sm font-normal mt-6 h-[40px] text-center">
          {blog.title}
        </h1>
  
        {/* Buttons */}
        <div className="flex justify-center items-center gap-4 mt-6 w-full">
          <button
            onClick={() => navigate(`/blogPageForm/${blog.id}`)}
            className="flex-1 py-3 border rounded-lg border-black hover:bg-black hover:text-white"
          >
            View
          </button>
          <button
            onClick={() => openModal(blog.id)}
            className="flex-1 py-3 border rounded-lg bg-[#ED1C24]  hover:bg-[#AF2228] text-white"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
  
  
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 w-[400px]">
              {/* <img src={DltIcon} alt="Delete" /> */}
              <h2 className="text-xl font-bold mt-6">Confirm Delete</h2>
              <p className="text-base font-normal mt-4">
                Are you sure you want to delete this item?
              </p>
              <div className="flex justify-center space-x-4 mt-8">
                <button onClick={closeModal} className="px-10 py-[14px] border rounded-lg text-gray-600 hover:bg-gray-100">
                  Cancel
                </button>
                <button onClick={handleDelete} className="px-10 py-[14px] bg-[#ED1C24] text-white rounded-lg hover:bg-[#BD1D23]">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

export default BlogPage