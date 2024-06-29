import { FC } from "react";
import { Link } from "react-router-dom";

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  return (
    <section className="w-screen h-screen flex items-center justify-center flex-col">
      <img
        src="/lefty.png"
        alt="hand"
        className="absolute w-[600px] left-0 top-1/3"
      />
      <img
        src="/righty.png"
        alt="hand"
        className="absolute w-[600px] right-0 bottom-2/4"
      />
      <div className="flex flex-col gap-3 justify-center items-center mb-14">
        <h1 className="text-7xl tracking-tighter font-bold text-white">
          Handy
        </h1>
        <p className="text-white mt-2">
          Please allow the browser to access your camera.
        </p>
      </div>
      <button className="bg-white hover:bg-white/80 font-bold py-2 px-4 border rounded tracking-tighter ">
        <Link to="/canvas">Go to canvas</Link>
      </button>
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
    </section>
  );
};

export default Home;
