"use client";
import React from "react";
import Image from "next/image";

export default function CompanyOverview() {
  return (
    <>
      {/* Company Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/fibre1.jpeg"
                  alt="Rayob Engineering Overview"
                  fill
                  sizes="100%"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Rayob Engineering & Mgt. Co. Ltd is a dynamic, solutions-driven Engineering and Management Company committed to delivering world-class services across multiple sectors. Established in 2020 and legally incorporated in Nigeria in 2025 with a passion for innovation, engineering excellence, and sustainable project delivery.
                </p>
                <p>
                  We bring together nearly two decades of multidisciplinary experience spanning construction, telecommunications, optical fibre implementation, operations and maintenance, project management, corporate governance, and corporate social responsibility.
                </p>
                <p>
                  The Chairman/CEO is strongly supported by highly experienced professionals in engineering, accounting and finance, law, management, and more. Together, we deliver value, promote excellence, and exceed the expectations of our clients and customers.
                </p>
                <p className="text-blue-900 font-semibold text-lg pt-2">
                  Our goal: to become a trusted African leader in engineering excellence, telecommunications infrastructure development, and strategic project delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Vision</h2>
            <div className="bg-white rounded-lg shadow-md p-8 md:p-12 border-l-4 border-blue-900">
              <p className="text-xl text-gray-700 leading-relaxed">
                To be a Globally Recognized Engineering and Management Brand known for Excellence, Innovation, and Reliable Project Delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg shadow-md p-8 md:p-12 border-l-4 border-blue-900">
              <p className="text-xl text-gray-700 leading-relaxed">
                To Provide Superior Engineering and Management Services Using Modern Technology, Professional Expertise, and a Commitment to Quality, Safety, and Customer Satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Excellence */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600 text-sm">We deliver superior outcomes in every project.</p>
            </div>

            {/* Integrity */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Integrity</h3>
              <p className="text-gray-600 text-sm">Ethical, transparent, and trustworthy operations.</p>
            </div>

            {/* Innovation */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">Smart, modern, technology-driven solutions.</p>
            </div>

            {/* Professionalism */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Professionalism</h3>
              <p className="text-gray-600 text-sm">High standards, certified competence, quality delivery.</p>
            </div>

            {/* Customer-centric */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Customer-centric</h3>
              <p className="text-gray-600 text-sm">Solutions tailored to each client&apos;s needs.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
