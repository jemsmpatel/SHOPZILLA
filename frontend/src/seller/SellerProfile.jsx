import React from 'react';
import { useSellerProfileQuery } from '../redux/api/seller';
import { Link } from 'react-router-dom';

function SellerProfile() {

    const { data: sellerData, isLoading, error } = useSellerProfileQuery();

    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">Profile fetch failed</div>;
    }

    return (
        <div className="sm:p-8 p-4 overflow-y-auto">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Seller Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl text-center">
                    <img
                        src={`https://ui-avatars.com/api/?name=${sellerData?.fname}&background=f97316&color=fff`}
                        alt="Seller"
                        className="w-28 h-28 rounded-full mx-auto border-4 border-green-400"
                    />

                    <h2 className="text-2xl capitalize font-semibold mt-4">
                        {sellerData?.shop_name}
                    </h2>

                    <p className={`mt-2 font-bold text-xl ${sellerData?.status === "APPROVED"
                        ? "text-green-600"
                        : sellerData?.status === "REJECTED"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}>
                        {sellerData?.status}
                    </p>

                    <Link to={'/seller/profile/edit'}>
                        <button className="mt-6 w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition">
                            Edit Profile
                        </button>
                    </Link>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Store Information */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl text-gray-900">
                        <h3 className="text-xl font-semibold mb-4">Store Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <Info label="Owner Name" value={sellerData?.fname} />
                            <Info label="Email" value={sellerData?.email} />
                            <Info label="Phone" value={sellerData?.contact} />

                            <Info
                                label="Shop Address"
                                value={`${sellerData?.shop_address}, ${sellerData?.shop_city}, ${sellerData?.shop_state}, ${sellerData?.shop_country}`}
                            />

                            <Info label="GST Number" value={sellerData?.gst_no} />
                            <Info label="PAN Number" value={sellerData?.pan_no} />

                            <Info label="Bank Name" value={sellerData?.bank_name} />
                            <Info
                                label="Account Holder"
                                value={sellerData?.bank_account_holder_name}
                            />

                            <Info label="IFSC Code" value={sellerData?.bank_IFSC_code} />

                            {/* Masked Account Number */}
                            <Info
                                label="Account Number"
                                value={
                                    sellerData?.bank_account_no
                                        ? "XXXXXX" +
                                        sellerData.bank_account_no.toString().slice(-4)
                                        : ""
                                }
                            />

                            <Info
                                label="Joined On"
                                value={
                                    sellerData?.createdAt
                                        ? new Date(sellerData.createdAt).toLocaleDateString()
                                        : ""
                                }
                            />

                        </div>
                    </div>

                    {/* Rejection Reason (If Any) */}
                    {sellerData?.status === "REJECTED" && sellerData?.rejectionReason && (
                        <div className="bg-red-100 text-red-700 p-4 rounded-xl">
                            <strong>Rejection Reason:</strong> {sellerData.rejectionReason}
                        </div>
                    )}

                    {/* Blocked Reason */}
                    {!sellerData?.isActive && sellerData?.blockedReason && (
                        <div className="bg-red-100 text-red-700 p-4 rounded-xl">
                            <strong>Blocked Reason:</strong> {sellerData.blockedReason}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

const Info = ({ label, value }) => (
    <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-medium">{value}</p>
    </div>
);

export default SellerProfile