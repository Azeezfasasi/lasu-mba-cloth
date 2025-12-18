'use client'
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { ChevronLeft, ChevronRight, ShoppingCart, Info, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const ClothDesign360Viewer = () => {
  const [cloths, setClothes] = useState([])
  const [selectedClothIndex, setSelectedClothIndex] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartSuccess, setCartSuccess] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const containerRef = useRef(null)

  // Fetch cloths from API
  useEffect(() => {
    const fetchClothes = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axios.get('/api/cloth', {
          params: {
            status: 'active',
            limit: 100,
            sortBy: '-featured'
          }
        })
        setClothes(response.data.cloths || [])
        if (response.data.cloths && response.data.cloths.length > 0) {
          setSelectedSize(response.data.cloths[0].sizes?.[0]?.size || '')
        }
      } catch (err) {
        console.error('Error fetching cloths:', err)
        setError('Failed to load cloth designs. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchClothes()
  }, [])

  const currentCloth = cloths[selectedClothIndex]
  const imageCount = 36 // 360 degrees / 10 degrees per image = 36 images

  // Handle mouse drag for 360 rotation
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragStart(e.clientX)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const diff = e.clientX - dragStart
    setRotation((prev) => (prev + diff) % 360)
    setDragStart(e.clientX)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle touch drag for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true)
    setDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const diff = e.touches[0].clientX - dragStart
    setRotation((prev) => (prev + diff) % 360)
    setDragStart(e.touches[0].clientX)
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, dragStart])

  const getCurrentImageIndex = () => {
    return Math.round((rotation % 360) / 10) % 36
  }

  const rotateLeft = () => setRotation((prev) => (prev - 10 + 360) % 360)
  const rotateRight = () => setRotation((prev) => (prev + 10) % 360)

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }

    setAddingToCart(true)
    try {
      // Get or initialize cart from localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      
      const cartItem = {
        clothId: currentCloth._id,
        name: currentCloth.name,
        price: currentCloth.price,
        size: selectedSize,
        quantity: 1,
        image: currentCloth.images?.[0]?.url || '',
        addedAt: new Date().toISOString()
      }

      // Check if item already in cart
      const existingItem = cart.find(
        item => item.clothId === currentCloth._id && item.size === selectedSize
      )

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push(cartItem)
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      setCartSuccess(true)

      setTimeout(() => setCartSuccess(false), 3000)
    } catch (err) {
      console.error('Error adding to cart:', err)
      alert('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  // Format price
  const formatPrice = (price) => {
    return typeof price === 'number' ? `₦${price.toLocaleString()}` : price
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cloth designs...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4 text-red-600">
            <AlertCircle size={24} />
            <h2 className="text-xl font-bold">Error</h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // No cloths found
  if (!currentCloth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-gray-600 text-lg mb-4">No T-Shirt designs available</p>
          <p className="text-gray-500 text-sm">Please check back later or contact support</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">LASUMBA Games T-Shirt</h1>
          <p className="text-lg text-gray-600">Explore and customize your professional T-Shirt for MBA programs</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 360 Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* 360 Degree Viewer */}
              <div
                ref={containerRef}
                className="relative bg-gradient-to-b from-slate-100 to-slate-50 h-[500px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Product Image Display */}
                  <div className="relative w-full lg:w-1/2 h-96 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden"
                    style={{
                      transform: `perspective(1000px) rotateY(${rotation}deg)`,
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {currentCloth.images && currentCloth.images.length > 0 ? (
                      <img
                        src={currentCloth.images[0].url}
                        alt={currentCloth.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-6xl mb-4">👔</div>
                          <h3 className="text-2xl font-bold">{currentCloth.name}</h3>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Drag Hint */}
                <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <Info size={16} />
                  Drag to rotate • Use arrows
                </div>
              </div>

              {/* Rotation Controls */}
              <div className="bg-gray-50 p-6 flex items-center justify-between">
                <button
                  onClick={rotateLeft}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition shadow-md"
                  aria-label="Rotate left"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">Rotation</p>
                  <p className="text-2xl font-bold text-blue-600">{rotation.toFixed(0)}°</p>
                </div>

                <button
                  onClick={rotateRight}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition shadow-md"
                  aria-label="Rotate right"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Reset Button */}
              <div className="bg-white px-6 py-4 border-t">
                <button
                  onClick={() => setRotation(0)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition font-medium"
                >
                  Reset View
                </button>
              </div>

              {/* Image Gallery */}
              {currentCloth.images && currentCloth.images.length > 1 && (
                <div className="bg-gray-50 p-4">
                  <p className="text-sm text-gray-600 mb-3 font-medium">More Images</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {currentCloth.images.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition ${
                          currentImageIndex === idx ? 'border-blue-600' : 'border-gray-300'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`View ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-20">
            {/* Product Name & Price */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentCloth.name}</h2>
                  <p className="text-gray-600 mt-1 text-sm">{currentCloth.description}</p>
                </div>
                {currentCloth.inStock && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-2">In Stock</span>
                )}
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-4">{formatPrice(currentCloth.price)}</div>
            </div>

            {/* Specifications */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-bold text-gray-900 mb-4">Specifications</h3>
              <div className="space-y-3">
                {currentCloth.specs && currentCloth.specs.length > 0 ? (
                  currentCloth.specs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{spec.label}</span>
                      <span className="font-semibold text-gray-900">{spec.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No specifications available</p>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-bold text-gray-900 mb-3">Available Size</h3>
              {currentCloth.sizes && currentCloth.sizes.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {currentCloth.sizes.map((sizeObj) => {
                    const sizeName = sizeObj.size || sizeObj
                    const available = typeof sizeObj === 'object' ? sizeObj.quantity > 0 : true
                    return (
                      <button
                        key={sizeName}
                        onClick={() => setSelectedSize(sizeName)}
                        disabled={!available}
                        className={`border-2 py-2 rounded-lg transition font-medium ${
                          selectedSize === sizeName
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : available
                            ? 'border-gray-300 hover:border-blue-600 text-gray-700'
                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {sizeName}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No sizes available</p>
              )}
            </div>

            {/* View Details Link */}
            <div className='w-full border flex items-center justify-center itmems-center'>
                <Link href="/request-a-quote" className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-md mb-4">
                    <ShoppingCart size={20} /> Order Your T-Shirt
                </Link>
            </div>

            {/* Stock Status */}
            {!currentCloth.inStock && (
              <p className="text-center text-red-600 text-sm mt-4 font-medium">Out of Stock</p>
            )}
          </div>
        </div>

        {/* Product Gallery */}
        {cloths.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Product</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cloths.map((cloth, idx) => (
                <button
                  key={cloth._id || idx}
                  onClick={() => {
                    setSelectedClothIndex(idx)
                    setRotation(0)
                    setSelectedSize(cloth.sizes?.[0]?.size || cloth.sizes?.[0] || '')
                  }}
                  className={`rounded-lg overflow-hidden shadow-md transition transform hover:scale-105 ${
                    selectedClothIndex === idx ? 'ring-4 ring-blue-600' : ''
                  }`}
                >
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
                    {cloth.images && cloth.images.length > 0 ? (
                      <img
                        src={cloth.images[0].url}
                        alt={cloth.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-white">
                        <div className="text-4xl mb-2">👔</div>
                        <p className="text-sm font-bold">{cloth.name}</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-white p-4">
                    <p className="font-bold text-gray-900">{formatPrice(cloth.price)}</p>
                    <p className="text-sm text-gray-600">{cloth.color}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-blue-600">📋</span> Ordering Process
              </h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>✓ Browse and review all available items</li>
                <li>✓ Click on order t-shirt to request</li>
                <li>✓ Select your preferred size</li>
                <li>✓ Receive an email to complete payment process</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-blue-600">🚚</span> Delivery Process
              </h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>✓ T-shirt will be ready within 1-3 days</li>
                <li>✓ Our LASUMBA committee will get in touch</li>
                <li>✓ Student support available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClothDesign360Viewer
