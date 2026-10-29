import { lazy, Suspense, useLayoutEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import { MotionConfig } from "framer-motion";
import { CardTransitionProvider } from "./transition/CardTransition";
import Home from "./pages/Home";

// Les pages secondaires sont chargées à la demande (accueil plus léger)
const ProjectPage = lazy(() => import("./pages/Project"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
import NotFound from "./pages/NotFound";

/** Remonte en haut de page à chaque changement d'URL. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    // reducedMotion="user" : Framer Motion respecte automatiquement prefers-reduced-motion
    <MotionConfig reducedMotion="user">
      <CardTransitionProvider>
        <ScrollToTop />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projets/:slug" element={<ProjectPage />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </CardTransitionProvider>
    </MotionConfig>
  );
}
