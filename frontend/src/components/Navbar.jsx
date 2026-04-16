// Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import {
  User,
  ShoppingBag,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    getCartCount,
    axios,
    isSeller,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  // ── Dropdown Menu Items ────────────────────────────────────────────────────
  const UserDropdown = () => (
    <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-800 truncate">
          {user?.name || "User"}
        </p>
        <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
      </div>

      {/* My Orders */}
      <button
        onClick={() => {
          navigate("/my-orders");
          scrollTo(0, 0);
          setDropdownOpen(false);
        }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors"
      >
        <ShoppingBag className="w-4 h-4" />
        My Orders
      </button>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          setDropdownOpen(false);
        }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );

  // ── Seller Dropdown ────────────────────────────────────────────────────────
  const SellerDropdown = () => (
    <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
      {/* Seller Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-800">Seller Account</p>
        <p className="text-[11px] text-primary font-medium">RxCare Partner</p>
      </div>

      {/* Dashboard */}
      <button
        onClick={() => {
          navigate("/seller");
          scrollTo(0, 0);
          setDropdownOpen(false);
        }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors"
      >
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </button>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          setDropdownOpen(false);
        }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white z-50 transition-all sticky top-0">
      {/* Logo */}
      <NavLink to={"/"} onClick={() => setOpen(false)}>
        <h2 className="text-xl font-bold">
          <span className="text-primary">Rx</span>Care
        </h2>
      </NavLink>

      {/* ── Desktop Menu ─────────────────────────────────────────────────── */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-primary font-medium"
              : "text-gray-600 hover:text-primary transition"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive
              ? "text-primary font-medium"
              : "text-gray-600 hover:text-primary transition"
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? "text-primary font-medium"
              : "text-gray-600 hover:text-primary transition"
          }
        >
          Contact
        </NavLink>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full focus-within:border-primary transition">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-400 text-sm"
            type="text"
            placeholder="Search medicines..."
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.836 10.615 15 14.695"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              clipRule="evenodd"
              d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Cart Icon */}
        <div
          onClick={() => {
            navigate("/cart");
            scrollTo(0, 0);
          }}
          className="relative cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="#615fff"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-4.5 h-4.5 rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        </div>

        {/* Seller Login — hidden when user OR seller logged in */}
        {!isSeller && !user && (
          <button
            onClick={() => navigate("/seller")}
            className="cursor-pointer px-5 py-2 bg-primary/10 hover:bg-primary/20 transition text-primary border border-primary rounded-full text-sm font-medium"
          >
            Seller Login
          </button>
        )}

        {/* ── Auth Area ───────────────────────────────────────────────── */}
        {!user && !isSeller ? (
          // No one logged in
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm font-medium"
          >
            Login
          </button>
        ) : (
          // User or Seller logged in — show avatar + dropdown
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 transition px-3 py-1.5 rounded-full cursor-pointer"
            >
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-primary hidden xl:block">
                {isSeller ? "Seller" : user?.name?.split(" ")[0]}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-primary transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (isSeller ? <SellerDropdown /> : <UserDropdown />)}
          </div>
        )}
      </div>

      {/* ── Mobile: Cart + Hamburger ────────────────────────────────────── */}
      <div className="flex items-center gap-5 sm:hidden">
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="#615fff"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-4.5 h-4.5 rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        </div>

        <button onClick={() => setOpen(!open)} aria-label="Menu">
          <svg
            width="21"
            height="15"
            viewBox="0 0 21 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="21" height="1.5" rx=".75" fill="#426287" />
            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
            <rect
              x="6"
              y="13"
              width="15"
              height="1.5"
              rx=".75"
              fill="#426287"
            />
          </svg>
        </button>
      </div>

      {/* ── Mobile Menu Drawer ──────────────────────────────────────────── */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[65px] left-0 w-full bg-white shadow-md py-5 flex-col items-start gap-3 px-6 text-sm md:hidden z-40 border-t border-gray-100`}
      >
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            isActive ? "text-primary font-semibold" : "text-gray-600"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/products"
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            isActive ? "text-primary font-semibold" : "text-gray-600"
          }
        >
          All Products
        </NavLink>
        {user && (
          <NavLink
            to="/my-orders"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : "text-gray-600"
            }
          >
            My Orders
          </NavLink>
        )}
        {isSeller && (
          <NavLink
            to="/seller"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : "text-gray-600"
            }
          >
            Dashboard
          </NavLink>
        )}
        <NavLink
          to="/contact"
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            isActive ? "text-primary font-semibold" : "text-gray-600"
          }
        >
          Contact
        </NavLink>

        <div className="flex flex-col gap-2 w-full pt-3 border-t border-gray-100">
          {/* Seller Login */}
          {!isSeller && !user && (
            <button
              onClick={() => {
                setOpen(false);
                navigate("/seller");
              }}
              className="cursor-pointer px-6 py-2.5 bg-primary/10 hover:bg-primary/20 transition text-primary border border-primary rounded-full text-sm font-medium text-center"
            >
              Seller Login
            </button>
          )}

          {/* Login / Logout */}
          {!user && !isSeller ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2.5 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm font-medium text-center"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="cursor-pointer flex items-center justify-center gap-2 px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 transition rounded-full text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
