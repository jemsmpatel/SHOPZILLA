import React from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useGetAllProductsQuery } from "../redux/api/products";

function CategoryViewAll() {
  const { id } = useParams();

  const { data, isLoading } = useGetAllProductsQuery(
    `?category_id=${id}&limit=50`,
  );

  const products = data?.products || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Category Products</h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <ProductCard
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                oldPrice={item.mrp_price}
                image={item.images?.[0]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryViewAll;
