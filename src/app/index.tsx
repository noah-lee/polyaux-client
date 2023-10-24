import SidebarMenu from "@/components/sidebar-menu";
import { ThemeSelector } from "@/components/theme-selector";
import { Button } from "@/components/ui/button";
import { useScrollContext } from "@/contexts/scroll";
import { MenuIcon } from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const App = () => {
  const { ref: scrollRef } = useScrollContext();

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (event: MouseEvent) => {
    event.stopPropagation();
    setOpen(true);
  };

  return (
    // <div className="flex h-screen">
    <div className="flex h-screen w-full" style={{ position: "fixed" }}>
      <SidebarMenu open={open} onClose={handleClose} />
      <main
        ref={scrollRef}
        className="flex min-h-screen flex-grow flex-col overflow-y-auto"
      >
        <header className="container sticky top-0 z-20 flex items-center justify-between p-2 md:justify-end">
          <Button
            size="icon"
            onClick={handleOpen}
            className="visible md:hidden"
          >
            <MenuIcon />
          </Button>
          <ThemeSelector />
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
