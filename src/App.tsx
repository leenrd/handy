import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import Canvas from "./pages/canvas";

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/canvas",
    element: <Canvas />,
  },
]);

function App() {
  return (
    <main>
      <RouterProvider router={BrowserRouter} />
    </main>
  );
}

export default App;
