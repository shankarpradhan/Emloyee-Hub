import Hero from "./components/Hero";
import HeroSection from "./components/About";
import Employee from "./services/Employee";
import Contact from "./contact/page";
export default function Home() {
  return (
    <>
      <Hero />
      <HeroSection />
      <Employee />
      <Contact />
    </>
  );
}
