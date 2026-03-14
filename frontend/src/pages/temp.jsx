import React, { useEffect, useState } from "react";

const Temp = ({ initialData, onSubmit, title }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: [{ key: '', value: '' }], // Mixed type ke liye array of objects
        mrp_price: '',
        price: '',
        discount_rate: '',
        category_id: '',
        stock: '',
        sku: '',
        tax: '',
        brand: '',
        imageFiles: [],
    });

    const [isJsonMode, setIsJsonMode] = useState(false);
    const [jsonText, setJsonText] = useState('');
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData, imageFiles: [] });
            setPreviews(initialData.images || (initialData.image ? [initialData.image] : []));
            // Initial description ko JSON string mein convert karna toggle ke liye
            setJsonText(JSON.stringify(initialData.description, null, 2));
        }
    }, [initialData]);

    // --- Description Logic ---
    const addDescriptionField = () => {
        setFormData({ ...formData, description: [...formData.description, { key: '', value: '' }] });
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
        setJsonText(e.target.value);
        try {
            const parsed = JSON.parse(e.target.value);
            setFormData({ ...formData, description: parsed });
        } catch (err) {
            // Invalid JSON syntax handle (silent)
        }
    };

    const toggleMode = () => {
        if (!isJsonMode) {
            setJsonText(JSON.stringify(formData.description, null, 2));
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
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index) => {
        const updatedFiles = formData.imageFiles.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setFormData({ ...formData, imageFiles: updatedFiles });
        setPreviews(updatedPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = new FormData();

        Object.keys(formData).forEach(key => {
            if (key === 'description') {
                finalData.append(key, JSON.stringify(formData[key])); // Backend expects Mixed, so stringify it
            } else if (key !== 'imageFiles') {
                finalData.append(key, formData[key]);
            }
        });

        formData.imageFiles.forEach((file) => {
            finalData.append(`images`, file);
        });

        onSubmit(formData, finalData);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
            <h2 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight border-b-4 border-orange-500 w-fit pb-2">
                {title}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Product Name</label>
                        <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Brand Name</label>
                        <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
                    </div>
                </div>

                {/* --- Advanced Description Section --- */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-semibold text-gray-700">Specifications / Description (Key-Value)</label>
                        <button type="button" onClick={toggleMode} className="text-xs bg-gray-200 px-3 py-1 rounded-full font-bold hover:bg-orange-100 hover:text-orange-600 transition-all">
                            {isJsonMode ? "Switch to UI Mode" : "Switch to JSON Mode"}
                        </button>
                    </div>

                    {isJsonMode ? (
                        <textarea
                            className="w-full p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-xl outline-none"
                            rows="6"
                            value={jsonText}
                            onChange={handleJsonChange}
                            placeholder='[{"key": "Color", "value": "Blue"}]'
                        />
                    ) : (
                        <div className="space-y-3">
                            {formData.description.map((item, index) => (
                                <div key={index} className="flex gap-3 items-center">
                                    <input placeholder="Key (e.g. Color)" className="flex-1 p-3 bg-white border border-gray-200 rounded-lg text-sm outline-none" value={item.key} onChange={(e) => handleDescChange(index, 'key', e.target.value)} />
                                    <input placeholder="Value (e.g. Blue)" className="flex-1 p-3 bg-white border border-gray-200 rounded-lg text-sm outline-none" value={item.value} onChange={(e) => handleDescChange(index, 'value', e.target.value)} />
                                    <button type="button" onClick={() => removeDescriptionField(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">✕</button>
                                </div>
                            ))}
                            <button type="button" onClick={addDescriptionField} className="text-sm text-orange-600 font-bold mt-2">+ Add Specification</button>
                        </div>
                    )}
                </div>

                {/* Pricing & Stock Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">MRP (₹)</label>
                        <input type="number" className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none" value={formData.mrp_price} onChange={(e) => setFormData({ ...formData, mrp_price: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Price (₹)</label>
                        <input type="number" className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Discount (%)</label>
                        <input type="number" className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none" value={formData.discount_rate} onChange={(e) => setFormData({ ...formData, discount_rate: e.target.value })} required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label className="block text-sm font-semibold text-gray-600 mb-2">Stock</label><input type="number" className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required /></div>
                    <div><label className="block text-sm font-semibold text-gray-600 mb-2">SKU</label><input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} required /></div>
                    <div><label className="block text-sm font-semibold text-gray-600 mb-2">Tax (%)</label><input type="number" className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none" value={formData.tax} onChange={(e) => setFormData({ ...formData, tax: e.target.value })} required /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-semibold text-gray-600 mb-2">Category ID</label><input type="number" className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} required /></div>
                </div>

                {/* Images section */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50 hover:border-orange-400">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
                        {previews.map((src, index) => (
                            <div key={index} className="relative group">
                                <img src={src} alt="Preview" className="h-20 w-full object-cover rounded-lg shadow-md border" />
                                <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600">✕</button>
                            </div>
                        ))}
                        {previews.length < 6 && (
                            <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-20 bg-white hover:bg-orange-50">
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} multiple />
                                <span className="text-xl text-gray-400">+</span>
                                <span className="text-[8px] text-gray-400 font-bold uppercase text-center">Add Photo</span>
                            </label>
                        )}
                    </div>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transform transition active:scale-95">
                    {initialData ? "🚀 Update Changes" : "➕ List Product"}
                </button>
            </form>
        </div>
    );
}

export default Temp;