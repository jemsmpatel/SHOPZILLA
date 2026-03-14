import React, { useState } from 'react';
import { Plus, Edit, Eye, Trash2, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDeleteProductMutation, useGetSellerAllProductsQuery } from "../redux/api/products";
import { toast } from 'react-toastify';

function Products() {

    const [page, setPage] = useState(1);
    const [searchSku, setSearchSku] = useState("");
    const [searchParams] = useSearchParams();

    const limit = Number(searchParams.get("limit")) || 100;

    const { data, isLoading, error, refetch } = useGetSellerAllProductsQuery(`?page=${page}&limit=${limit}`);

    const [DeleteProducte, { isLoading: delete_isLoading }] = useDeleteProductMutation();

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">Something went wrong</div>;

    const products = Array.isArray(data?.products) ? data.products : [];
    const totalPages = data?.totalPages || 1;

    const filteredProducts = products.filter((product) =>
        product?.sku?.toLowerCase().includes(searchSku.toLowerCase())
    );

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");

        if (!confirmDelete) return;

        try {
            await DeleteProducte(id);
            refetch();
            toast.success("Product deleted successfully");
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    return (
        <div className="p-6 space-y-6 overflow-y-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
                    <p className="text-sm text-gray-500">Manage your store inventory</p>
                </div>

                {/* SEARCH */}
                <div className="relative">
                    <Search size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        placeholder="Search by SKU..."
                        value={searchSku}
                        onChange={(e) => setSearchSku(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                <Link
                    to="/seller/products/add"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md"
                >
                    <Plus size={20} />
                    Add Product
                </Link>

            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">

                <table className="w-full text-left border-collapse min-w-max">

                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Brand</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Tax</th>
                            <th className="px-6 py-4">Active</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Stock Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">

                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center py-10 text-gray-400">
                                    No Product Found
                                </td>
                            </tr>
                        )}

                        {filteredProducts.map((product) => {

                            const image = product?.images?.[0] || "";
                            const stock = product?.stock ?? 0;

                            return (
                                <tr key={product?._id} className="hover:bg-gray-50">

                                    <td className="px-6 py-4 flex items-center gap-4">
                                        {image && (
                                            <img
                                                src={image}
                                                alt={product?.name}
                                                className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm"
                                            />
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-800 truncate max-w-[150px]">
                                                {product?.name}
                                            </p>
                                            <p className="text-xs text-gray-500 line-clamp-1 truncate max-w-[150px]">
                                                {product?.sku}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">{product?.brand}</td>

                                    <td className="px-6 py-4 font-bold">
                                        ₹{product?.price}
                                    </td>

                                    <td className="px-6 py-4">{product?.tax}%</td>

                                    <td className="px-6 py-4">
                                        {product?.isActive ? "True" : "False"}
                                    </td>

                                    <td className="px-6 py-4">{stock}</td>

                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                                            ${stock > 0
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-600"
                                            }`}>
                                            {stock > 0 ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">

                                        <div className="flex justify-center gap-3">

                                            <Link
                                                to={`/seller/products/${product?._id}`}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>

                                            <Link
                                                to={`/seller/products/edit/${product?._id}`}
                                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
                                            >
                                                <Edit size={18} />
                                            </Link>

                                            <button
                                                disabled={delete_isLoading}
                                                onClick={() => handleDelete(product?._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </div>

            {/* PAGINATION */}

            {totalPages > 1 && (

                <div className="flex justify-center items-center gap-2">

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 border rounded-lg disabled:opacity-40"
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => {

                        const pageNumber = i + 1;

                        return (
                            <button
                                key={pageNumber}
                                onClick={() => setPage(pageNumber)}
                                className={`px-3 py-1 rounded-lg border
                                    ${page === pageNumber
                                        ? "bg-orange-500 text-white"
                                        : "bg-white"
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        );

                    })}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1 border rounded-lg disabled:opacity-40"
                    >
                        Next
                    </button>

                </div>

            )}

        </div>
    );
}

export default Products;