import Footer from "../../components/Footer/Footer"
import Navbar from "../../components/Navbar/Navbar"
import Hero from "./Hero"
import AboutSection from '../../components/About/About'
import Testimonial from '../../components/Testimonial/Testimonial'
import Contact from "../../components/Contact/Contact"


const HomePage = () => {
  return (
    <div>
        <Navbar />
        <Hero />
        <AboutSection/>
        <Testimonial/>
        <Contact/>
        <Footer />

    </div>
  )
}

export default HomePage