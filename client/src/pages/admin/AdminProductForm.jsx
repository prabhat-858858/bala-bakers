import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Save,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';

const CATEGORIES = [
  'Counter Cakes',
  'Custom Cakes',
  'Pastries',
  'Cupcakes',
  'Cookies',
  'Donuts',
  'Desserts',
];

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Counter Cakes');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Variants array: [{ weight, price, pricingUnit, description }]
  const [variants, setVariants] = useState([
    { weight: '500 g', price: 450, pricingUnit: 'fixed', description: 'Serves 4–6' },
    { weight: '1 kg', price: 850, pricingUnit: 'fixed', description: 'Serves 8–10' },
  ]);

  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [needsOwnerReview, setNeedsOwnerReview] = useState(false);
  const [reviewNote, setReviewNote] = useState('');

  useEffect(() => {
    document.title = `${isEditMode ? 'Edit Product' : 'Add New Cake'} | Bela Bakers Owner`;
    if (isEditMode) {
      (async () => {
        try {
          setLoading(true);
          const data = await api.getProductById(id);
          const p = data.product;
          if (p) {
            setName(p.name || '');
            setCategory(p.category || 'Counter Cakes');
            setDescription(p.description || '');
            setIsAvailable(p.isAvailable !== false);
            setIsFeatured(Boolean(p.isFeatured));
            setNeedsOwnerReview(Boolean(p.needsOwnerReview));
            setReviewNote(p.reviewNote || '');

            if (p.images && p.images.length > 0) {
              setImageUrl(p.images[0].url || '');
              setImagePreview(p.images[0].url || '');
            }

            if (p.variants && p.variants.length > 0) {
              setVariants(
                p.variants.map((v) => ({
                  weight: v.weight,
                  price: v.price,
                  pricingUnit: v.pricingUnit || 'fixed',
                  description: v.description || '',
                }))
              );
            }
          }
        } catch (err) {
          setError(err.message || 'Failed to load product details.');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEditMode]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { weight: '', price: 0, pricingUnit: 'fixed', description: '' },
    ]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length <= 1) {
      alert('Product must have at least one weight/price variant.');
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: field === 'price' ? Number(value) : value,
      };
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Please provide a cake or product name.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a product description.');
      return;
    }
    if (!imageFile && !imageUrl) {
      setError('Please select an image file or provide an image URL.');
      return;
    }

    const invalidVar = variants.find((v) => !v.weight.trim() || Number.isNaN(v.price) || v.price < 0);
    if (invalidVar) {
      setError('Every variant must have a valid weight label and non-negative price.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('category', category);
      formData.append('description', description.trim());
      formData.append('variants', JSON.stringify(variants));
      formData.append('isAvailable', String(isAvailable));
      formData.append('isFeatured', String(isFeatured));
      formData.append('needsOwnerReview', String(needsOwnerReview));
      formData.append('reviewNote', reviewNote.trim());

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl) {
        formData.append('imageUrl', imageUrl.trim());
      }

      if (isEditMode) {
        await api.updateProduct(id, formData);
        setSuccess('Product and prices updated successfully in MongoDB Atlas!');
      } else {
        await api.createProduct(formData);
        setSuccess('New product created and live on Bela Bakers catalogue!');
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to save product to database.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#082B59] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-[#082B59]">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#D8B46A]/30 pb-4">
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#082B59]/70 hover:text-[#082B59] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-[#082B59]">
            {isEditMode ? `Edit: ${name || 'Product'}` : 'Add New Cake to Catalogue'}
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] border-2 border-[#D8B46A] text-xs font-bold shadow-md transition-all"
        >
          <Save className="w-4 h-4 text-[#D8B46A]" />
          <span>{submitting ? 'Saving to MongoDB...' : 'Save Product'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-sm font-semibold">
          <Check className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-3xl border border-[#D8B46A]/35 p-6 shadow-card space-y-4">
          <h2 className="font-serif text-base font-bold text-[#082B59] border-b border-[#D8B46A]/20 pb-3">
            1. Cake Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#082B59] mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Belgian Chocolate Truffle Cake"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8B46A]/40 text-xs text-[#082B59] focus:outline-none focus:border-[#082B59]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#082B59] mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8B46A]/40 text-xs text-[#082B59] focus:outline-none focus:border-[#082B59]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#082B59] mb-1">
              Description & Ingredients *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe sponge, frosting, cocoa percentage, fillings, and special notes..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8B46A]/40 text-xs text-[#082B59] focus:outline-none focus:border-[#082B59] resize-none"
            />
          </div>
        </div>

        {/* Section 2: Photograph (Cloudinary Upload) */}
        <div className="bg-white rounded-3xl border border-[#D8B46A]/35 p-6 shadow-card space-y-4">
          <h2 className="font-serif text-base font-bold text-[#082B59] border-b border-[#D8B46A]/20 pb-3">
            2. Product Photograph (Cloudinary Image Storage)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            {/* Preview Box */}
            <div className="sm:col-span-4">
              <div className="w-full aspect-square rounded-2xl bg-[#FFF0D9]/50 border border-[#D8B46A]/30 overflow-hidden flex items-center justify-center relative shadow-sm">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Cake Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4 text-[#082B59]/40 space-y-1">
                    <ImageIcon className="w-8 h-8 mx-auto" />
                    <p className="text-[11px]">No photo selected</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Inputs */}
            <div className="sm:col-span-8 space-y-4">
              <div>
                <label className="block font-semibold text-[#082B59] mb-1">
                  Upload Photograph (Cloudinary auto-upload & compression)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-[#082B59] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#FFF0D9] file:text-[#082B59] hover:file:bg-[#D8B46A]/30 cursor-pointer"
                />
                <p className="text-[11px] text-[#082B59]/60 mt-1">
                  High-res cake photographs will be stored and optimized via Cloudinary CDN.
                </p>
              </div>

              <div className="pt-2 border-t border-[#D8B46A]/20">
                <label className="block font-semibold text-[#082B59] mb-1">
                  Or Image Web URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (!imageFile) setImagePreview(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8B46A]/40 text-xs text-[#082B59] focus:outline-none focus:border-[#082B59]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Cake Weight Variants & Prices */}
        <div className="bg-white rounded-3xl border border-[#D8B46A]/35 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#D8B46A]/20 pb-3">
            <div>
              <h2 className="font-serif text-base font-bold text-[#082B59]">
                3. Weight Variants & Pricing
              </h2>
              <p className="text-[11px] text-[#082B59]/65">
                Preserve specific bakery units: per-pound, fixed-weight (e.g. 500 g, 1 kg), or per piece.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddVariant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0D9] hover:bg-[#D8B46A]/30 text-[#082B59] text-xs font-semibold border border-[#D8B46A]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variant</span>
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-2xl bg-[#FFFBF4] border border-[#D8B46A]/30 items-center"
              >
                <div className="sm:col-span-3">
                  <label className="block font-medium text-[#082B59]/75 mb-1">
                    Weight / Size *
                  </label>
                  <input
                    type="text"
                    required
                    value={v.weight}
                    onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                    placeholder="e.g. 500 g, 1 kg, 1 Pound"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D8B46A]/30 bg-white text-xs font-semibold text-[#082B59]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-medium text-[#082B59]/75 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={v.price}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                    placeholder="e.g. 850"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D8B46A]/30 bg-white text-xs font-bold text-[#082B59]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#082B59]/75 mb-1">
                    Pricing Unit
                  </label>
                  <select
                    value={v.pricingUnit || 'fixed'}
                    onChange={(e) => handleVariantChange(index, 'pricingUnit', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8B46A]/30 bg-white text-xs font-medium text-[#082B59]"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="per_pound">Per Pound</option>
                    <option value="per_piece">Per Piece</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-medium text-[#082B59]/75 mb-1">
                    Portion / Note
                  </label>
                  <input
                    type="text"
                    value={v.description || ''}
                    onChange={(e) => handleVariantChange(index, 'description', e.target.value)}
                    placeholder="e.g. Serves 8–10"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D8B46A]/30 bg-white text-xs text-[#082B59]"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end sm:pt-4">
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(index)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Display & Availability Settings */}
        <div className="bg-white rounded-3xl border border-[#D8B46A]/35 p-6 shadow-card space-y-4">
          <h2 className="font-serif text-base font-bold text-[#082B59] border-b border-[#D8B46A]/20 pb-3">
            4. Availability & Review Controls
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#D8B46A]/30 hover:bg-[#FFFBF4] cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 text-[#082B59] rounded mt-0.5"
              />
              <div>
                <span className="font-bold text-[#082B59] block">Available in Bakery</span>
                <span className="text-[#082B59]/65 text-[11px]">
                  Uncheck to mark as "Sold Out" (hides from customer catalogue).
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#D8B46A]/30 hover:bg-[#FFFBF4] cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#082B59] rounded mt-0.5"
              />
              <div>
                <span className="font-bold text-[#082B59] block">Feature on Homepage</span>
                <span className="text-[#082B59]/65 text-[11px]">
                  Shows in the "Featured Celebrations" carousel on the homepage.
                </span>
              </div>
            </label>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF0D9]/40 border border-[#D8B46A]/30 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#082B59]">
              <input
                type="checkbox"
                checked={needsOwnerReview}
                onChange={(e) => setNeedsOwnerReview(e.target.checked)}
                className="w-4 h-4 text-[#082B59] rounded"
              />
              <span>Flag this item for Owner Review (Ambiguous or Custom Recipe)</span>
            </label>
            {needsOwnerReview && (
              <input
                type="text"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="e.g. Verify per-pound rate with head chef"
                className="w-full px-3 py-1.5 rounded-xl border border-[#D8B46A]/40 bg-white text-xs text-[#082B59]"
              />
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/products"
            className="px-6 py-2.5 rounded-full border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] border-2 border-[#D8B46A] text-xs font-bold shadow-md transition-all"
          >
            <Save className="w-4 h-4 text-[#D8B46A]" />
            <span>{submitting ? 'Saving to Database...' : 'Save Product Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
