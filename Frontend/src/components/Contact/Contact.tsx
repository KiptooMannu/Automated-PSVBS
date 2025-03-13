import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { ApiDomain } from "../../utils/ApiDomain";
import { RootState } from "../../app/store";

const Contact = () => {
  const navigate = useNavigate();

  // ✅ Extract user correctly from Redux
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  // ✅ Extract user correctly from localStorage (handling nested structure)
  const storedData = JSON.parse(localStorage.getItem("user") || "null");
  const storedUser = storedData?.user || storedData;

  // ✅ Determine the final user data
  const user = reduxUser?.user_id ? reduxUser : storedUser?.user_id ? storedUser : null;

  // ✅ Use constants instead of state (since they don’t change dynamically)
  const [fullName, setFullName] = useState(user ? `${user.first_name} ${user.last_name}` : "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Redirect to login if user is missing
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("user") || "null"); // ✅ Get user from local storage
    const storedUser = storedData?.user || storedData; // Handle nested structure

    if (reduxUser?.user_id) {
      setFullName(`${reduxUser.first_name} ${reduxUser.last_name}`);
      setEmail(reduxUser.email);
    } else if (storedUser?.user_id) {
      setFullName(`${storedUser.first_name} ${storedUser.last_name}`);
      setEmail(storedUser.email);
    } else {
      setFullName("");
      setEmail("");
    }
  }, [reduxUser]); // ✅ Run when Redux user changes

  // ✅ Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.warning("You must be logged in to send a message!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${ApiDomain}contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name: fullName, email, subject, message }),
      });

      if (!response.ok) throw new Error("Failed to submit message");

      // ✅ Show success toast
      toast.success("Message sent successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Clear form fields
      setSubject("");
      setMessage("");
    } catch (error) {
      // ✅ Show error toast
      toast.error("Error sending message. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Toast Container */}
      <ToastContainer />

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Contact Us
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Display */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">
              Full Name
            </label>
            <p className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
              {fullName || "Loading..."}
            </p>
          </div>

          {/* Email Display */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">
              Email
            </label>
            <p className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
              {email || "Loading..."}
            </p>
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-gray-600 text-sm font-medium">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-gray-600 text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;