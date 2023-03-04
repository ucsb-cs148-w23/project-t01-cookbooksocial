import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

export default function Navbars() {
    const { currentUser, setError, logout } = useAuth();

    const navigate = useNavigate();

    console.log(currentUser);

    async function handleLogout() {
        try {
            setError("");
            await logout();
            navigate("/login");
        } catch {
            setError("Failed to logout");
        }
    }

    const [profileVisible, setProfileVisible] = useState(false);
    const [navigationVisible, setNavigationVisible] = useState(false);

    function toggleDropdown(dropdownVisible, setDropdownVisible, setOtherDrowndown) {
        setDropdownVisible(!dropdownVisible);
        setOtherDrowndown(false);
    }

    return (
        <nav className="relative bg-chef-orange border-gray-200 px-2 sm:px-4 md:py-4 py-2">
            <div className="container flex flex-wrap items-center justify-between mx-auto max-w-7xl">
                <div className="flex items-center justify-between">
                    <a href="/" className="flex mr-6">
                        <img
                            src="https://svgsilh.com/svg/2400338.svg"
                            className="h-6 mr-2 sm:h-9"
                            alt="Cookbook Social"
                        />
                        <span className="self-center text-xl font-bold whitespace-nowra">
                            Cookbook Social
                        </span>
                    </a>
                    <div
                        className={`items-center justify-between w-full border-y-2 border-gray-800 md:border-0 md:flex md:w-auto md:order-1 absolute md:static top-full left-0 bg-chef-orange md:z-0 z-40 ${
                            navigationVisible ? "block" : "hidden"
                        }`}
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col p-2 rounded-lg  md:flex-row md:space-x-6 md:mt-0 md:text-m md:font-medium md:border-0  ">
                            <li>
                                <a
                                    href="/"
                                    className="block py-2 pl-3 pr-4 font-semibold md:text-gray-800 rounded md:bg-transparent md:p-0"
                                    aria-current="page"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block py-2 pl-3 pr-4 font-semibold text-gray-800 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0 "
                                >
                                    Featured
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex items-center md:order-2 relative">
                    <p className="font-semibold mr-2 hidden md:block md:text-gray-800 md:text-m">
                        Hello {currentUser.displayName}!
                    </p>
                    <button
                        type="button"
                        className="flex mr-3 text-sm bg-white rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300"
                        id="user-menu-button"
                        aria-expanded={profileVisible}
                        onClick={() =>
                            toggleDropdown(profileVisible, setProfileVisible, setNavigationVisible)
                        }
                    >
                        <span className="sr-only">Open user menu</span>
                        <img
                            className="w-8 h-8 rounded-full"
                            src={currentUser?.photoURL}
                            alt="user"
                        />
                    </button>
                    <div
                        className={`z-40 w-64 absolute right-0 mt-60 text-base text-left list-none bg-gray-100 border divide-y divide-gray-200 rounded-lg shadow-lg ${
                            profileVisible ? "block" : "hidden"
                        }`}
                        id="user-dropdown"
                    >
                        <div className="font-bold flex items-center px-4 py-3">
                            <img
                                className="w-8 h-8 mr-2 rounded-full bg-white shadow-lg"
                                src={currentUser?.photoURL}
                                alt="user"
                            />
                            <div>
                                <span className="block text-sm text-gray-90">
                                    {currentUser.displayName}
                                </span>
                                <span className="block text-sm font-medium text-gray-500 truncate">
                                    {currentUser.email}
                                </span>
                            </div>
                        </div>
                        <ul className="py-2" aria-labelledby="user-menu-button">
                            <li>
                                <a
                                    href="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/edit-profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Edit Profile
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    onClick={handleLogout}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                    <button
                        data-collapse-toggle="mobile-menu-2"
                        type="button"
                        className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
                        aria-controls="mobile-menu-2"
                        aria-expanded="false"
                        onClick={() =>
                            toggleDropdown(
                                navigationVisible,
                                setNavigationVisible,
                                setProfileVisible
                            )
                        }
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-6 h-6"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}
