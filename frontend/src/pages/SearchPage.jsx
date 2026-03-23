import { useLocation } from "react-router-dom";
import InfiniteProducts from "../components/InfiniteProducts";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchPage() {
  const query = useQuery();
  const keyword = query.get("keyword") || "";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-10">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Search Results</h1>

          <p className="text-gray-500 mt-1">
            Showing results for{" "}
            <span className="font-semibold">"{keyword}"</span>
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <InfiniteProducts query={`keyword=${keyword}`} />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
