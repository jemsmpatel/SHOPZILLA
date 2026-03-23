import React from "react";
import Slider from "../components/Slider";
import ProductCard from "../components/ProductCard";
import { useGetAllProductsQuery } from "../redux/api/products";
import { useNavigate } from "react-router-dom";
import InfiniteProducts from "../components/InfiniteProducts";

function Home() {
  const { data: hotDeals, isLoading: hotLoading } = useGetAllProductsQuery(
    "?type=hot_deals&limit=8",
  );

  const { data: trending, isLoading: trendingLoading } = useGetAllProductsQuery(
    "?type=trending&limit=8",
  );

  const { data: newArrivals, isLoading: newLoading } = useGetAllProductsQuery(
    "?type=new_arrivals&limit=8",
  );

  const { data: bestSellers, isLoading: bestLoading } = useGetAllProductsQuery(
    "?type=best_sellers&limit=8",
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO SLIDER */}
      <Slider />

      <div className="max-w-[1500px] mx-auto px-4 py-8">
        {/* HOT DEALS */}
        <Section title="🔥 Hot Deals" type="hot_deals">
          {hotLoading ? (
            <SkeletonGrid />
          ) : (
            hotDeals?.products?.map((item) => (
              <ProductCard
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                oldPrice={item.mrp_price}
                image={item.images?.[0]}
              />
            ))
          )}
        </Section>

        {/* BANNER */}
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <Banner
            title="Mega Electronics Sale"
            img="https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
          />

          <Banner
            title="Fashion Deals"
            img="https://images.unsplash.com/photo-1521335629791-ce4aec67dd47"
          />

          <Banner
            title="Smart Gadgets"
            img="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
          />
        </div>

        {/* TRENDING */}
        <Section title="📈 Trending Products" type="trending">
          {trendingLoading ? (
            <SkeletonGrid />
          ) : (
            trending?.products?.map((item) => (
              <ProductCard
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                oldPrice={item.mrp_price}
                image={item.images?.[0]}
              />
            ))
          )}
        </Section>

        {/* BEST SELLERS */}
        <Section title="⭐ Best Sellers" type="best_sellers">
          {bestLoading ? (
            <SkeletonGrid />
          ) : (
            bestSellers?.products?.map((item) => (
              <ProductCard
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                oldPrice={item.mrp_price}
                image={item.images?.[0]}
              />
            ))
          )}
        </Section>

        {/* NEW ARRIVALS */}
        <Section title="🆕 New Arrivals" type="new_arrivals">
          {newLoading ? (
            <SkeletonGrid />
          ) : (
            newArrivals?.products?.map((item) => (
              <ProductCard
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                oldPrice={item.mrp_price}
                image={item.images?.[0]}
              />
            ))
          )}
        </Section>
        {/* EXPLORE MORE PRODUCTS (Infinite Scroll) */}
        <Section title="🔎 Explore More Products">
          <InfiniteProducts />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children, type }) {
  const navigate = useNavigate();

  return (
    <div className="mb-14">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-orange-500 pb-1">
          {title}
        </h2>

        <button
          onClick={() => navigate(`/products?type=${type}`)}
          className="text-orange-500 font-semibold hover:underline"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {children}
      </div>
    </div>
  );
}

function Banner({ title, img }) {
  return (
    <div className="relative rounded-xl overflow-hidden group cursor-pointer">
      <img
        src={img}
        className="h-60 w-full object-cover group-hover:scale-110 transition duration-500"
      />

      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <h2 className="text-white text-2xl font-bold">{title}</h2>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <>
      {Array(4)
        .fill()
        .map((_, i) => (
          <div key={i} className="bg-white p-4 rounded shadow animate-pulse">
            <div className="h-40 bg-gray-200 rounded mb-3"></div>

            <div className="h-4 bg-gray-200 rounded mb-2"></div>

            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
    </>
  );
}

export default Home;
