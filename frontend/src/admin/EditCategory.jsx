import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";

import {
  useUpdateCategoryMutation,
  useGetCategoryByIdQuery,
  useGetallcategoryQuery,
} from "../redux/api/Category";

import { useUploadMediaMutation } from "../redux/api/seller";

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data } = useGetCategoryByIdQuery(id);
  const { data: catData } = useGetallcategoryQuery("tree=true");

  const categories = Array.isArray(catData?.data) ? catData.data : [];

  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
  const [uploadMedia, { isLoading: mediaIsLoading }] = useUploadMediaMutation();

  const [selectedParent, setSelectedParent] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // -----------------------
  // LOAD CATEGORY
  // -----------------------

  useEffect(() => {
    if (data?.data && categories.length > 0) {
      const cat = data.data;

      const parentId =
        typeof cat.parent_id === "object" ? cat.parent_id?._id : cat.parent_id;

      setFormData({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || "",
        isActive: cat.isActive,
      });

      setImagePreview(cat.image || "");

      if (parentId) {
        // check if direct parent
        const parent = categories.find((c) => c._id === parentId);

        if (parent) {
          setSelectedParent(parent._id);
        } else {
          // check inside subcategories
          for (let p of categories) {
            const sub = p.subCategories?.find((s) => s._id === parentId);

            if (sub) {
              setSelectedParent(p._id);
              setSelectedSub(sub._id);
              break;
            }
          }
        }
      }
    }
  }, [data, categories]);

  // -----------------------
  // NAME CHANGE
  // -----------------------

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

  // -----------------------
  // IMAGE
  // -----------------------

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // -----------------------
  // SUBMIT
  // -----------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = imagePreview;

      if (imageFile) {
        const form = new FormData();
        form.append("image", imageFile);

        const res = await uploadMedia(form).unwrap();

        imageUrl = res?.data?.url;
      }

      const parent_id = selectedSub || selectedParent || null;

      const payload = {
        ...formData,
        parent_id,
        image: imageUrl,
      };

      await updateCategory({
        id,
        data: payload,
      }).unwrap();

      toast.success("Category updated successfully");

      navigate("/admin/category");
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  // -----------------------
  // SUB CATEGORY LIST
  // -----------------------

  const selectedParentCategory = categories.find(
    (cat) => cat._id === selectedParent,
  );

  const subCategories = selectedParentCategory?.subCategories || [];

  return (
    <div className="p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>

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

            {subCategories
              .filter((sub) => sub._id !== id)
              .map((sub) => (
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
          disabled={isLoading || mediaIsLoading}
          className="bg-orange-500 text-white px-4 py-2 rounded flex items-center gap-2 disabled:bg-gray-400"
        >
          {(isLoading || mediaIsLoading) && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {isLoading || mediaIsLoading ? "Updating..." : "Update Category"}
        </button>
      </form>
    </div>
  );
}

export default EditCategory;
