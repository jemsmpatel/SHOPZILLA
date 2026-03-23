import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { sellerLogout } from "../redux/features/seller/sellerauthSlice";
import { useSellerLogoutMutation } from "../redux/api/seller";
import { toast } from "react-toastify";

function Layout() {
  const { sellerInfo } = useSelector((state) => state.sellerAuth);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [Logout] = useSellerLogoutMutation();
  const dispatch = useDispatch();
  const HandleLogout = async () => {
    await Logout();
    dispatch(sellerLogout());
    toast.success("You Are Successfully Logout.");
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR --- */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-16"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-xl tracking-tight">
              SHOP SELLER
            </span>
          )}
        </div>

        <nav className="flex-1 px-2 space-y-2 mt-4">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            to={"/seller/dashboard"}
            isOpen={isSidebarOpen}
          />
          <NavItem
            icon={<ShoppingBag size={20} />}
            label="Products"
            to={"/seller/products"}
            isOpen={isSidebarOpen}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Orders"
            to={"/seller/orders"}
            isOpen={isSidebarOpen}
          />
          {/* <NavItem
            icon={<BarChart3 size={20} />}
            label="Analytics"
            to={"/seller/Analytics"}
            isOpen={isSidebarOpen}
          /> */}
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            to={"/seller/Settings"}
            isOpen={isSidebarOpen}
          />
        </nav>

        <div className="p-2 border-t border-gray-100">
          <button
            onClick={HandleLogout}
            className="flex items-center gap-4 text-gray-500 hover:text-red-500 w-full px-4 py-3 transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="text-right hidden sm:block">
            <p className="text-xl capitalize font-bold text-gray-800">
              {sellerInfo?.fname}
            </p>
            {/* <p className="text-xs text-gray-500">SELLER</p> */}
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Link
              to={"/seller/profile"}
              className="flex items-center gap-3 border-l pl-6"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 capitalize">
                  {sellerInfo?.fname}
                </p>
                <p className="text-xs text-gray-500">SELLER</p>
              </div>
              <img
                src={`https://ui-avatars.com/api/?name=${sellerInfo?.fname}&background=f97316&color=fff`}
                className="w-10 h-10 rounded-xl shadow-sm"
                alt="profile"
              />
              {/* <img src="https://ui-avatars.com/api/?name=Admin&background=f97316&color=fff" className="w-10 h-10 rounded-xl shadow-sm" alt="profile" /> */}
            </Link>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS FOR CLEAN CODE ---

const NavItem = ({ icon, label, to, isOpen }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive
        ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
        : "text-gray-500 hover:bg-orange-50 hover:text-orange-500"
      }`
    }
  >
    {icon}
    {isOpen && <span className="font-semibold">{label}</span>}
  </NavLink>
);

export default Layout;
