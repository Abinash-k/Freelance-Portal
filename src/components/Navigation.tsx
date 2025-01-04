import { User, Settings, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "./ui/navigation-menu";

export const Navigation = () => {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-md fixed top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-accent">FreelanceHub</span>
          </div>
          
          <NavigationMenu>
            <NavigationMenuList className="hidden md:flex space-x-4">
              <NavigationMenuItem>
                <Link to="/dashboard">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/settings">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/signin">
                  <Button variant="default" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};