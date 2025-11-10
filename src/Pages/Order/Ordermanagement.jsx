import React, { useEffect, useState } from "react";
import Api from "../../Services/Api";
import noOrder from "@assets/layouts/noOrder.png";
import arrowRight from "@assets/layouts/arrowRight.svg";
import arrowLeft from "@assets/layouts/arrowLeft.svg";

const tabs = ["All Order", "Pending", "Delivered", "Cancelled"];
const LIMIT = 50;

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("All Order");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);

  const fetchOrderStats = async (token) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [allRes, pendingRes, deliveredRes] = await Promise.all([
        Api.get("order/all?page=1&limit=100000",  headers ),
        Api.get("order/pending?page=1&limit=100000",  headers ),
        Api.get("order/delivered?page=1&limit=100000",  headers ),
      ]);

      console.log("Order stats responses:", {
        allRes: allRes.data,
        pendingRes: pendingRes.data,
        deliveredRes: deliveredRes.data,
      });

      setNewOrdersCount(allRes?.data?.data?.length || 0);
      setPendingCount(pendingRes?.data?.data?.length || 0);
      setDeliveredCount(deliveredRes?.data?.data?.length || 0);
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let url;
      switch (tab) {
        case "Pending":
          url = "order/pending";
          break;
        case "Delivered":
          url = "order/delivered";
          break;
        case "Cancelled":
          url = "order/cancelled";
          break;
        default:
          url = "order/all";
      }

      console.log(`🔍 Fetching orders from: ${url}?page=1&limit=100000`);

      const res = await Api.get(`${url}?page=1&limit=100000`,  headers );

      console.log("new resssssssssssssssss", res);

      const allData = res?.data?.data || [];
      const reversedData = [...allData].reverse();
      const paginated = reversedData.slice((page - 1) * LIMIT, page * LIMIT);

      setOrders(paginated);
      setTotalPages(Math.ceil(reversedData.length / LIMIT));
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(`🟦 Tab changed: ${tab}, page: ${page}`);
    fetchOrders();
  }, [tab, page]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchOrderStats(token);
  }, []);

  return (
    <div className=" ">
      <h1 className="text-xl leading-6 text-[#BF6A02] font-medium ">
        Order Management
      </h1>

      {/* Overview Cards */}
      <div className=" bg-white  mt-4 p-4  ">
        <h1 className="text-base font-semibold leading-6">Overview</h1>
        <div className="grid grid-cols-3 mt-2 gap-6">
          <div className="bg-[#EBF5FF] py-4 px-6 h-[110px]  border-l-[3px] border-[#5B6D7E]">
            <p className="text-base font-medium leading-[22px] ">New Orders</p>
            <p className="text-[32px] font-semibold leading-10 mt-4">
              {newOrdersCount}
            </p>
          </div>
          <div className="bg-[#F6F4FF] py-4 px-6  h-[110px] border-l-[3px] border-[#7A729E]">
            <p className="text-base font-medium leading-[22px] ">
              Pending Orders
            </p>
            <p className="text-[32px] font-semibold leading-10 mt-4">
              {pendingCount}
            </p>
          </div>
          <div className="bg-[#FFECE6] py-4 px-6  h-[110px] border-l-[3px] border-[#A8918A]">
            <p className="text-base font-medium leading-[22px] ">
              Delivered Orders
            </p>
            <p className="text-[32px] font-semibold leading-10 mt-4">
              {deliveredCount}
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-[665px] mt-4 p-6 bg-white  rounded-lg shadow-lg">
        {/* Tabs */}
        <div className="flex gap-4  mb-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setPage(1);
              }}
              className={`pb-4 px-4 leading-4  ${
                tab === t
                  ? "border-b-2 border-[#0C45C7] text-sm  font-semibold text-[#0C45C7]"
                  : "text-[#A4A4A4] text-sm  font-medium"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto mt-8 ">
          <table className="min-w-full text-sm text-left">
            <thead className="border-b font-semibold border-[#D9D9D9] text-[#252525]">
              <tr>
                <th className="py-4 px-4">Sl.no</th>
                <th className="py-4 px-4">Order&nbsp;ID</th>
                <th className="py-4 px-4">Product&nbsp;Name</th>
                <th className="py-4 px-4">Customer&nbsp;Name</th>
                <th className="py-4 px-4">Order&nbsp;Date</th>
                <th className="py-4 px-4">Delivery&nbsp;Date</th>
                <th className="py-4 px-4">Total&nbsp;Price</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    Loading orders…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-36">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <img
                        src={noOrder}
                        alt="No orders"
                        className="w-[88px] h-[88px] object-contain"
                      />
                      <span className="text-gray-500">No orders found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((o, i) => (
                  <tr
                    key={o?.order?.orderId || i}
                    className="border-b border-[#F2F2F2] text-[#2C2B2B] font-medium text-sm leading-4  hover:bg-[#F8F8F8]"
                  >
                    <td className="py-4  px-4">{(page - 1) * LIMIT + i + 1}</td>
                    <td className="py-4  px-4">
                      {o?.orderId ? `${o.orderId}` : "—"}
                    </td>
                    <td className="py-4 px-4">
                      {o?.product?.name ?? "—"}
                    </td>
                    <td className="py-4 px-4">{o?.user?.name ?? "N/A"}</td>
                    <td className="py-4 px-4">
                      {o?.orderDate
                        ? new Date(o.orderDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-4 px-4">
                      {o?.expectedDelivery
                        ? new Date(o.expectedDelivery).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-4 px-4">₹{o?.totalAmount ?? 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              <img src={arrowLeft} className="h-6 w-6" alt="prev" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1  rounded-lg ${
                  page === i + 1
                    ? "bg-[#F9F9FB] text-[#304BA0]"
                    : " text-[#696A70"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              <img src={arrowRight} className="h-5 w-5" alt="next" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderManagement;
