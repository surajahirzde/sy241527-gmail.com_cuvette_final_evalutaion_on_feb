import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./helper/ErrorPage";
import RootLayout from "./helper/RootLayout";
const Homepage = lazy(() => import("./components/Homepage"));
const Controller = lazy(() => import("./components/Controller"));
const PlayQuiz = lazy(() => import("./components/PlayQuiz"));
const Loader = lazy(() => import("./helper/Loader"));

const App = () => {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
        <Route index element={<Homepage />} />
        <Route path="/admin" element={<Controller />}>
          <Route path=":section" element={<Controller />} />
          <Route path="analytics/:QId" element={<Controller />} />
        </Route>
        <Route path="/quiz/:quizId" element={<PlayQuiz />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    )
  );

  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={routes} />
    </Suspense>
  );
};

export default App;
