import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "../../Services/Api";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token"); // Get the token from sessionStorage

      const response = await Api.get(`api/user/${id}`, {
        Authorization: `Bearer ${token}`, // Pass it in the header
      });

      console.log("Fetched users:", response.data);
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!user) return null;

  return (
    <div className="p-6 space-y-28 min-h-screen">
      <h1 className="text-2xl font-bold">User Details</h1>
      <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-lg rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Name:</strong> {user.name}
          </div>
          <div>
            <strong>User ID:</strong> {user.id}
          </div>
          <div>
            <strong>Phone Number:</strong> {user.mobileNumber}
          </div>
          <div>
            <strong>City/Street Name:</strong> {user.city}
          </div>
          <div>
            <strong>Status:</strong> {user.state}
          </div>
          <div>
            <strong>Signup Date:</strong> {user.createdAt}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
