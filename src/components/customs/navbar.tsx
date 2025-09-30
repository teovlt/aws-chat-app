import { Menu, WormIcon, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeChanger } from "./theme-changer";
import { LanguageChanger } from "./language-changer";
import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const auth = useAuth();

  const close = () => setOpen(false);

  const signOutRedirect = () => {
    auth.signoutRedirect({
      post_logout_redirect_uri: "https://s3-cobra-web.s3.eu-west-1.amazonaws.com/index.html",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" onClick={close} className="text-xl font-bold hover:opacity-80 transition-colors">
          <WormIcon className="inline-block mr-2" />
          Cobra chat
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center space-x-4">
          <Separator orientation="vertical" className="h-6" />
          <ThemeChanger />
          <LanguageChanger />
          <Button variant="ghost" onClick={signOutRedirect} className="flex items-center space-x-2 cursor-pointer">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </nav>

        {/* Mobile */}
        <div className="flex md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Menu className="h-8 w-8 cursor-pointer" />
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-4 p-4">
              <SheetTitle />
              <div className="flex items-center justify-between">
                <Link to="/" onClick={close} className="text-xl font-bold hover:opacity-80 transition-colors">
                  <WormIcon className="inline-block mr-2" />
                  Cobra chat
                </Link>
              </div>

              <Separator />

              <ThemeChanger />
              <LanguageChanger />

              <Button variant="ghost" onClick={signOutRedirect} className="flex items-center space-x-2 cursor-pointer">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
