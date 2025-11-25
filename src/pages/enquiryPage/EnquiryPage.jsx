import React, { useEffect, useState } from "react";
import Api from "../../services/Api";
import ExportIcon from "../../assets/Enquiry/exporticon.svg";
import Dropdown from "../../assets/Enquiry/arrow_drop_down.svg"

const tabs = [
  "Contact Enquiry",
  "Seller Enquiry",
  "Product Bulk order enquiry",
];

function EnquiriesPage() {
  const [activeTab, setActiveTab] = useState("Contact Enquiry");
  const [enquiries, setEnquiries] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const token = localStorage.getItem("token")
  useEffect(() => {
    fetchEnquiries();
  }, [activeTab, page]);

  const fetchEnquiries = async () => {
    try {
      let endpoint = "";
      if (activeTab === "Contact Enquiry") endpoint = "contactUs/all";
      else if (activeTab === "Product Bulk order enquiry")
        endpoint = "productEnquiry/all";
      else if (activeTab === "Seller Enquiry") endpoint = "requirement/all";

      const res = await Api.get(endpoint,
        {
          'Authorization': `Bearer ${token}`
        }
      );

      console.log("res", res)

      if (res.data && res.data.success) {
        setEnquiries(res.data.data);
      } else {
        setEnquiries([]);
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      setEnquiries([]);
    }
  };

  // Define columns per tab
  const getColumns = () => {
    switch (activeTab) {
      case "Seller Enquiry":
        return [
          "Sl.No",
          "Name",
          "Phone Number",
          "Email",
          "Country",
          "Product",
          "Quantity",
          "Details",
          "Date",
        ];
      case "Product Bulk order enquiry":
        return [
          "Sl.No",
          "Name",
          "Phone Number",
          "Email",
          "Product",
          "Quantity",
          "Purpose",
          "Message",
          "Date",
        ];
      default:
        return ["Sl.No", "Name", "Phone Number", "Email", "Message", "Date"];
    }
  };

  const columns = getColumns();

  const handleExport = () => {
    if (!enquiries.length) return;

    const csv = [
      columns,
      ...enquiries.map((item, i) => {
        const base = [(page - 1) * limit + (i + 1), item.name, item.phone, item.email];

        if (activeTab === "Seller Enquiry") {
          return [
            ...base,
            item.country,
            item.product,
            item.quantity,
            item.details,
            item.date,
          ];
        } else if (activeTab === "Product Bulk order enquiry") {
          return [
            ...base,
            item.product,
            item.quantity,
            item.purpose,
            item.message,
            item.date,
          ];
        } else {
          return [...base, item.message, item.date];
        }
      }),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${activeTab.replace(/\s/g, "_")}_Enquiries.csv`;
    link.click();
  };

  return (
    <div className="p-6 bg-[#f8f8f8] min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[#b87019] text-lg font-semibold">Enquiries</h2>
          <button
            onClick={handleExport}
            className="flex items-center border border-[#D5D5D5] gap-2 bg-white px-3 py-1 rounded-md text-gray-700 hover:bg-gray-200 transition"
          >
            <img src={ExportIcon} alt="" />
            Export
            <img src={Dropdown} alt="" />
          </button>
        </div>


        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`pb-2 text-sm font-medium ${activeTab === tab
                ? "text-[#b87019] border-b-2 border-[#b87019]"
                : "text-gray-500 hover:text-[#b87019]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-sm ">
            <thead>
              <tr className="bg-[#F0F0F0] text-[#000000] text-sm font-extralight text-left">
                {columns.map((col, i) => (
                  <th
                    key={col}
                    className={`py-[14px] px-6 text-sm font-medium 
          ${i === 0 ? "rounded-tl-lg" : ""} 
          ${i === columns.length - 1 ? "rounded-tr-lg" : ""}
        `}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {enquiries.length > 0 ? (
                enquiries.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-[#fbfbfb]  transition text-[#595959]"
                  >
                    <td className="py-[14px] px-6">
                      {(page - 1) * limit + (index + 1)}
                    </td>
                    <td className="py-[14px] px-6">{item.name}</td>
                    <td className="py-[14px] px-6">{item.phoneNo}</td>
                    <td className="py-[14px] px-6">{item.email}</td>

                    {/* Seller Enquiry fields */}
                    {activeTab === "Seller Enquiry" && (
                      <>
                        <td className="py-[14px] px-6">{item.country}</td>
                        <td className="py-[14px] px-6">{item.product}</td>
                        <td className="py-[14px] px-6">{item.quantity}</td>
                        <td className="py-[14px] px-6">{item.details}</td>
                      </>
                    )}

                    {/* Product Bulk order enquiry fields */}
                    {activeTab === "Product Bulk order enquiry" && (
                      <>
                        <td className="py-[14px] px-6">{item.product}</td>
                        <td className="py-[14px] px-6">{item.quantity}</td>
                        <td className="py-[14px] px-6">{item.purpose}</td>
                        <td className="py-[14px] px-6 max-w-xs truncate">
                          {item.message}
                        </td>
                      </>
                    )}

                    {/* Contact Enquiry fields */}
                    {activeTab === "Contact Enquiry" && (
                      <td className="py-[14px] px-6 max-w-xs truncate">
                        {item.message}
                      </td>
                    )}

                    <td className="py-[14px] px-6">{item.createdAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-5 text-gray-400 italic"
                  >
                    No enquiries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            &lt;
          </button>

          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 rounded-md ${page === num
                ? "bg-[#F9F9FB] text-[#304BA0]"
                : " text-gray-600 hover:bg-[#F9F9FB]"
                }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnquiriesPage;
