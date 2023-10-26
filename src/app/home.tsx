import Logo from "@/components/logo";
import HeroLight from "@/assets/hero-light.png";
import HeroDark from "@/assets/hero-dark.png";
import { useTheme } from "@/contexts/theme";

const Home = () => {
  const { theme } = useTheme();

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <div className="relative flex h-full flex-col items-center py-8">
      <Logo size={128} disabled />
      <img
        src={
          theme === "dark" || (theme === "system" && prefersDark)
            ? HeroDark
            : HeroLight
        }
        className="absolute bottom-0 h-1/2 w-full object-cover object-top"
      />
    </div>
  );
};

export default Home;
