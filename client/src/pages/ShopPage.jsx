import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, Cake } from 'lucide-react';
import { api } from '../services/api';
import { BUSINESS_INFO } from '../services/whatsapp';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  'All',
  'Counter Cakes',
  'Custom Cakes',
  'Pastries',
  'Cupcakes',
  'Cookies',
  'Donuts',
  'Desserts',
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('featured');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const paramCat = searchParams.get('category') || 'All';
    setCategory(paramCat);
  }, [searchParams]);

  const fetchCatalogue = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getProducts({
        category: category === 'All' ? '' : category,
        search: search.trim(),
        minPrice,
        maxPrice,
        sort: sort === 'featured' ? '' : sort,
      });
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || 'Could not load products from MongoDB.');
    } finally {
      setLoading(false);
    }
  }, [category, search, minPrice, maxPrice, sort]);

  useEffect(() => {
    document.title = `${
      category === 'All' ? 'Cake & Dessert Catalogue' : category
    } | Bela Bakers Gopalganj`;
    fetchCatalogue();
  }, [fetchCatalogue, category]);

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (newCat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', newCat);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setCategory('All');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSort('featured');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="bg-[#082B59] text-[#FFF0D9] rounded-3xl p-7 sm:p-10 border-2 border-[#D8B46A] mb-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D8B46A]">
          Bela Bakers Catalogue
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
          {category === 'All' ? 'Freshly Baked Cakes & Desserts' : category}
        </h1>
        <p className="text-sm sm:text-base text-[#FFF0D9]/85 mt-2 max-w-2xl">
          {BUSINESS_INFO.whatsappOrderNotice}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                active
                  ? 'bg-[#082B59] text-[#FFF0D9] border-[#082B59] shadow-sm'
                  : 'bg-white text-[#082B59] border-[#D8B46A]/50 hover:bg-[#FFF0D9]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search, Price Filter & Sort Bar */}
      <div className="bg-white rounded-2xl border border-[#D8B46A]/40 p-4 sm:p-5 shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          {/* Search Input */}
          <div className="lg:col-span-4">
            <label
              htmlFor="cake-search"
              className="block text-xs font-bold uppercase tracking-wider text-[#082B59]/70 mb-1"
            >
              Search by Cake Name
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#082B59]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="cake-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Truffle, Red Velvet, Rasmalai..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D8B46A]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#082B59]"
              />
            </div>
          </div>

          {/* Min Price */}
          <div className="lg:col-span-2">
            <label
              htmlFor="min-price"
              className="block text-xs font-bold uppercase tracking-wider text-[#082B59]/70 mb-1"
            >
              Min Price (₹)
            </label>
            <input
              id="min-price"
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="e.g., 100"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8B46A]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#082B59]"
            />
          </div>

          {/* Max Price */}
          <div className="lg:col-span-2">
            <label
              htmlFor="max-price"
              className="block text-xs font-bold uppercase tracking-wider text-[#082B59]/70 mb-1"
            >
              Max Price (₹)
            </label>
            <input
              id="max-price"
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g., 1500"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8B46A]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#082B59]"
            />
          </div>

          {/* Sort By */}
          <div className="lg:col-span-3">
            <label
              htmlFor="sort-by"
              className="block text-xs font-bold uppercase tracking-wider text-[#082B59]/70 mb-1"
            >
              <span className="inline-flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Sort by Price
              </span>
            </label>
            <select
              id="sort-by"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8B46A]/50 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#082B59]"
            >
              <option value="featured">Featured & Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>

          {/* Reset */}
          <div className="lg:col-span-1">
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Filters"
              className="w-full inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border border-[#D8B46A] bg-[#FFF0D9]/50 hover:bg-[#FFF0D9] text-xs font-bold text-[#082B59] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="lg:hidden">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-96 rounded-2xl bg-white animate-pulse border border-[#D8B46A]/20 p-5"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-center space-y-3">
          <p className="font-bold">{error}</p>
          <button
            type="button"
            onClick={fetchCatalogue}
            className="px-5 py-2.5 rounded-xl bg-[#082B59] text-[#FFF0D9] text-xs font-bold"
          >
            Retry Loading Catalogue
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#D8B46A]/40 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FFF0D9] text-[#082B59] flex items-center justify-center mx-auto">
            <Cake className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#082B59]">
            No Matching Cakes Found
          </h2>
          <p className="text-sm text-[#082B59]/75">
            We couldn’t find any available products matching your current filters. Try clearing your search or message us on WhatsApp for custom requests!
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#082B59] text-[#FFF0D9] text-xs font-bold"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs font-semibold text-[#082B59]/70 mb-4 px-1">
            <span>
              Showing <strong>{products.length}</strong> available{' '}
              {products.length === 1 ? 'item' : 'items'}
            </span>
            <span>Prices fetched live from Bela Bakers catalogue</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
