import { LucideProps } from "lucide-react";

const SquareWaveIcon = (props: LucideProps) => {
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
      <path d="m2 6h2v12h4v-12h4v12h4v-12h4v12h2" />
    </svg>
  );
};

export default SquareWaveIcon;
