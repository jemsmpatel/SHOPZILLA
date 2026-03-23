import React, { useState, useEffect } from "react";
import { useSellerProfileQuery, useSellerUpdateUserMutation } from "../redux/api/seller";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EditSellerProfile() {

    const { data: sellerData } = useSellerProfileQuery();
    const [updateProfile, { isLoading }] = useSellerUpdateUserMutation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fname: "",
        contact: "",
        shop_name: "",
        shop_address: "",
        shop_city: "",
        shop_state: "",
        shop_country: "",
        bank_name: "",
        bank_account_holder_name: "",
        bank_IFSC_code: "",
    });

    useEffect(() => {
        if (sellerData) {
            setFormData({
                fname: sellerData.fname || "",
                contact: sellerData.contact || "",
                shop_name: sellerData.shop_name || "",
                shop_address: sellerData.shop_address || "",
                shop_city: sellerData.shop_city || "",
                shop_state: sellerData.shop_state || "",
                shop_country: sellerData.shop_country || "",
                bank_name: sellerData.bank_name || "",
                bank_account_holder_name: sellerData.bank_account_holder_name || "",
                bank_IFSC_code: sellerData.bank_IFSC_code || "",
            });
        }
    }, [sellerData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData).unwrap();
            toast.success("Profile Updated Successfully");
            navigate("/seller/profile");
        } catch (error) {
            toast.error("Update Failed");
        }
    };

    return (
        <div className="sm:p-8 p-4 overflow-y-auto">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-xl">

                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <Input label="Owner Name" name="fname" value={formData.fname} onChange={handleChange} />
                    <Input label="Phone" name="contact" value={formData.contact} onChange={handleChange} />
                    <Input label="Shop Name" name="shop_name" value={formData.shop_name} onChange={handleChange} />
                    <Input label="Shop Address" name="shop_address" value={formData.shop_address} onChange={handleChange} />
                    <Input label="City" name="shop_city" value={formData.shop_city} onChange={handleChange} />
                    <Input label="State" name="shop_state" value={formData.shop_state} onChange={handleChange} />
                    <Input label="Country" name="shop_country" value={formData.shop_country} onChange={handleChange} />
                    <Input label="Bank Name" name="bank_name" value={formData.bank_name} onChange={handleChange} />
                    <Input label="Account Holder" name="bank_account_holder_name" value={formData.bank_account_holder_name} onChange={handleChange} />
                    <Input label="IFSC Code" name="bank_IFSC_code" value={formData.bank_IFSC_code} onChange={handleChange} />

                    <div className="md:col-span-2 flex gap-4 mt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl"
                        >
                            {isLoading ? "Updating..." : "Update Profile"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/seller/profile")}
                            className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-xl"
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
            {...props}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
    </div>
);

export default EditSellerProfile;