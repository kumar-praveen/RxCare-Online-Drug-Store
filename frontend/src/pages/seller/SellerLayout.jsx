import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  PlusSquare,
  List,
  ShoppingBag,
  LogOut,
  User,
  Menu,
  X,
  LayoutDashboard,
  Upload
} from "lucide-react";
import { useState } from "react";

const SellerLayout = () => {
  const { setIsSeller, axios } = useAppContext();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarLinks = [
    {
      name: "Dashboard",
      path: "/seller",
      icon: LayoutDashboard,
    },
    {
      name: "Add Product",
      path: "/seller/add-product",
      icon: PlusSquare,
    },
    { name: "Bulk Upload", path: "/seller/bulk-add-product", icon: Upload },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: List,
    },
    {
      name: "Orders",
      path: "/seller/orders",
      icon: ShoppingBag,
    },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        toast.success(data.message);
        setIsSeller(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const SidebarContent = () => (
    <>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-5 mb-3">
        Navigation
      </p>
      {sidebarLinks.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === "/seller"}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all border-r-4 ${
              isActive
                ? "bg-primary/10 text-primary border-primary"
                : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-700"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={`w-4.5 h-4.5 ${
                  isActive ? "text-primary" : "text-gray-400"
                }`}
              />
              {item.name}
            </>
          )}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-3.5 bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-500 hover:text-primary transition"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <Link to="/">
            <h2 className="text-xl font-bold">
              <span className="text-primary">Rx</span>Care
            </h2>
          </Link>
          <span className="hidden sm:block text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            Seller Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium">Admin</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition px-4 py-1.5 rounded-full font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-200 min-h-[calc(100vh-57px)] sticky top-[57px] pt-6">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="w-60 bg-white border-r border-gray-200 pt-6 flex flex-col shadow-xl">
              <SidebarContent />
            </div>
            <div
              onClick={() => setSidebarOpen(false)}
              className="flex-1 bg-black/30 backdrop-blur-sm"
            />
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
