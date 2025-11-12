import React, { useState, useEffect } from "react";
import Api from "../../Services/Api";
import closeIcon from "@assets/layouts/close.svg";
import filterIcon from "@assets/layouts/filter_alt.svg";
import searchIcon from "@assets/layouts/search.svg";
import arrowRight from "@assets/layouts/arrowRight.svg";
import arrowLeft from "@assets/layouts/arrowLeft.svg";
import userIcon from "@assets/layouts/userIcon.svg";

function UserManagement() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [overviewData, setOverviewData] = useState(null);

  // Tabs
  const [activeTab, setActiveTab] = useState("New");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 100;

  useEffect(() => {
    Api.get("order/sort/byDate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response && response.status === 200) {
        console.log("zzzz redspp", response.data);
        setOverviewData(response.data);
      } else {
        console.error("Failed resppp", response);
      }
    });
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    console.log(token);
    setLoading(true);
    setError(null);
    try {
      const response = await Api.get("user/allUser", {
        Authorization: `Bearer ${token}`,
      });
      console.log("ee", response.data.data);
      const dataWithStatus = response.data.data
        .map((u) => ({
          ...u,
          status: u.banned ? "Banned" : "Active",
        }))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      console.log("Fetched users:", dataWithStatus);
      setUsers(dataWithStatus);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const toggleBanStatus = async () => {
    try {
      const isCurrentlyBanned = selectedUser.status === "Banned";

      const endpoint = isCurrentlyBanned
        ? `api/user/unban/${selectedUser.id}`
        : `api/user/ban/${selectedUser.id}`;

      await Api.put(endpoint);

      const newStatus = isCurrentlyBanned ? "Active" : "Banned";

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUser.id
            ? { ...u, status: newStatus, banned: !isCurrentlyBanned }
            : u
        )
      );

      setSelectedUser({
        ...selectedUser,
        status: newStatus,
        banned: !isCurrentlyBanned,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // // Counts
  // const totalAll = users.length;
  // // const totalNew = users.filter(
  // //   (u) =>
  // //     new Date(u.createdAt) >= new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  // // ).length;

  // const totalNew = users.filter((u) => {
  //   const isNew =
  //     new Date(u.createdAt) >= new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

  //   const matchSearch = u.name
  //     ?.toLowerCase()
  //     .includes(searchTerm.toLowerCase());

  //   return isNew && matchSearch;
  // }).length;

  // const totalBanned = users.filter((u) => u.status === "Banned").length;

  // // Apply Filters & Tabs
  // const filteredUsers = users.filter((user) => {
  //   const matchSearch = user.name
  //     ?.toLowerCase()
  //     .includes(searchTerm.toLowerCase());

  //   let matchTab = true;
  //   if (activeTab === "New") {
  //     matchTab =
  //       new Date(user.createdAt) >=
  //       new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  //   } else if (activeTab === "Banned") {
  //     matchTab = user.status === "Banned";
  //   }

  //   const matchStatus = statusFilter ? user.status === statusFilter : true;

  //   return matchSearch && matchStatus && matchTab;
  // });

  // Base filtered users (search applied)
  const searchedUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Counts
  const totalAll = searchedUsers.length;
  const totalNew = searchedUsers.filter(
    (u) =>
      new Date(u.createdAt) >= new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  ).length;
  const totalBanned = searchedUsers.filter((u) => u.status === "Banned").length;

  // Apply Tabs
  const filteredUsers = searchedUsers.filter((user) => {
    if (activeTab === "New") {
      return (
        new Date(user.createdAt) >=
        new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      );
    } else if (activeTab === "Banned") {
      return user.status === "Banned";
    }
    return true; // "All" tab
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div>
      <h1 className="text-xl font-medium text-[#2C2B2B]">User Management</h1>
      <div className=" bg-white rounded-[8px]  mt-4 p-4  ">
        <h1 className="text-base font-semibold leading-6">Overview</h1>
        <div className="grid grid-cols-4 mt-2 gap-4">
          <div className="bg-[#EBF5FF] py-4 px-6 h-[110px]  border-l-[3px] border-[#5B6D7E]">
            <p className="text-base font-medium leading-[22px] ">
              Daily Orders
            </p>
            <p className="text-[32px] font-semibold leading-10 mt-4">
              {overviewData?.dailyOrders}
            </p>
          </div>
          <div className="bg-[#F4EDFF] py-4 px-6  h-[110px] border-l-[3px] border-[#AA99C4]">
            <p className="text-base font-medium leading-[22px] ">
              Monthly Orders
            </p>
            <p className="text-[32px] font-semibold leading-10 mt-4">
              {overviewData?.monthlyOrders}
            </p>
          </div>
          <div className="bg-[#E8FFF9] py-4 px-6  h-[110px] border-l-[3px] border-[#83AEA3]">
            <p className="text-base font-medium leading-[22px] ">
              Todays Revenue
            </p>
            <p className="text-[32px] font-semibold leading-10 mt-4">
              {overviewData?.totalRevenue}
            </p>
          </div>
          <div className="bg-[#FFF7EC] py-4 px-6  h-[110px] border-l-[3px] border-[#C0AC90]">
            <p className="text-base font-medium leading-[22px] ">
              Active Rewards
            </p>
            <p className="text-[32px] font-semibold leading-10 mt-4">
              {overviewData?.activeCoupons}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-t-[8px] min-h-[665px] p-4 mt-6">
        {/* Search + Filter Controls */}
        <div className="flex items-center">
          <h1 className="text-center text-base font-semibold leading-4 ">
            Registered Users
          </h1>
          <div className="relative ml-[56px] w-[584px] h-10 ">
            <img
              src={searchIcon}
              alt="search"
              className="absolute left-4 top-3 w-4 h-4"
            />
            <input
              type="text"
              placeholder="Search Product , Product ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-[#D5D5D5] pl-10 p-[10px] placeholder:text-[#C1C1C1] focus:outline-none duration-300 hover:border-black  font-normal text-sm leading-5 rounded-lg w-full h-10"
            />
          </div>

          <div className="relative w-[100px] h-10 ml-4">
            <img
              src={filterIcon}
              alt="filter"
              className="absolute top-3 left-3 w-4 h-4 pointer-events-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-9 text-[#2C2B2B] font-normal  pr-3 border w-full hover:border-black duration-300  border-[#D5D5D5] h-10 rounded-lg text-sm focus:outline-none"
            >
              <option value="">Filter</option>
              <option value="Active">Active</option>
              <option value="Banned">Banned</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6 mt-8">
          {" "}
          {[
            { key: "New", label: "New", count: totalNew },
            { key: "All", label: "All", count: totalAll },
            { key: "Banned", label: "Banned", count: totalBanned },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`text-sm group ps-3 pe-8 font-medium pb-4 flex items-center gap-1 ${
                  isActive
                    ? "text-[#BF6A02] border-b-2 border-[#BF6A02]"
                    : "text-[#9B9B9B] hover:text-[#BF6A02]"
                }`}
              >
                {" "}
                {tab.label}{" "}
                <span
                  className={`ml-1 ${
                    isActive
                      ? "text-[#BF6A02]"
                      : "text-[#9B9B9B] group-hover:text-[#BF6A02]"
                  }`}
                >
                  {" "}
                  ({tab.count}){" "}
                </span>{" "}
              </button>
            );
          })}{" "}
        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-t-[8px] mt-[24px]">
          <table className="min-w-full text-sm text-left border-collapse border-0">
            <thead className="font-semibold text-[#252525] bg-[#F0F0F0]">
              {" "}
              <tr>
                <th className="py-4 px-4">Sl.no</th>
                <th className="py-4 px-4">User Name</th>
                <th className="py-4 px-4">Contact</th>
                <th className="py-4 px-4">State</th>
                <th className="py-4 px-4">City</th>
                <th className="py-4 px-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-[#555]">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-red-500 font-medium"
                  >
                    {error}
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#F0F0F0] text-[#2C2B2B] font-medium text-sm leading-4 hover:bg-[#F8F8F8]"
                    onClick={() => handleRowClick(user)}
                  >
                    <td className="py-5 px-4">
                      {((currentPage - 1) * usersPerPage + index + 1)
                        .toString()
                        .padStart(2, "0")}
                    </td>
                    <td className="py-5 px-4">{user.name}</td>
                    <td className="py-5 px-4">{user.mobileNumber}</td>
                    <td className="py-5 px-4">{user.state}</td>
                    <td className="py-5 px-4">{user.city}</td>
                    <td
                      className={`py-5 font-semibold text-xs leading-4 px-4 ${
                        user.status === "Active"
                          ? "text-[#259601]"
                          : "text-[#E30000]"
                      }`}
                    >
                      {user.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {
            !(
              loading ||
              (error && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="disabled:opacity-50"
                  >
                    <img src={arrowLeft} alt="Prev" className="h-6 w-6" />
                  </button>

                  {[...Array(totalPages || 1)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === i + 1
                          ? "bg-[#FFFAF4] text-[#BF6A02] font-medium"
                          : "text-[#696A70] hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="disabled:opacity-50"
                  >
                    <img src={arrowRight} alt="Next" className="h-6 w-6" />
                  </button>
                </div>
              ))
            )
          }
        </div>

        {/* Modal */}
        {modalOpen && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-8 rounded-lg w-[591px] relative shadow-lg">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-3"
              >
                <img src={closeIcon} alt="Close" className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <img className="w-14 h-14 rounded-lg" src={userIcon} alt="" />
                <div>
                  <h2 className="text-base leading-6 font-medium">
                    {selectedUser.name}
                  </h2>
                  <p className="text-xs font-normal text-[#919191]">
                    Joined on{" "}
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="border-t border-[#DFDFDF] w-full mt-8"></div>

              <div className="mt-8 flex text-sm font-medium leading-5 justify-between">
                <div>
                  <div>
                    <span className="font-normal text-[#616161] mr-2">
                      Contact:
                    </span>
                    {selectedUser.mobileNumber}
                  </div>
                  <div className="mt-3 flex">
                    <span className="font-normal text-[#616161] mr-2">
                      Address:
                    </span>
                    {selectedUser?.addresses?.find((addr) => addr.selected) ? (
                      <p className="w-[202px]">
                        {(() => {
                          const selectedAddress = selectedUser.addresses.find(
                            (addr) => addr.selected
                          );
                          return `${selectedAddress.houseName}, 
        ${selectedAddress.streetAddress}
        ${selectedAddress.addressLine}
        ${selectedAddress.landMark}
        ${selectedAddress.town}
        `;
                        })()}
                      </p>
                    ) : (
                      <p className="w-[202px] text-gray-500">
                        No address selected
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <div>
                    <span className="font-normal text-[#616161] mr-3">
                      City:
                    </span>{" "}
                    {selectedUser.city}
                  </div>
                  <div className="mt-3">
                    <span className="font-normal text-[#616161] mr-2">
                      State:
                    </span>{" "}
                    {selectedUser.state}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-14">
                <button
                  className="px-6 w-full text-sm h-12 border font-normal rounded-lg"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-6 h-12 font-normal text-sm w-full rounded-lg text-white ${
                    selectedUser.status === "Active"
                      ? "bg-[#C30000] hover:bg-red-700"
                      : "bg-[#C30000] hover:bg-red-700"
                  }`}
                  onClick={toggleBanStatus}
                >
                  {selectedUser.status === "Active" ? "Ban User" : "Unban User"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
