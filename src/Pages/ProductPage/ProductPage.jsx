import React, { useEffect, useState } from "react";
import Api from "../../Services/Api";
import importIco from "@assets/products/Import.svg";
import addIco from "@assets/products/Add.svg";
import exportIco from "@assets/products/Export.svg";
import arrowdownIco from "@assets/products/arrow_drop_down.svg";
import eyeBlue from "@assets/products/blueEye.svg";
import eyeIco from "@assets/products/blackEye.svg";
import deletIco from "@assets/products/delete.svg";
import deleteHover from "@assets/products/deleteHover.svg";
import editIco from "@assets/products/edit.svg";
import editHover from "@assets/products/editHover.svg";
import deleteWarning from "@assets/products/warningModal.svg";
import close from "@assets/products/close.svg";
import closeHover from "@assets/products/closeHover.svg";
import cancelIco from "@assets/products/cancel.svg";
import filterIcon from "@assets/layouts/filter_alt.svg";
import searchIcon from "@assets/layouts/search.svg";
import arrowRight from "@assets/layouts/arrowRight.svg";
import arrowLeft from "@assets/layouts/arrowLeft.svg";
// import ProductAddForm from "./ProductAddForm";
import noOrder from "@assets/layouts/noOrder.png";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ProductAddForm from "./ProductAddForm";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const mySwal = withReactContent(Swal);

  const fetchProducts = async () => {
    setLoading(true);
    console.log(token);
    console.log(Api.get("product/all"));
    try {
      const res = await Api.get(`product/all`);

      console.log("✅ API Raw Response:", res);

      const data = Array.isArray(res.data?.data) ? res.data.data.reverse() : [];
      setProducts(data);
      setTotalPages(res.data?.totalPages || 1);
      console.log("✅ Fetched Products:", data);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      console.log("❌ Server responded with:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, filter]);

  const handleDelete = async () => {
    try {
      const res = await Api.delete(`api/product/${deleteId}`, {
        Authorization: `Bearer ${token}`,
      });
      if (res.status === 200) {
        // alert("Product deleted successfully!");
        mySwal.fire({
          title: "Success!",
          text: "Product deleted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        fetchProducts();
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product");
    }
  };

  const handleExport = () => {
    // alert("Exporting products...");
    mySwal.fire({
      title: "Success!",
      text: "Exported products!",
      icon: "success",
      confirmButtonText: "OK",
    });
    // Call export API here
  };

  const handleImport = () => {
    // alert("Importing products...");
    mySwal.fire({
      title: "Success!",
      text: "Imported products!",
      icon: "success",
      confirmButtonText: "OK",
    });
    // Call import API here
  };
  if (showForm) {
    return (
      <ProductAddForm
        product={editProduct}
        onClose={() => {
          setShowForm(false);
          setEditProduct(null);
        }}
        onSuccess={fetchProducts}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl leading-6 font-normal text-[#2C2B2B]">
          Product Management
        </h1>
        <div className="flex gap-4">
          {/* <button
            onClick={handleImport}
            className="flex bg-white h-10 items-center rounded-lg border border-[#D5D5D5] hover:border-[#004D96] duration-300 text-[#2C2B2B] text-sm font-normal   px-4 "
          >
            <img src={importIco} className="mr-2 w-4 h-4" alt="" />
            Import
          </button> */}
          <button
            onClick={() => {
              setShowForm(true);
              setEditProduct(null);
            }}
            className="flex bg-[#BF6A02] hover:bg-[#965B13] duration-300 h-10 items-center rounded-lg text-white text-sm font-normal px-4 "
          >
            <img src={addIco} className="mr-2 w-4 h-4" alt="" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white min-h-[665px] rounded-tl-lg rounded-tr-lg p-4 mt-4">
        {/* Search and Filter */}
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
          {/* <button
            onClick={handleExport}
            className="flex bg-white h-10 items-center rounded-lg border border-[#D5D5D5] hover:border-[#004D96] duration-300 px-4"
          >
            <img src={exportIco} className="mr-2 w-4 h-4" alt="" />
            Export
            <img src={arrowdownIco} className="ml-2 w-4 h-4" alt="" />
          </button> */}
        </div>

        {/* Product Table */}
        {loading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          <div className="overflow-auto rounded-t-lg mt-8">
            <table className="min-w-full text-sm text-left">
              <thead className=" bg-[#F0F0F0] rounded-tl-lg rounded-tr-lg border-[#D9D9D9] text-black">
                <tr>
                  <th className="py-4 px-4 font-normal">Product ID</th>
                  <th className="py-4 px-4 font-normal">Product Detail</th>
                  <th className="py-4 px-4 font-normal">Price</th>
                  <th className="py-4 px-4 font-normal">Quantity</th>
                  <th className="py-4 px-4 font-normal">Status</th>
                  <th className="py-4 px-4 font-normal">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr
                    key={prod.id}
                    className="border-b border-[#F2F2F2] text-[#171717] font-normal text-sm leading-4  hover:bg-[#F8F3F1]"
                  >
                    <td className="py-4 px-4 text-[#171717] font-normal text-sm">
                      #{prod.id}
                    </td>
                    <td className="py-4 px-4 text-[#171717] font-normal text-sm">
                      {prod.name}
                    </td>
                    <td className="py-4 px-4 text-[#171717] font-normal text-sm">
                      ₹{prod.totalPrice}
                    </td>
                    <td className="py-4 px-4 text-[#171717] font-normal text-sm">
                      {prod.stockQuantity}
                    </td>
                    <td className="py-4 px-4 text-[#171717] font-normal text-sm">
                      {prod.stockQuantity > 9 ? (
                        <span className="bg-[#E1FDD7] text-[#29860A] px-4 py-[7px] rounded-lg text-xs leading-4 font-semibold">
                          In Stock
                        </span>
                      ) : (
                        <span className="bg-[#FDD7D7] text-[#AC0202] px-4 py-[7px] rounded-lg text-xs leading-4 font-semibold">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-[22px]">
                        {/* View Button */}
                        {/* <button
                          className="duration-300"
                          onClick={() => setViewProduct(prod)}
                          onMouseEnter={(e) =>
                            (e.currentTarget.querySelector("img").src = eyeBlue)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.querySelector("img").src = eyeIco)
                          }
                        >
                          <img
                            src={eyeIco}
                            className="w-[26px] h-[26px]"
                            alt="view"
                          />
                        </button> */}

                        {/* Delete Button */}
                        <button
                          className="duration-300"
                          onClick={() => {
                            setDeleteId(prod.id);
                            setShowDeleteModal(true);
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.querySelector("img").src =
                              deleteHover)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.querySelector("img").src =
                              deletIco)
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
                          onClick={() => {
                            setEditProduct(prod);
                            setShowForm(true);
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.querySelector("img").src =
                              editHover)
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
        ) : (
          <div className="overflow-auto mt-8">
            <table className="min-w-full text-sm text-left">
              <tbody>
                <tr>
                  <td colSpan="6" className="py-36">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <img
                        src={noOrder}
                        alt="No products"
                        className="w-[88px] h-[88px] object-contain"
                      />
                      <span className="text-gray-500">No products added.</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              <img src={arrowLeft} className="h-6 w-6" alt="prev" />
            </button>
            {[...Array(totalPages || 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  page === i + 1
                    ? "bg-[#F9F9FB] text-[#304BA0]"
                    : "text-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              <img src={arrowRight} className="h-6 w-6" alt="next" />
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {viewProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6  rounded-lg ">
            <div className="flex justify-between items-center text-center">
              <h1 className="font-medium text-base  leading-4">
                Product details
              </h1>
              <button
                className="duration-300 w-6 h-6"
                onClick={() => setViewProduct(null)}
                onMouseEnter={(e) =>
                  (e.currentTarget.querySelector("img").src = closeHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.querySelector("img").src = close)
                }
              >
                <img src={close} alt="" />
              </button>
            </div>
            <div className="flex mt-6 gap-8">
              <div>
                <img
                  src={viewProduct.imageUrls}
                  className="w-[197px] h-[217px] object-cover rounded-lg"
                />
              </div>{" "}
              <div className="mt-4">
                <h2 className="text-base font-medium leading-4 text-[#050710]">
                  {viewProduct.name}
                </h2>
                <p className="mt-2 text-[#717171] w-[337px] text-justify text-sm leading-5 font-normal">
                  {viewProduct.description}
                </p>
                <div className="mt-8 space-y-3">
                  <div className="flex justify-between text-sm leading-4">
                    <span className="text-[#A2A2A2] font-medium">
                      Material:
                    </span>
                    <span className="text-[#050710] w-[250px] text-end font-medium">
                      {viewProduct?.specification?.Material?.length > 0
                        ? viewProduct.specification.Material.join(", ")
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm leading-4">
                    <span className="text-[#A2A2A2] font-medium">
                      Quantity:
                    </span>
                    <span className="text-[#050710] font-medium">
                      {viewProduct.stockQuantity}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm leading-4">
                    <span className="text-[#A2A2A2] font-medium">
                      Capacity:
                    </span>
                    <span className="text-[#050710] font-medium">
                      {viewProduct?.specification?.Capacity?.length > 0
                        ? viewProduct.specification.Capacity.join(", ")
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm leading-4">
                    <span className="text-[#A2A2A2] font-medium">Price:</span>
                    <span className="text-[#050710] font-medium">
                      ₹{viewProduct.totalPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
              Are you sure you want to delete the product ? <br />
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

      {/* Add/Edit Product Form */}
    </div>
  );
};

export default ProductManagement;
