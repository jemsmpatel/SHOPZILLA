import React from "react";
import { Link } from "react-router-dom";
import { Lock, User, Settings } from "lucide-react";

function SellerSettings() {
  const settingsLinks = [
    {
      title: "Change Password",
      description: "Update your account password",
      icon: <Lock size={20} />,
      path: "/seller/change-password",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Settings size={26} className="text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-800">Seller Settings</h2>
        </div>

        <div className="bg-white rounded-xl shadow border">
          {settingsLinks.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center justify-between p-5 hover:bg-gray-50 border-b last:border-b-0 transition"
            >
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                  {item.icon}
                </div>

                <div>
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>

              <span className="text-gray-400 text-xl">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SellerSettings;
