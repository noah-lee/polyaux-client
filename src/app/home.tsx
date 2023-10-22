import Hero from "@/components/hero";
import Logo from "@/components/logo";

const Home = () => {
  return (
    <div className="relative flex flex-grow flex-col items-center py-8">
      <Logo size={128} disabled />
      <Hero className="absolute bottom-0" />
    </div>
  );
};

export default Home;
