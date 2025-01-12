import { User, Settings, LogIn, LogOut, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "./ui/navigation-menu";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navigation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  const navigationItems = isAuthenticated ? (
    <>
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
        <Button variant="default" className="flex items-center gap-2" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </NavigationMenuItem>
    </>
  ) : (
    <NavigationMenuItem>
      <Link to="/signin">
        <Button variant="default" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </Link>
    </NavigationMenuItem>
  );

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md fixed top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-accent">
              FreelanceHub
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <NavigationMenu>
            <NavigationMenuList className="hidden md:flex space-x-4">
              {navigationItems}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  {isAuthenticated ? (
                    <>
                      <Link to="/dashboard" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                        <User className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link to="/leads" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                        Leads
                      </Link>
                      <Link to="/invoices" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                        Invoices
                      </Link>
                      <Link to="/contracts" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                        Contracts
                      </Link>
                      <Link to="/meetings" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                        Meetings
                      </Link>
                      <Link to="/expenses" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                        Expenses
                      </Link>
                      <Link to="/settings" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <Button variant="default" className="flex items-center gap-2 mt-4" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Link to="/signin">
                      <Button variant="default" className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};