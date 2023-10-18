import { LucideProps } from "lucide-react";

const SineWaveIcon = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m2 6c4 0 0 12 4 12s0-12 4-12c4 1.1e-5 0 12 4 12s0-12 4-12 0 12 4 12" />
    </svg>
  );
};

export default SineWaveIcon;
