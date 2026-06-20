"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function MenuClick() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const menuItems = [
        {
            title: "Каталог",
            href: "/",
        },

        ...(user
            ? [
                  {
                      title: "Избранные",
                      href: "/favorites",
                  },
                  {
                      title: "Мои заявки",
                      href: "/orders",
                  },
                  {
                      title: "Профиль",
                      href: "/profile",
                  },
              ]
            : [
                  {
                      title: "Войти",
                      href: "/login",
                  },
                {
                  title: "Регистрация",
                  href: "/register",
                  },
              ]),

        ...(user?.is_staff
            ? [
                  {
                      title: "Админка",
                      href: "/admin",
                  },
              ]
            : []),
    ];

    return (
        <nav className="bg-gray-800">
            <div className="container mx-auto w-full px-4 sm:px-4 lg:px-4">
                <div className="relative flex h-16 items-center justify-between">
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

                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <p className="h-10 w-auto text-white mt-1.5">
                                FAMILY
                            </p>
                        </div>

                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                    >
                                        {item.title}
                                    </Link>
                                ))}

                                {user && (
                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                    >
                                        Выйти
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}
                id="mobile-menu"
            >
                <div className="space-y-1 px-2 pb-3 pt-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                        >
                            {item.title}
                        </Link>
                    ))}

                    {user && (
                        <button
                            type="button"
                            onClick={() => {
                                logout();
                                setIsMenuOpen(false);
                            }}
                            className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left rounded-md px-3 py-2 text-base font-medium"
                        >
                            Выйти
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}