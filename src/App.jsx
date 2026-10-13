import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import SignatureIntro from "./components/SignatureIntro";
import Pegboard from "./components/Pegboard";
import TravelModal from "./components/TravelModal";
import CaseStudies from "./components/CaseStudies";
import KpiStrip from "./components/KpiStrip";
import CaseStudyPage from "./components/CaseStudyPage";
import HowIWork from "./components/HowIWork";
import Contact from "./components/Contact";
import { travelPhotos } from "./components/travelData";
import { caseStudies, nextStudy } from "./data/caseStudies";

// Case study pages live at #/work/<slug>, so they work on any static host.
const STUDY_ROUTE = /^#\/work\/([\w-]+)$/;
const HOME_TITLE = document.title;

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

export default function App() {
  const [openIndex, setOpenIndex] = useState(null);
  const hash = useHash();
  const routed = caseStudies.find((s) => s.slug === hash.match(STUDY_ROUTE)?.[1]);
  // A study still in progress is not viewable, even from a typed or saved URL.
  const blocked = routed?.inProgress;
  const study = blocked ? undefined : routed;

  useEffect(() => {
    if (blocked) window.location.replace("#work");
  }, [blocked]);

  // Remember where the visitor was on the home page, so "Back" returns them there.
  const homeScroll = useRef(0);
  const pagesSinceHome = useRef(0);
  const previousStudy = useRef(study);

  useEffect(() => {
    if (study) return undefined;
    const onScroll = () => {
      homeScroll.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [study]);

  useLayoutEffect(() => {
    const was = previousStudy.current;
    previousStudy.current = study;
    document.title = study ? `${study.title} · Nikita Nair` : HOME_TITLE;
    if (study === was) return;
    if (study) {
      pagesSinceHome.current = was ? pagesSinceHome.current + 1 : 1;
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (pagesSinceHome.current > 0) {
      window.scrollTo({ top: homeScroll.current, behavior: "instant" });
      pagesSinceHome.current = 0;
    } else {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "instant" });
    }
  }, [study, hash]);

  function handleBack(e) {
    // Straight from the home page: step back so the scroll position is restored.
    if (pagesSinceHome.current === 1) {
      e.preventDefault();
      window.history.back();
    }
  }

  if (study) {
    return <CaseStudyPage study={study} next={nextStudy(study.slug)} onBack={handleBack} />;
  }

  return (
    <div id="top" className="relative min-h-screen bg-wall">
      <Navbar />
      <SignatureIntro />
      <main className="wall-surface w-full">
        <Pegboard onOpenTravel={setOpenIndex} />
      </main>

      <KpiStrip />
      <CaseStudies />
      <HowIWork />
      <Contact />

      <AnimatePresence>
        {openIndex !== null && (
          <TravelModal
            photos={travelPhotos}
            initialIndex={openIndex}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
