"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { ArrowBigRightDash, ArrowBigLeftDash } from 'lucide-react';

export default function Hero() {
  const slides = [
    {
      title: 'Celebrate Your Achievements in Style',
      subtitle: 'Custom-designed academic and corporate T-shirts that make every occasion memorable.',
      cta: { label: 'Order LASUMBA T-Shirt', href: '/request-a-quote' },
      bg: 'linear-gradient(135deg,#87CEEB 100%,#87CEEB 100%)',
      image: { src: '/images/tshirt2.jpeg', alt: 'Professional development' }
    },
    {
      title: 'Order LASUMBA T-Shirt',
      subtitle: 'Showcase your LASUMBA pride with our exclusive custom T-Shirt, tailored for special events.',
      cta: { label: 'Order LASUMBA T-Shirt', href: '/request-a-quote' },
      bg: 'linear-gradient(135deg,#87CEEB 100%,#87CEEB 100%)',
      image: { src: '/images/tshirt3.jpeg', alt: 'Expert mentorship' }
    },
    {
      title: 'Hurry Up! Limited Time Offer',
      subtitle: 'Elevate Your Style with LASUMBA T-Shirts',
      cta: { label: 'Order LASUMBA T-Shirt', href: '/request-a-quote' },
      bg: 'linear-gradient(135deg,#87CEEB 100%,#87CEEB 100%)',
      image: { src: '/images/tshirt2.jpeg', alt: 'Professional training' }
    }
  ]

  const [index, setIndex] = useState(0)
  const [drag, setDrag] = useState({ active: false, startX: 0, dx: 0 })
  const containerRef = useRef(null)
  const [slideWidth, setSlideWidth] = useState(0)

  // Note: index is controlled by setters below (clamped on update); no effect needed here.

  // pointer handlers (works for mouse & touch)
  function handlePointerDown(e) {
    const x = e.clientX ?? (e.touches && e.touches[0].clientX)
    setDrag({ active: true, startX: x, dx: 0 })
  }

  function handlePointerMove(e) {
    if (!drag.active) return
    const x = e.clientX ?? (e.touches && e.touches[0].clientX)
    if (typeof x !== 'number') return
    setDrag(d => ({ ...d, dx: x - d.startX }))
  }

  function handlePointerUp() {
    if (!drag.active) return
    const threshold = (containerRef.current?.offsetWidth || 600) * 0.15
    if (drag.dx > threshold) setIndex(i => Math.max(0, i - 1))
    else if (drag.dx < -threshold) setIndex(i => Math.min(slides.length - 1, i + 1))
    setDrag({ active: false, startX: 0, dx: 0 })
  }

  // keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setIndex(i => Math.min(slides.length - 1, i + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slides.length])

  // track container width and update on resize so we translate by exact pixels
  useLayoutEffect(() => {
    function update() {
      const w = containerRef.current?.offsetWidth || 0
      setSlideWidth(w)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <section className="w-full">
      <div className="mx-auto ">
        <div
          ref={containerRef}
          className="relative overflow-hidden"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          style={{ touchAction: 'pan-y' }}
        >
          <div
            className="flex transition-transform duration-300"
            style={{
              transform: slideWidth
                ? `translateX(${-(index * slideWidth) + drag.dx}px)`
                : `translateX(calc(${-(index * 100)}% + ${drag.dx}px))`
            }}
          >
            {slides.map((s, i) => (
              <div key={i} className="min-w-full flex-none" style={{ flex: '0 0 100%' }}>
                <div className="h-[420px] md:h-[540px] flex items-center">
                  <div className="w-full h-full p-8 md:p-12 flex items-center justify-between gap-6" style={{ background: s.bg }}>
                    <div className="flex-1 max-w-full md:max-w-2xl">
                      <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">{s.title}</h2>
                      <p className="text-gray-700 mb-6">{s.subtitle}</p>
                      <div className="flex flex-col md:flex-row gap-3">
                        <Link href={s.cta.href} className="inline-block px-2 md:px-5 py-3 bg-blue-900 text-white rounded-md font-medium text-center">{s.cta.label}</Link>
                        <Link href="/cloth-design" className="inline-block px-2 md:px-5 py-3 border border-blue-900 rounded-md text-gray-700 text-center">View T-shirt Design</Link>
                      </div>
                    </div>
                    {/* Right Image - visible on lg (laptop) and up only */}
                    <div className="hidden lg:block shrink-0 lg:w-[40%]">
                      <Image
                        src={s.image?.src}
                        alt={s.image?.alt}
                        width={420}
                        height={500}
                        className="rounded-2xl object-cover w-full h-[500px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prev/Next arrows */}
          <button
            aria-label="Previous"
            onClick={() => setIndex(i => Math.max(0, i - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 md:bg-white/80 hover:bg-white p-0.5 md:p-2 rounded-full shadow-md text-blue-900 cursor-pointer"
          >
            <ArrowBigLeftDash />
          </button>
          <button
            aria-label="Next"
            onClick={() => setIndex(i => Math.min(slides.length - 1, i + 1))}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 md:bg-white/80 hover:bg-white p-0.5 md:p-2 rounded-full shadow-md text-blue-900 cursor-pointer"
          >
            <ArrowBigRightDash />
          </button>          

          {/* Dots */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full ${i === index ? 'bg-blue-900' : 'bg-white/70 border border-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}