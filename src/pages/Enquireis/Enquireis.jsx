// import React, { useEffect, useState } from "react";
// import Api from "../../services/Api";
// import ExportIcon from "../../assets/Enquiry/exporticon.svg"

// const tabs = ["Contact Enquiry", "Seller Enquiry", "Product Bulk order enquiry"];

// function EnquiriesPage() {
//   const [activeTab, setActiveTab] = useState("Contact Enquiry");
//   const [enquiries, setEnquiries] = useState([]);
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   useEffect(() => {
//     fetchEnquiries();
//   }, [activeTab, page]);

//   const fetchEnquiries = async () => {
//     try {
//       // Example API call — update endpoint according to your backend
//       const res = await Api.get("enquiries", {
//         params: { type: activeTab, page, limit },
//       });

//       if (res.data && res.data.success) {
//         setEnquiries(res.data.data);
//       } else {
//         setEnquiries([]);
//       }
//     } catch (error) {
//       console.error("Error fetching enquiries:", error);
//       setEnquiries([]);
//     }
//   };

//   const handleExport = () => {
//     if (!enquiries.length) return;

//     const csv = [
//       ["Sl.No", "Name", "Phone Number", "Email", "Message", "Date"],
//       ...enquiries.map((item, i) => [
//         (page - 1) * limit + (i + 1),
//         item.name,
//         item.phone,
//         item.email,
//         item.message,
//         item.date,
//       ]),
//     ]
//       .map((row) => row.join(","))
//       .join("\n");

//     const blob = new Blob([csv], { type: "text/csv" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `${activeTab.replace(/\s/g, "_")}_Enquiries.csv`;
//     link.click();
//   };

//   return (
//     <div className="p-6 bg-[#f8f8f8] min-h-screen">
//       <div className="bg-white rounded-xl shadow-md p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-5">
//           <h2 className="text-[#b87019] text-lg font-semibold">Enquiries</h2>
//           <button
//             onClick={handleExport}
//             className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md text-gray-700 hover:bg-gray-200 transition"
//           >
//             <img src={ExportIcon} alt="" />
//             <span>Export</span>
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-6 border-b border-gray-200 mb-4">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => {
//                 setActiveTab(tab);
//                 setPage(1);
//               }}
//               className={`pb-2 text-sm font-medium ${
//                 activeTab === tab
//                   ? "text-[#b87019] border-b-2 border-[#b87019]"
//                   : "text-gray-500 hover:text-[#b87019]"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse text-sm">
//             <thead>
//               <tr className="bg-[#f5f5f5] text-gray-700 text-left">
//                 <th className="py-2 px-3">Sl.No</th>
//                 <th className="py-2 px-3">Name</th>
//                 <th className="py-2 px-3">Phone Number</th>
//                 <th className="py-2 px-3">Email</th>
//                 <th className="py-2 px-3">Message</th>
//                 <th className="py-2 px-3">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {enquiries.length > 0 ? (
//                 enquiries.map((item, index) => (
//                   <tr
//                     key={index}
//                     className="border-b hover:bg-gray-50 transition"
//                   >
//                     <td className="py-2 px-3 text-gray-600">
//                       {(page - 1) * limit + (index + 1)}
//                     </td>
//                     <td className="py-2 px-3">{item.name}</td>
//                     <td className="py-2 px-3">{item.phone}</td>
//                     <td className="py-2 px-3">{item.email}</td>
//                     <td className="py-2 px-3 max-w-xs truncate">
//                       {item.message}
//                     </td>
//                     <td className="py-2 px-3">{item.date}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="6"
//                     className="text-center py-5 text-gray-400 italic"
//                   >
//                     No enquiries found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center items-center mt-4 gap-3">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage(page - 1)}
//             className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
//           >
//             &lt;
//           </button>

//           {[1, 2, 3, 4].map((num) => (
//             <button
//               key={num}
//               onClick={() => setPage(num)}
//               className={`px-3 py-1 rounded-md ${
//                 page === num
//                   ? "bg-[#b87019] text-white"
//                   : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//               }`}
//             >
//               {num}
//             </button>
//           ))}

//           <button
//             onClick={() => setPage(page + 1)}
//             className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
//           >
//             &gt;
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EnquiriesPage;
