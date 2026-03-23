import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useDeleteCategoryMutation,
  useGetallcategoryQuery,
  useToggleCategoryStatusMutation,
} from "../redux/api/Category";

function AdminCategorys() {
  const [searchName, setSearchName] = useState("");
  const [openCategories, setOpenCategories] = useState({});

  const { data, isLoading, error, refetch } =
    useGetallcategoryQuery("tree=true");

  const [deleteCategory] = useDeleteCategoryMutation();
  const [toggleStatus] = useToggleCategoryStatusMutation();

  if (isLoading) return <div className="p-8">Loading...</div>;

  if (error)
    return <div className="p-8 text-red-500">Something went wrong</div>;

  const categories = Array.isArray(data?.data) ? data.data : [];

  const toggleCollapse = (id) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmDelete) return;

    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success("Category status updated");
      refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const CategoryRow = ({ category, level = 0 }) => {
    const isMatch = category.name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());

    const hasChildren = category?.subCategories?.length > 0;

    if (searchName && !isMatch && !hasChildren) return null;

    const isOpen = openCategories[category._id];

    let bgColor = "bg-white";

    if (level === 1) bgColor = "bg-gray-300";
    if (level >= 2) bgColor = "bg-orange-100";

    return (
      <>
        <tr className={`${bgColor} hover:bg-gray-100`}>
          <td className="px-6 py-4">
            <div
              className="flex items-center gap-3"
              style={{ marginLeft: `${level * 25}px` }}
            >
              {hasChildren && (
                <button
                  onClick={() => toggleCollapse(category._id)}
                  className="text-gray-500 hover:text-black"
                >
                  {isOpen ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
              )}

              {category?.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-10 h-10 rounded-lg object-cover border"
                />
              )}

              <span className="font-semibold text-gray-800">
                {category.name}
              </span>
            </div>
          </td>

          <td className="px-6 py-4 text-gray-600">{category.slug}</td>

          <td className="px-6 py-4">
            <button
              onClick={() => handleToggleStatus(category._id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold
              ${category.isActive
                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                  : "bg-red-100 text-red-600 hover:bg-red-200"
                }`}
            >
              {category.isActive ? "Active" : "Inactive"}
            </button>
          </td>

          <td className="px-6 py-4">
            <div className="flex justify-center gap-3">
              <Link
                to={`/admin/category/edit/${category._id}`}
                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
              >
                <Edit size={18} />
              </Link>

              <button
                onClick={() => handleDelete(category._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </td>
        </tr>

        {isOpen &&
          category?.subCategories?.map((sub) => (
            <CategoryRow key={sub._id} category={sub} level={level + 1} />
          ))}
      </>
    );
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Categories</h1>
          <p className="text-sm text-gray-500">Manage product categories</p>
        </div>

        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search Category..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <Link
          to="/admin/category/add"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md"
        >
          <Plus size={20} />
          Add Category
        </Link>
      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Active</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  No Categories Found
                </td>
              </tr>
            )}

            {categories.map((cat) => (
              <CategoryRow key={cat._id} category={cat} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCategorys;
