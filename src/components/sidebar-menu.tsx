import { useRef } from "react";
import { NavLink } from "react-router-dom";
import { DollarSignIcon, InstagramIcon, MailIcon, XIcon } from "lucide-react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import useClickOutside from "@/hooks/use-click-outside";
import { cn } from "@/utils/styles";

import BpmTapperIcon from "@/components/icons/bpm-tapper-icon";
import LoudnessMeterIcon from "@/components/icons/loudness-meter-icon";
import MetronomeIcon from "@/components/icons/metronome-icon";
import SimilarSongFinderIcon from "@/components/icons/similar-song-finder-icon";
import SynthesizerIcon from "@/components/icons/synthesizer-icon";
import TunerIcon from "@/components/icons/tuner-icon";

const tools = [
  {
    path: "/synthesizer",
    Icon: SynthesizerIcon,
    name: "Synthesizer",
  },
  {
    path: "/similar-song-finder",
    Icon: SimilarSongFinderIcon,
    name: "Similar Song Finder",
  },
  {
    path: "/tuner",
    Icon: TunerIcon,
    name: "Tuner",
  },
  {
    path: "/metronome",
    Icon: MetronomeIcon,
    name: "Metronome",
  },
  {
    path: "/loudness-meter",
    Icon: LoudnessMeterIcon,
    name: "Loudness Meter",
  },
  {
    path: "/bpm-tapper",
    Icon: BpmTapperIcon,
    name: "BPM Tapper",
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

const SidebarMenu = ({ open, onClose }: Props) => {
  const ref = useRef(null);

  useClickOutside(ref, () => open && onClose());

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-40 flex h-full w-full max-w-[240px] flex-col justify-between bg-card p-4 transition duration-200 ease-in-out md:static gap-8",
        !open && "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="flex flex-col gap-8 overflow-hidden">
        <div className="flex items-center justify-between">
          <Logo onClick={onClose} />
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="visible p-1 md:hidden"
          >
            <XIcon />
          </Button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto">
          {tools.map(({ path, Icon, name }) => (
            <NavLink
              key={name}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  isActive && "bg-background",
                  "flex items-center gap-4 rounded-md p-2",
                )
              }
            >
              <Icon width={36} height={36} />
              <h2>{name}</h2>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Button asChild size="icon">
              <a href="mailto:enoahstudio@gmail.com">
                <MailIcon className="h-[1.2rem] w-[1.2rem]" />
              </a>
            </Button>
            <Button asChild size="icon">
              <a href="https://www.instagram.com/enoahmusic/" target="_blank">
                <InstagramIcon className="h-[1.2rem] w-[1.2rem]" />
              </a>
            </Button>
          </div>
          <Button asChild variant="secondary" size="icon">
            <a
              href="https://www.paypal.com/donate/?business=AKW7CBTBNXFXA&no_recurring=0&item_name=Your+donation+will+help+me+maintain+and+improve+PolyAux+%F0%9F%99%8C&currency_code=USD"
              target="_blank"
            >
              <DollarSignIcon className="h-[1.2rem] w-[1.2rem]" />
            </a>
          </Button>
        </div>
        <p className="text-sm text-muted">© 2023 Noah Lee</p>
      </div>
    </aside>
  );
};

export default SidebarMenu;
