import React from "react";
import { useSelector } from "react-redux";
import Button from "../../components/UI/Button";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../hooks/auth/useUserData";

function ProfilePage() {
  // State and handlers would go here
  const { userData } = useUserData(); // Use useUserData for user data

  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 p-8">
      <div className="container mx-auto bg-white shadow rounded-lg p-6">
        <div className="border-b pb-4">
          <h1 className="text-lg font-semibold">Profile Info</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              disabled
              type="email"
              className="w-full border-gray-300 rounded shadow-sm"
              value={userData.email} // Use actual state or props
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First name
              </label>
              <input
                disabled
                type="text"
                className="w-full border-gray-300 rounded shadow-sm"
                placeholder="First name"
                value={userData.name}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last name
              </label>
              <input
                type="text"
                className="w-full border-gray-300 rounded shadow-sm"
                placeholder="Last name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone number
            </label>
            <div className="flex items-center">
              <input
                type="tel"
                className="w-full border-gray-300 rounded shadow-sm mr-2"
                disabled
                value="+966-54-0077852" // Use actual state or props
              />
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Birthday</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded shadow-sm"
                placeholder="MM | DD | YYYY"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Gender</label>
              <div className="flex items-center">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 mr-4"
                >
                  Male
                </button>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Female
                </button>
              </div>
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            navigate("/update-password");
          }}
          className={"mt-5"}
        >
          Update password
        </Button>
      </div>
    </div>
  );
}

export default ProfilePage;
