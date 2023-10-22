import { MouseEvent } from "react";
import { Link } from "react-router-dom";
import PolyAuxDarkIcon from "@/components/icons/polyaux-dark-icon";
import PolyAuxLightIcon from "@/components/icons/polyaux-light-icon";
import { useTheme } from "@/contexts/theme";

type Props = {
  size?: number;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
};

const Logo = ({ size = 48, disabled, onClick }: Props) => {
  const { theme } = useTheme();

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <Link
      to="/"
      onClick={onClick}
      className={disabled ? "pointer-events-none" : ""}
    >
      {theme === "dark" || (theme === "system" && prefersDark) ? (
        <PolyAuxDarkIcon width={size} height={size} />
      ) : (
        <PolyAuxLightIcon width={size} height={size} />
      )}
    </Link>
  );
};

export default Logo;
