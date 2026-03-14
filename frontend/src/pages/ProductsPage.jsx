import React from "react";
import { useSearchParams } from "react-router-dom";
import { useGetAllProductsQuery } from "../redux/api/products";
import ProductCard from "../components/ProductCard";

function ProductsPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";

  const { data, isLoading } = useGetAllProductsQuery(
    `?type=${type}&page=1&limit=20`,
  );

  const products = data?.products || [];

  return (
    <div className="max-w-[1400px] mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {type.replace("_", " ")}
      </h1>

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
  );
}

export default ProductsPage;
