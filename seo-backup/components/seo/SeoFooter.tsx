import React from "react";
import Link from "next/link";

/**
 * Footer component for SEO pages
 */
export default function SeoFooter() {
  return (
    <footer className="bg-gray-50 pt-16 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About section */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-base font-medium text-gray-900">About SnapSeeker</h3>
            <p className="mt-4 text-sm text-gray-600">
              SnapSeeker is a product search and competitor analysis tool designed for
              product managers, independent developers, and entrepreneurs.
            </p>
          </div>

          {/* Features section */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-base font-medium text-gray-900">Features</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/seo/features"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Product Search
                </Link>
              </li>
              <li>
                <Link
                  href="/seo/features"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Competitor Analysis
                </Link>
              </li>
              <li>
                <Link
                  href="/seo/features"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Idea Validation
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions section */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-base font-medium text-gray-900">Solutions</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/seo/competitor-analysis"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Competitor Analysis
                </Link>
              </li>
              <li>
                <Link
                  href="/seo/product-validation"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Product Validation
                </Link>
              </li>
            </ul>
          </div>

          {/* For section */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-base font-medium text-gray-900">For</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/seo/about"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Product Managers
                </Link>
              </li>
              <li>
                <Link
                  href="/seo/about"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Independent Developers
                </Link>
              </li>
              <li>
                <Link
                  href="/seo/about"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Entrepreneurs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-600 text-center">
            &copy; {new Date().getFullYear()} SnapSeeker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}