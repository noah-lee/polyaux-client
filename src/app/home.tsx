import Logo from "@/components/logo";
import heroUrl from "@/assets/hero.png";

const Home = () => {
  return (
    <div className="relative flex h-full flex-col items-center py-8">
      <Logo size={128} disabled />
      <img
        src={heroUrl}
        className="absolute bottom-0 h-1/2 w-full object-cover object-top"
      />
    </div>
  );
};

export default Home;
