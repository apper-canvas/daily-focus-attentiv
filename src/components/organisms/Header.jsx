import React, { useContext } from "react"
import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { AuthContext } from "../App"

const Header = () => {
  const { logout } = useContext(AuthContext)
  const { user, isAuthenticated } = useSelector((state) => state.user)
  
  const navItems = [
    { path: "/today", label: "Today", icon: "Home" },
    { path: "/tasks", label: "Tasks", icon: "CheckSquare" },
    { path: "/notes", label: "Notes", icon: "FileText" },
    { path: "/meetings", label: "Meetings", icon: "Calendar" }
  ]

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-indigo-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Daily Focus</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105",
                    isActive
                      ? "bg-gradient-to-r from-primary to-indigo-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )
                }
              >
                <ApperIcon name={item.icon} className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User section and logout */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Welcome, {user.firstName || user.name || "User"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="inline-flex items-center gap-2"
                >
                  <ApperIcon name="LogOut" className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
              <ApperIcon name="Menu" className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="md:hidden pb-4">
          <div className="flex items-center justify-around">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-gray-600 hover:text-gray-900"
                  )
                }
              >
                <ApperIcon name={item.icon} className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </div>
          
          {/* Mobile user section */}
          {isAuthenticated && user && (
            <div className="flex items-center justify-center mt-3 pt-3 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="inline-flex items-center gap-2"
              >
                <ApperIcon name="LogOut" className="h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header