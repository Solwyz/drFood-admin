import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import TiptapEditor from './TipTapEditor';
import Api from '../../services/Api';
import Swal from 'sweetalert2';


function BlogForm() {
    const navigate = useNavigate();
    const { blogId } = useParams();

    const [blogForm, setBlogForm] = useState({
        name: '',
        shortDescription: '',
        image: null,
        mainDescription: ''
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [blogData, setBlogData] = useState(null);
    const [errors, setErrors] = useState({});

    // Handle form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlogForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' })); // clear error when typing
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBlogForm((prev) => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
            setErrors((prev) => ({ ...prev, image: '' }));
        }
    };

    // ✅ Validation logic
    const validateForm = () => {
        let newErrors = {};

        if (!blogForm.name.trim()) newErrors.name = 'Title is required';
        if (!blogForm.shortDescription.trim()) newErrors.shortDescription = 'Short Description is required';
        if (!blogForm.mainDescription.trim()) newErrors.mainDescription = 'Main Description is required';
        if (!blogId && !blogForm.image) newErrors.image = 'Image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // inside handleSave
const handleSave = async () => {
    if (!validateForm()) return;

    try {
        const formData = new FormData();
        formData.append('name', blogForm.name);
        formData.append('description', blogForm.mainDescription);
        formData.append('shortDescription', blogForm.shortDescription);
        if (blogForm.image) formData.append('image', blogForm.image);

        const res = await Api.post('blog/create', formData, {
            'Content-Type': 'multipart/form-data',
        });

        if (res.status === 200 || res.status === 201) {
            // ✅ Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Blog saved successfully!',
                confirmButtonColor: '#04A391',
            }).then(() => {
                navigate('/blogPage'); // redirect after alert
            });
        }
    } catch (err) {
        console.error('Blog save error:', err);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong while saving the blog.',
            confirmButtonColor: '#d33',
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
                name: blogData.title || '',
                shortDescription: blogData.shortDescription || '',
                image: null,
                mainDescription: blogData.paragraphs || ''
            });
            setPreviewImage(blogData.image || null);
        }
    }, [blogData]);
    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center">
                <Link to="/blogs">
                    <h2 className="text-base font-semibold mt-6 flex items-center">
                        {/* <img className="mr-2" src={Arrow} alt="" /> {blogId ? 'Edit Blog' : 'Create Blog'} */}
                    </h2>
                </Link>
                <button
                    className="px-6 py-3 bg-[#04A391] hover:bg-[#097468] duration-300 rounded-lg text-white text-sm font-semibold"
                    onClick={handleSave}
                >
                    Save
                </button>
            </div>

            {/* Form */}
            <div className="flex justify-between mt-12">
                <div>
                    {/* Title */}
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        name="name"
                        value={blogForm.name}
                        onChange={handleInputChange}
                        className={`w-[717px] h-[48px] px-4 mt-2 border rounded-lg focus:outline-none ${
                            errors.name ? 'border-red-500' : 'border-[#E8E8E8]'
                        }`}
                        placeholder="Enter name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}

                    {/* Short Description */}
                    <label className="block text-sm font-medium mt-8">Short Description</label>
                    <textarea
                        name="shortDescription"
                        value={blogForm.shortDescription}
                        onChange={handleInputChange}
                        className={`w-[717px] h-[123px] resize-none px-4 py-4 mt-2 border rounded-lg focus:outline-none ${
                            errors.shortDescription ? 'border-red-500' : 'border-[#E8E8E8]'
                        }`}
                        placeholder="Add short description"
                    ></textarea>
                    {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription}</p>}
                </div>

                {/* Image upload */}
                <div className="mt-4">
                    <div className="flex flex-col items-center w-fit">
                        {previewImage ? (
                            <img
                                src={previewImage}
                                className={`mb-2 w-[285px] h-[231px] object-cover rounded-lg border ${
                                    errors.image ? 'border-red-500' : 'border-gray-200'
                                }`}
                                alt="Preview"
                            />
                        ) : (
                            <div
                                className={`mb-2 px-[160px] py-[95px] border border-dashed rounded-lg bg-[#F5F5F5] text-gray-400 ${
                                    errors.image ? 'border-red-500' : 'border-[#E8E8E8]'
                                }`}
                            >
                                {/* <img src={uploadIcon} alt="Upload Icon" /> */}
                            </div>
                        )}
                        <label htmlFor="photo-upload" className="text-[#0539BC] text-[12px] font-normal cursor-pointer mt-3">
                            Add photo (max size 2Mb)
                        </label>
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                    </div>
                </div>
            </div>

            {/* Main Description */}
            <div className="mt-10">
                <div className="flex justify-between items-center">
                    <div className="text-[14px] font-semibold">Main Description</div>
                </div>
                <div className={`${errors.mainDescription ? 'border border-red-500 rounded-lg p-1' : ''}`}>
                    <TiptapEditor
                        value={blogForm.mainDescription}
                        onChange={(value) => {
                            setBlogForm({ ...blogForm, mainDescription: value });
                            setErrors((prev) => ({ ...prev, mainDescription: '' }));
                        }}
                    />
                </div>
                {errors.mainDescription && <p className="text-red-500 text-xs mt-1">{errors.mainDescription}</p>}
            </div>
        </div>
    );
}

export default BlogForm