import { FC } from "react";
import { Link } from "react-router-dom";

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  return (
    <section className="bg-[#0d0d2f] w-screen h-screen flex items-center justify-center flex-col">
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
      <div className="flex flex-col gap-3 justify-center items-center mb-10">
        <h1 className="text-7xl tracking-tighter font-bold text-white">
          Handy
        </h1>
        <p className="text-white">
          Please allow the browser to access your camera.
        </p>
      </div>
      <button className="bg-white px-3 py-1 rounded-sm font-semibold tracking-tighter">
        <Link to="/canvas">Go to canvas</Link>
      </button>
    </section>
  );
};

export default Home;
