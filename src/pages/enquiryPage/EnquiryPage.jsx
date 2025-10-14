import React, { useEffect, useState } from "react";
import arrowRight from "@assets/layouts/arrowRight.svg";
import arrowLeft from "@assets/layouts/arrowLeft.svg";
import Api from '../../services/Api';


function EnquiryPage() {
    const [messages, setMessages] = useState([]);
    const [activeTab, setActiveTab] = useState("all"); // all | unread
    const [currentPage, setCurrentPage] = useState(1);
    const [messagesPerPage] = useState(50);
    const [seenMessages, setSeenMessages] = useState([]);
  
    useEffect(() => {
      fetchMessages();
    }, []);
  
    const fetchMessages = async () => {
      try {
        const res = await Api.get("contactUs/all");
        if (res.data && res.data.data) {
          // Reverse response for latest first
          const reversed = res.data.data.reverse();
          setMessages(reversed);
        }
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      }
    };
  
    const handleViewMessage = (id) => {
      if (!seenMessages.includes(id)) {
        setSeenMessages((prev) => [...prev, id]);
      }
    };
  
    // Filter messages
    const filteredMessages =
      activeTab === "unread"
        ? messages.filter((msg) => !seenMessages.includes(msg.id))
        : messages;
  
    // Pagination logic
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = filteredMessages.slice(
      indexOfFirstMessage,
      indexOfLastMessage
    );
  
    const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  
    return (
      <div className=" ">
        <h1 className="text-xl leading-6 text-[#2C2B2B] font-medium ">Enquiries & Support</h1>
        {/* Tabs */}
        <div className=" bg-white min-h-[665px] p-4 mt-4">
          <div className="flex">
              <button
                className={`px-4 py-2 text-sm font-semibold leading-4 ${
                  activeTab === "all"
                    ? "text-[#0C45C7] border-b border-[#0C45C7]"
                    : "text-[#A4A4A4]"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All Message
              </button>
              <button
                className={`px-4 py-2 text-sm font-semibold leading-4 ml-4 ${
                  activeTab === "unread"
                    ? "text-[#0C45C7] border-b border-[#0C45C7]"
                    : "text-[#A4A4A4]"
                }`}
                onClick={() => setActiveTab("unread")}
              >
                Unread
              </button>
          </div>
  
        {/* Table */}
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full text-sm text-left ">
            <thead className="text-[#252525] font-bold text-sm border-b border-[#D9D9D9]">
              <tr>
                <th className="px-4 py-4 ">Sl.no</th>
                <th className="px-4 py-4 ">Name</th>
                <th className="px-4 py-4 ">Email ID</th>
                <th className="px-4 py-4 ">Message</th>
                <th className="px-4 py-4 ">Date</th>
              </tr>
            </thead>
            <tbody>
              {currentMessages.length > 0 ? (
                currentMessages.map((msg, index) => (
                  <tr
                    key={msg.id}
                    className="hover:bg-[#F8F8F8] border-[#F2F2F2] font-medium text-[#050710] text-sm leading-4 border-b cursor-pointer"
                    onClick={() => handleViewMessage(msg.id)}
                  >
                   <td className="px-4 py-4">
    {String((currentPage - 1) * messagesPerPage + index + 1).padStart(2, "0")}
  </td>
  
                    <td className="px-4 py-4">{msg.name}</td>
                    <td className="px-4 py-4">{msg.email}</td>
                    <td className="px-4 py-4 truncate max-w-xs">
                      {msg.message}
                    </td>
                    <td className="px-4 py-4">
                      {new Date(msg.createdAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 py-6 border"
                  >
                    Nothing to show
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className=""
            >
                <img src={arrowLeft} className="h-6 w-6" alt="prev" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1  rounded-lg ${
                  currentPage === i + 1
                    ? "bg-[#F9F9FB] text-[#304BA0]"
                      : " text-[#696A70"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className=""
            >
                <img src={arrowRight} className="h-5 w-5" alt="next" />
            </button>
          </div>
        )}
        </div>
      </div>
    );
  }
export default EnquiryPage