import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUploadMediaMutation } from "../redux/api/seller";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetallcategoryQuery } from "../redux/api/Category";
import { useAdminproductcreateMutation } from "../redux/api/admin";

function AdminAddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: [{ key: "", value: "" }], // Mixed type ke liye array of objects
    mrp_price: "",
    price: "",
    category_id: "",
    stock: "",
    sku: "",
    tax: "",
    brand: "",
    imageFiles: [],
    bgGenerate: false,
    bgRemove: false,
    bgPrompt: "",
  });
  const { data: response } = useGetallcategoryQuery("tree=true&active=true");
  const { adminInfo } = useSelector((state) => state.adminAuth);
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [previews, setPreviews] = useState([]);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [lastCategory, setLastCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [lastCategories, setLastCategories] = useState([]);
  const [createProduct] = useAdminproductcreateMutation();
  const [uploadMedia] = useUploadMediaMutation();

  useEffect(() => {
    if (response?.data) {
      setCategories(response.data);
    }
  }, [response]);

  const handleMainCategoryChange = (e) => {
    const selectedId = e.target.value;
    setMainCategory(selectedId);
    setSubCategory("");
    setLastCategory("");

    const selectedMain = categories.find((cat) => cat._id === selectedId);

    if (selectedMain) {
      setSubCategories(selectedMain.subCategories || []);
    } else {
      setSubCategories([]);
    }

    setLastCategories([]);
  };

  const handleSubCategoryChange = (e) => {
    const selectedId = e.target.value;
    setSubCategory(selectedId);
    setLastCategory("");

    const selectedSub = subCategories.find((cat) => cat._id === selectedId);

    if (selectedSub) {
      setLastCategories(selectedSub.subCategories || []);
    } else {
      setLastCategories([]);
    }
  };

  // --- Description Logic ---
  const addDescriptionField = () => {
    setFormData({
      ...formData,
      description: [...formData.description, { key: "", value: "" }],
    });
  };

  const removeDescriptionField = (index) => {
    const updatedDesc = formData.description.filter((_, i) => i !== index);
    setFormData({ ...formData, description: updatedDesc });
  };

  const handleDescChange = (index, field, val) => {
    const updatedDesc = [...formData.description];
    updatedDesc[index][field] = val;
    setFormData({ ...formData, description: updatedDesc });
  };

  const handleJsonChange = (e) => {
    const value = e.target.value;
    setJsonText(value);

    try {
      const parsed = JSON.parse(value);

      // ✅ If Object → convert to array for UI mode
      if (!Array.isArray(parsed) && typeof parsed === "object") {
        const convertedArray = Object.entries(parsed).map(([key, val]) => ({
          key,
          value: val,
        }));

        setFormData({ ...formData, description: convertedArray });
      }

      // ✅ If Array (old format) → keep as it is
      else if (Array.isArray(parsed)) {
        setFormData({ ...formData, description: parsed });
      }
    } catch (err) {
      // Invalid JSON - silent
    }
  };

  const toggleMode = () => {
    if (!isJsonMode) {
      // Convert array → object before showing in JSON mode
      const obj = {};

      formData.description.forEach((item) => {
        if (item.key && item.value) {
          obj[item.key] = item.value;
        }
      });

      setJsonText(JSON.stringify(obj, null, 2));
    }

    setIsJsonMode(!isJsonMode);
  };
  // --------------------------

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.imageFiles.length + files.length > 6) {
      alert("You can only upload up to 6 images.");
      return;
    }
    const newFiles = [...formData.imageFiles, ...files];
    setFormData({ ...formData, imageFiles: newFiles });
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedFiles = formData.imageFiles.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFormData({ ...formData, imageFiles: updatedFiles });
    setPreviews(updatedPreviews);
  };

  const convertDescriptionToObject = (descArray) => {
    const obj = {};

    descArray.forEach((item) => {
      if (item.key && item.value) {
        obj[item.key] = item.value;
      }
    });

    return obj;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const uploadedImageUrls = [];

      // ✅ Step 1: Upload Images
      for (let file of formData.imageFiles) {
        const imageForm = new FormData();
        imageForm.append("image", file);

        imageForm.append("bgGenerate", formData.bgGenerate);
        imageForm.append("bgRemove", formData.bgRemove);

        if (formData.bgGenerate && formData.bgPrompt) {
          imageForm.append("bgPrompt", formData.bgPrompt);
        }

        const res = await uploadMedia(imageForm).unwrap();
        uploadedImageUrls.push(res.data.url);
      }

      // ✅ Step 2: Prepare Final Product Data
      const finalProductData = {
        seller_id: adminInfo?._id,
        name: formData.name,
        brand: formData.brand,
        mrp_price: formData.mrp_price,
        price: formData.price,
        category_id: lastCategory || subCategory || mainCategory,
        stock: formData.stock,
        sku: formData.sku,
        tax: formData.tax,
        description: convertDescriptionToObject(formData.description),
        images: uploadedImageUrls,
      };

      // ✅ Step 3: Create Product
      await createProduct(finalProductData).unwrap();
      navigate("/admin/products");

      toast.success("Product Created Successfully ✅");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Something went wrong ❌");
    }
    setIsLoading(false);
  };

  return (
    <div className="sm:p-10 p-3 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight border-b-4 border-orange-500 w-fit pb-2">
          Create Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Product Name
              </label>
              <input
                type="text"
                className="w-full sm:p-4 p-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                className="w-full sm:p-4 p-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* --- Advanced Description Section --- */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <label className="text-sm font-semibold text-gray-700">
                Specifications / Description (Key-Value)
              </label>

              <button
                type="button"
                onClick={toggleMode}
                className="text-xs bg-gray-200 px-3 py-1 rounded-full font-bold hover:bg-orange-100 hover:text-orange-600 transition-all w-fit"
              >
                {isJsonMode ? "Switch to UI Mode" : "Switch to JSON Mode"}
              </button>
            </div>

            {isJsonMode ? (
              <textarea
                className="w-full p-3 sm:p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-xl outline-none resize-none"
                rows="8"
                value={jsonText}
                onChange={handleJsonChange}
                placeholder='[{"key": "Color", "value": "Blue"}]'
              />
            ) : (
              <div className="space-y-3">
                {formData.description.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 sm:items-center"
                  >
                    <input
                      placeholder="Key (e.g. Color)"
                      className="w-full sm:flex-1 p-3 bg-white border border-gray-200 rounded-lg text-sm outline-none"
                      value={item.key}
                      onChange={(e) =>
                        handleDescChange(index, "key", e.target.value)
                      }
                    />

                    <input
                      placeholder="Value (e.g. Blue)"
                      className="w-full sm:flex-1 p-3 bg-white border border-gray-200 rounded-lg text-sm outline-none"
                      value={item.value}
                      onChange={(e) =>
                        handleDescChange(index, "value", e.target.value)
                      }
                    />

                    <button
                      type="button"
                      onClick={() => removeDescriptionField(index)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg self-end sm:self-auto"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addDescriptionField}
                  className="text-sm text-orange-600 font-bold mt-2"
                >
                  + Add Specification
                </button>
              </div>
            )}
          </div>

          {/* Pricing & Stock Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                MRP (₹)
              </label>
              <input
                type="number"
                className="w-full sm:p-4 p-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                value={formData.mrp_price}
                onChange={(e) =>
                  setFormData({ ...formData, mrp_price: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                className="w-full sm:p-4 p-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Stock
              </label>
              <input
                type="number"
                className="w-full sm:p-4 p-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                SKU
              </label>
              <input
                type="text"
                className="w-full sm:p-4 p-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                GST (%)

                {/* Info Icon */}
                <div className="relative group cursor-pointer">
                  <span className="text-blue-500 text-xs border border-blue-500 rounded-full px-2 py-0.5">
                    i
                  </span>

                  {/* Tooltip */}
                  <div className="absolute left-0 top-6 z-50 hidden group-hover:block w-80 bg-black text-white text-xs rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-1">GST Guide (India):</p>

                    <ul className="space-y-1">
                      {/* Clothing */}
                      <li>👕 <b>Clothing:</b></li>
                      <li>• ≤ ₹2500 → 5% (Shirts, T-shirts, Jeans)</li>
                      <li>• &gt; ₹2500 → 18% (Jackets, Designer wear)</li>

                      {/* 0% */}
                      <li className="mt-2">🟢 <b>0% GST (Essential)</b></li>
                      <li>• Fresh fruits, vegetables</li>
                      <li>• Milk, eggs</li>

                      {/* 5% */}
                      <li className="mt-2">🟡 <b>5% GST</b></li>
                      <li>• Footwear (≤ ₹1000)</li>
                      <li>• Packaged food items</li>
                      <li>• Household essentials</li>

                      {/* 12% */}
                      <li className="mt-2">🟠 <b>12% GST</b></li>
                      <li>• Processed foods</li>
                      <li>• Butter, cheese</li>

                      {/* 18% */}
                      <li className="mt-2">🔵 <b>18% GST (Most common)</b></li>
                      <li>• Mobiles, laptops</li>
                      <li>• Electronics, accessories</li>
                      <li>• Clothing &gt; ₹2500</li>

                      {/* 28% */}
                      <li className="mt-2">🔴 <b>28% GST (Luxury)</b></li>
                      <li>• Luxury items</li>
                      <li>• High-end watches</li>
                      <li>• Premium products</li>

                      {/* Tip */}
                      <li className="mt-2 text-yellow-300">
                        • If unsure → select 18%
                      </li>
                    </ul>
                  </div>
                </div>
              </label>

              <select
                className="w-full sm:p-4 p-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                value={formData.tax}
                onChange={(e) =>
                  setFormData({ ...formData, tax: Number(e.target.value) })
                }
                required
              >
                <option value="">Select GST Rate</option>

                <option value={0}>0% (Essential items)</option>
                <option value={5}>5% (Household goods / Clothing ≤ ₹2500)</option>
                <option value={12}>12% (Processed goods)</option>
                <option value={18}>18% (Most products / Clothing &gt; ₹2500)</option>
                <option value={28}>28% (Luxury items)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main Category */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Main Category
              </label>
              <select
                value={mainCategory}
                onChange={handleMainCategoryChange}
                required
                className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-xl"
              >
                <option value="">Select Main Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Category */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Sub Category
              </label>
              <select
                value={subCategory}
                onChange={handleSubCategoryChange}
                disabled={!subCategories.length}
                className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-xl disabled:bg-gray-200"
              >
                <option value="">Select Sub Category</option>
                {subCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Last Category */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Final Category
              </label>
              <select
                value={lastCategory}
                onChange={(e) => setLastCategory(e.target.value)}
                disabled={!lastCategories.length}
                className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-xl disabled:bg-gray-200"
              >
                <option value="">Select Final Category</option>
                {lastCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Images section */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50 hover:border-orange-400">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
              {previews.map((src, index) => (
                <div key={index} className="relative group">
                  <img
                    src={src}
                    alt="Preview"
                    className="h-20 w-full object-cover rounded-lg shadow-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {previews.length < 6 && (
                <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-20 bg-white hover:bg-orange-50">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                  />
                  <span className="text-xl text-gray-400">+</span>
                  <span className="text-[8px] text-gray-400 font-bold uppercase text-center">
                    Add Photo
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Background Options */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* BG Generate */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.bgGenerate}
                  onChange={(e) =>
                    setFormData({ ...formData, bgGenerate: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Background Generate
                </span>
              </label>

              {/* BG Remove */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.bgRemove}
                  onChange={(e) =>
                    setFormData({ ...formData, bgRemove: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Background Remove
                </span>
              </label>
            </div>

            {/* Show Prompt only if bgGenerate true */}
            {formData.bgGenerate && (
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Background Prompt
                </label>
                <input
                  type="text"
                  placeholder="Enter background prompt..."
                  value={formData.bgPrompt}
                  onChange={(e) =>
                    setFormData({ ...formData, bgPrompt: e.target.value })
                  }
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm outline-none"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transform transition active:scale-95"
          >
            {isLoading ? "Creatting..." : "List Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminAddProduct;
