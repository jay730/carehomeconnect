
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Users, Home, Info, Shield, FileText, User, Settings, LogOut } from "lucide-react";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Get user role from user metadata if available
    if (user?.user_metadata?.role) {
      setUserRole(user.user_metadata.role);
      console.log("User role in AppLayout:", user.user_metadata.role);
    }

    // Get user profile data for avatar initials
    if (user) {
      const firstName = user.user_metadata?.first_name || "";
      const lastName = user.user_metadata?.last_name || "";
      setUserInitials(`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase());
      setUserName(`${firstName} ${lastName}`.trim());
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDashboardClick = () => {
    const dashboardPath = userRole === "owner" 
      ? "/owner/dashboard" 
      : "/family/dashboard";
    
    console.log("Navigating to dashboard:", dashboardPath);
    navigate(dashboardPath);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Check if user is on dashboard page
  const isOnDashboardPage = () => {
    return location.pathname.includes('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div onClick={() => navigate("/")} role="button">
            <Logo />
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="hidden md:flex" 
              onClick={() => navigate("/search")}
            >
              <Search className="h-4 w-4 mr-2" />
              Find homes
            </Button>
            
            {user ? (
              <>
                <Button 
                  variant={isOnDashboardPage() ? "default" : "ghost"}
                  onClick={handleDashboardClick}
                  className={isOnDashboardPage() ? "bg-care-600 hover:bg-care-700" : ""}
                >
                  Dashboard
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-9 w-9 rounded-full" aria-label="User menu">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-care-100 text-care-700 text-sm">
                          {userInitials || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
            <div>
              <Logo className="mb-4" />
              <p className="text-gray-600">
                Find the Perfect Residential Care Home with Care Home Connect
              </p>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                <Users size={20} className="text-care-600" />
                For Families
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="/search" className="text-gray-600 hover:text-care-600">
                    Search Homes
                  </a>
                </li>
                <li>
                  <a href="/resources" className="text-gray-600 hover:text-care-600">
                    Resources
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-gray-600 hover:text-care-600">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                <Home size={20} className="text-care-600" />
                Owners
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="/owner/list-property" className="text-gray-600 hover:text-care-600">
                    List Your Property
                  </a>
                </li>
                <li>
                  <a href="/owner/resources" className="text-gray-600 hover:text-care-600">
                    Owner Resources
                  </a>
                </li>
                <li>
                  <a href="/owner/faq" className="text-gray-600 hover:text-care-600">
                    Owner FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                <Info size={20} className="text-care-600" />
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="/about" className="text-gray-600 hover:text-care-600 flex items-center gap-2">
                    <Info size={16} />
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-600 hover:text-care-600 flex items-center gap-2">
                    <Shield size={16} />
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-600 hover:text-care-600 flex items-center gap-2">
                    <FileText size={16} />
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500">
              © {new Date().getFullYear()} Care Home Connect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export { AppLayout };
