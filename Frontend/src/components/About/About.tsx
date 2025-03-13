import { CheckCircle } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const AboutSection = () => {
  const imageURL = "../../../src/assets/hero3.jpg";

  // Use the useInView hook to trigger the counting animation when the stats section comes into view
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger the animation only once
    threshold: 0.5, // Trigger when 50% of the element is visible
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center lg:space-x-8">
        {/* Image Section */}
        <div className="lg:w-1/2 mb-8 lg:mb-0 h-full">
          <div className="max-w-lg mx-auto lg:mx-0 h-full">
            <img
              src={imageURL}
              alt="Public Transport Bus"
              className="w-full h-full rounded-lg shadow-lg object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="lg:w-1/2">
          <div className="max-w-lg mx-auto lg:mx-0">
            {/* Updated "About Us" title to match the h2 style */}
            <h2 className="text-4xl font-bold text-[#000d6b] mb-6">
              About Us
            </h2>
            <h2 className="text-4xl font-bold text-[#000d6b] mb-6">
              Welcome to Automated Public Service Vehicle Seat Booking System
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At Automated Public Service Vehicle Seat Booking System, we are
              revolutionizing the public transportation experience with our
              innovative automated seat booking platform. Our system makes
              traveling convenient, whether you’re commuting daily or heading out
              for an adventure.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Enjoy real-time seat availability, a secure booking process, and
              reliable service at your fingertips. With our system, forget the
              hassle of crowded buses and last-minute booking stress.
            </p>
            <div>
              <p className="text-lg text-gray-700 flex items-center mb-4">
                <CheckCircle className="mr-2 text-primary" />
                Real-time seat availability and booking.
              </p>
              <p className="text-lg text-gray-700 flex items-center mb-4">
                <CheckCircle className="mr-2 text-primary" />
                Hassle-free and secure online payments.
              </p>
              <p className="text-lg text-gray-700 flex items-center">
                <CheckCircle className="mr-2 text-primary" />
                Quick and easy booking process.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div
        ref={ref}
        className="about-stats mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="stat-item text-center p-6 bg-gray-100 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
          <p className="text-lg text-gray-600 mb-2">Customers</p>
          <h4 className="text-3xl text-maroon-600 font-bold mb-2">
            {inView ? (
              <CountUp start={0} end={150} duration={2} suffix="+" />
            ) : (
              "0+"
            )}
          </h4>
          <p className="text-lg text-gray-600">Satisfied Customers</p>
        </div>

        <div className="stat-item text-center p-6 bg-gray-100 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
          <p className="text-lg text-gray-600 mb-2">Bookings</p>
          <h4 className="text-3xl text-maroon-600 font-bold mb-2">
            {inView ? (
              <CountUp start={0} end={5000} duration={2} suffix="+" />
            ) : (
              "0+"
            )}
          </h4>
          <p className="text-lg text-gray-600">Successful Bookings</p>
        </div>

        <div className="stat-item text-center p-6 bg-gray-100 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
          <p className="text-lg text-gray-600 mb-2">Routes</p>
          <h4 className="text-3xl text-maroon-600 font-bold mb-2">
            {inView ? (
              <CountUp start={0} end={200} duration={2} suffix="+" />
            ) : (
              "0+"
            )}
          </h4>
          <p className="text-lg text-gray-600">Covered Routes</p>
        </div>

        <div className="stat-item text-center p-6 bg-gray-100 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
          <p className="text-lg text-gray-600 mb-2">Vehicles</p>
          <h4 className="text-3xl text-maroon-600 font-bold mb-2">
            {inView ? (
              <CountUp start={0} end={1000} duration={2} suffix="+" />
            ) : (
              "0+"
            )}
          </h4>
          <p className="text-lg text-gray-600">Registered Vehicles</p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;