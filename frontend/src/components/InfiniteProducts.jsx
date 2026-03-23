import React, { useState, useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import { useGetAllProductsQuery } from "../redux/api/products";

function InfiniteProducts({ query = "" }) {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);

  const totalPagesRef = useRef(null);
  const loadingRef = useRef(false);

  const { data, isLoading } = useGetAllProductsQuery(
    `${query ? `?${query}&` : "?"}page=${page}&limit=12`,
  );

  // reset when query change
  useEffect(() => {
    setProducts([]);
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (!data) return;

    setProducts((prev) => [...prev, ...data.products]);

    totalPagesRef.current = data.totalPages;
    loadingRef.current = false;
  }, [data]);

  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current) return;
      if (totalPagesRef.current && page >= totalPagesRef.current) return;

      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;

      const bottom = document.documentElement.offsetHeight - 200;

      if (scrollPosition >= bottom) {
        loadingRef.current = true;
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [page]);

  return (
    <>
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

      {isLoading && (
        <p className="col-span-full text-center mt-6 text-gray-500">
          Loading more products...
        </p>
      )}
    </>
  );
}

export default InfiniteProducts;
