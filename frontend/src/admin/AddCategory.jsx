import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";

import {
  useCreateCategoryMutation,
  useGetallcategoryQuery,
} from "../redux/api/Category";

import { useUploadMediaMutation } from "../redux/api/seller";

function AddCategory() {
  const navigate = useNavigate();

  const { data } = useGetallcategoryQuery("tree=true");

  const categories = Array.isArray(data?.data) ? data.data : [];

  const [createCategory] = useCreateCategoryMutation();
  const [uploadMedia] = useUploadMediaMutation();

  const [selectedParent, setSelectedParent] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // -------------------
  // NAME CHANGE
  // -------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const slug = slugify(value, { lower: true });

      setFormData({
        ...formData,
        name: value,
        slug,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // -------------------
  // IMAGE
  // -------------------

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // -------------------
  // SUBMIT
  // -------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      if (imageFile) {
        const form = new FormData();
        form.append("image", imageFile);

        const res = await uploadMedia(form).unwrap();

        imageUrl = res?.data?.url || "";
      }

      const parent_id = selectedSub || selectedParent || null;

      const payload = {
        ...formData,
        parent_id,
        image: imageUrl,
      };

      await createCategory(payload).unwrap();

      toast.success("Category created successfully");

      navigate("/admin/category");
    } catch {
      toast.error("Failed to create category");
    }
  };

  // -------------------
  // GET SUB CATEGORIES
  // -------------------

  const selectedParentCategory = categories.find(
    (cat) => cat._id === selectedParent,
  );

  const subCategories = selectedParentCategory?.subCategories || [];

  return (
    <div className="p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Add Category</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 space-y-4"
      >
        {/* NAME */}

        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* SLUG */}

        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* PARENT CATEGORY */}

        <select
          value={selectedParent}
          onChange={(e) => {
            setSelectedParent(e.target.value);
            setSelectedSub("");
          }}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Parent Category</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* SUB CATEGORY */}

        {selectedParent && (
          <select
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Sub Category (Optional)</option>

            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        )}

        {/* DESCRIPTION */}

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* IMAGE */}

        <input type="file" accept="image/*" onChange={handleImage} />

        {imagePreview && (
          <img src={imagePreview} className="w-32 h-32 object-cover rounded" />
        )}

        {/* STATUS */}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={() =>
              setFormData({
                ...formData,
                isActive: !formData.isActive,
              })
            }
          />
          Active
        </label>

        {/* BUTTON */}

        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Create Category
        </button>
      </form>
    </div>
  );
}

export default AddCategory;
