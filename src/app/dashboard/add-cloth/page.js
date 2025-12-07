'use client'

import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Upload, Plus, Trash2, X, Eye, EyeOff } from 'lucide-react'

const AddCloth = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    color: '',
    material: '',
    featured: false,
    status: 'active',
  })

  const [sizes, setSizes] = useState([
    { size: 'XS', quantity: 0 },
    { size: 'S', quantity: 0 },
    { size: 'M', quantity: 0 },
    { size: 'L', quantity: 0 },
    { size: 'XL', quantity: 0 },
    { size: 'XXL', quantity: 0 },
  ])

  const [specs, setSpecs] = useState([
    { label: 'Fabric Type', value: '' },
    { label: 'Color', value: '' },
    { label: 'Sleeve Length', value: '' },
    { label: 'Print Method', value: '' },
    { label: 'Washing Condition', value: '' },
  ])

  const [images, setImages] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef(null)

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle size quantity changes
  const handleSizeChange = (index, quantity) => {
    const updatedSizes = [...sizes]
    updatedSizes[index].quantity = parseInt(quantity) || 0
    setSizes(updatedSizes)
  }

  // Handle spec changes
  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...specs]
    updatedSpecs[index][field] = value
    setSpecs(updatedSpecs)
  }

  // Handle file selection and upload
  const handleImageSelect = async (e) => {
    const files = e.target.files
    if (!files) return

    setUploadingImages(true)
    setError('')

    try {
      // Upload to backend API which handles Cloudinary upload server-side
      const uploadPromises = Array.from(files).map(file => {
        const fd = new FormData()
        fd.append('file', file)

        return fetch('/api/upload', {
          method: 'POST',
          body: fd,
        })
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              throw new Error(`Upload error: ${data.error}`)
            }
            return {
              url: data.url,
              publicId: data.publicId,
              alt: formData.name || 'Cloth design image',
            }
          })
      })

      const uploadedImages = await Promise.all(uploadPromises)
      setImages(prev => [...prev, ...uploadedImages])
      setUploadingImages(false)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload images: ' + err.message)
      setUploadingImages(false)
    }
  }

  // Remove image
  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validation
      if (!formData.name || !formData.description || !formData.price || !formData.color || !formData.material) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (images.length === 0) {
        setError('Please upload at least one image')
        setLoading(false)
        return
      }

      if (specs.some(spec => !spec.value)) {
        setError('Please fill in all specification values')
        setLoading(false)
        return
      }

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        sizes,
        specs,
        images,
        createdBy: null, // Set this based on auth context if available
      }

      const response = await axios.post('/api/cloth', payload)

      setSuccess('Cloth design created successfully!')
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        color: '',
        material: '',
        featured: false,
        status: 'active',
      })
      setSizes(sizes.map(s => ({ ...s, quantity: 0 })))
      setImages([])
      setSpecs(specs.map(s => ({ ...s, value: '' })))

      setTimeout(() => {
        window.location.href = '/dashboard/all-cloth'
      }, 2000)
    } catch (err) {
      console.error('Submission error:', err)
      setError(err.response?.data?.message || 'Failed to create cloth design')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-0 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Add New Cloth Design</h1>

          {error && (
            <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm sm:text-base">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm sm:text-base">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Cloth Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., LASU MBA T-Shirt"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="25000"
                    step="0.01"
                    min="0"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the cloth design..."
                    rows="4"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Color *
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., Navy Blue"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Material *
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    placeholder="e.g., 100% Cotton"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-xs sm:text-sm text-gray-700">Featured Cloth</span>
                </label>

                <div className="flex-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sizes and Stock */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Sizes & Stock</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
                {sizes.map((size, index) => (
                  <div key={size.size}>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      {size.size}
                    </label>
                    <input
                      type="number"
                      value={size.quantity}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                      placeholder="Qty"
                      min="0"
                      className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
              <div className="space-y-3 sm:space-y-4">
                {specs.map((spec, index) => (
                  <div key={spec.label} className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        {spec.label}
                      </label>
                    </div>
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      placeholder={`Enter ${spec.label.toLowerCase()}`}
                      className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Images *</h2>

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-blue-500 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mb-2" />
                <p className="text-xs sm:text-sm text-gray-600">
                  Click to upload images or drag and drop
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={uploadingImages}
                  className="hidden"
                />
              </div>

              {uploadingImages && (
                <p className="text-center text-gray-600 mt-4 text-sm">Uploading images...</p>
              )}

              {images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Cloth design ${index + 1}`}
                        className="w-full h-28 sm:h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Creating...' : 'Create Cloth Design'}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 bg-gray-300 text-gray-800 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddCloth
