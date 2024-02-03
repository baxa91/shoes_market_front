"use client";
import React, { useState } from "react";

export function MenuClick() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    const menu = document.getElementById("mobile-menu");
    setIsMenuOpen(!isMenuOpen);
    if (menu) {
      if (menu.classList.contains("block")) {
        menu.classList.remove("block");
        menu.classList.add("hidden");
      } else {
        menu.classList.remove("hidden");
        menu.classList.add("block");
      }
    }
  };
  return (
    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
      <button
        type="button"
        className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        aria-controls="mobile-menu"
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
      >
        <span className="absolute -inset-0.5"></span>
        <span className="sr-only">Open main menu</span>

        <svg
          className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        <svg
          className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
