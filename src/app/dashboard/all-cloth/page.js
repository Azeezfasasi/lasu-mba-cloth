'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Edit2, Trash2, Eye, Plus, Search, Filter } from 'lucide-react'

const AllClothes = () => {
  const [cloths, setClothes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('-createdAt')
  const [deletingId, setDeletingId] = useState(null)
  const [editingCloth, setEditingCloth] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const itemsPerPage = 10

  // Fetch cloths
  const fetchClothes = async (page = 1, search = '', status = '', sort = '-createdAt') => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        page,
        limit: itemsPerPage,
        ...(search && { search }),
        ...(status && { status }),
        sortBy: sort,
      })

      const response = await axios.get(`/api/cloth?${params}`)
      setClothes(response.data.cloths)
      setTotalPages(response.data.pagination.totalPages)
    } catch (err) {
      console.error('Error fetching cloths:', err)
      setError('Failed to load cloths')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClothes(currentPage, searchTerm, statusFilter, sortBy)
  }, [currentPage, searchTerm, statusFilter, sortBy])

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cloth?')) return

    setDeletingId(id)
    try {
      await axios.delete(`/api/cloth?id=${id}`)
      setClothes(cloths.filter(c => c._id !== id))
    } catch (err) {
      console.error('Error deleting cloth:', err)
      setError('Failed to delete cloth')
    } finally {
      setDeletingId(null)
    }
  }

  // Handle update
  const handleUpdate = async (updatedCloth) => {
    try {
      const response = await axios.put(`/api/cloth?id=${editingCloth._id}`, updatedCloth)
      setClothes(cloths.map(c => c._id === editingCloth._id ? response.data.cloth : c))
      setShowEditModal(false)
      setEditingCloth(null)
    } catch (err) {
      console.error('Error updating cloth:', err)
      setError('Failed to update cloth')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cloth Designs</h1>
          <Link
            href="/dashboard/add-cloth"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Add New Cloth
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search cloths..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="-name">Name (Z-A)</option>
                <option value="price">Price (Low to High)</option>
                <option value="-price">Price (High to Low)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                  setSortBy('-createdAt')
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Cloths Table */}
        {!loading && cloths.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Color</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cloths.map((cloth) => (
                  <tr key={cloth._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      {cloth.images && cloth.images.length > 0 && (
                        <img
                          src={cloth.images[0].url}
                          alt={cloth.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{cloth.name}</p>
                        <p className="text-sm text-gray-600 truncate">{cloth.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">₦{cloth.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block w-6 h-6 rounded border-2 border-gray-300" style={{backgroundColor: cloth.color === 'Navy Blue' ? '#001f3f' : cloth.color === 'White' ? '#ffffff' : '#ccc'}} title={cloth.color} />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${cloth.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {cloth.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${cloth.status === 'active' ? 'bg-blue-100 text-blue-800' : cloth.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {cloth.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <Link
                          href={`/cloth-design?id=${cloth._id}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => {
                            setEditingCloth(cloth)
                            setShowEditModal(true)
                          }}
                          className="text-green-600 hover:text-green-800 transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cloth._id)}
                          disabled={deletingId === cloth._id}
                          className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No Results */}
        {!loading && cloths.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">No cloths found</p>
            <Link
              href="/dashboard/add-cloth"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create First Cloth
            </Link>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingCloth && (
          <EditClothModal
            cloth={editingCloth}
            onClose={() => setShowEditModal(false)}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  )
}

// Edit Modal Component
function EditClothModal({ cloth, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: cloth.name,
    description: cloth.description,
    price: cloth.price,
    color: cloth.color,
    material: cloth.material,
    featured: cloth.featured,
    status: cloth.status,
  })

  const [sizes, setSizes] = useState(cloth.sizes)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSizeChange = (index, quantity) => {
    const updatedSizes = [...sizes]
    updatedSizes[index].quantity = parseInt(quantity) || 0
    setSizes(updatedSizes)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onUpdate({
        ...formData,
        sizes,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold">Edit Cloth</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price"
              step="0.01"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="Color"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              placeholder="Material"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {sizes.map((size, index) => (
              <div key={size.size}>
                <label className="text-sm font-medium text-gray-700">{size.size}</label>
                <input
                  type="number"
                  value={size.quantity}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  min="0"
                  className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">Featured</span>
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Updating...' : 'Update Cloth'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AllClothes
