import { CheckCircle } from "lucide-react";

const AboutSection = () => {

  const imageURL = "../../../src/assets/hero3.jpg";  

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
            <h1 className="font-bold text-4xl text-[#000d6b] mt-4">
              About Us
            </h1>
            <h2 className="text-4xl font-bold mb-6">Welcome to SeatEase.io</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At SeatEase.io, we are revolutionizing the public transportation
              experience with our innovative automated seat booking system. Our
              platform makes traveling convenient, whether you’re commuting or
              heading out for an adventure.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Enjoy real-time seat availability, a secure booking process, and
              reliable service at your fingertips. With SeatEase.io, forget the
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
      <div className="about-stats mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-item text-center p-6 bg-gray-100 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
          <p className="text-lg text-gray-600 mb-2">Customers</p>
          <h4 className="text-3xl text-maroon-600 font-bold mb-2">150+</h4>
          <p className="text-lg text-gray-600">Total Customers</p>
        </div>
   
     
        <div className="stat-item text-center p-6 bg-gray-100 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
          <p className="text-lg text-gray-600 mb-2">Tickets</p>
          <h4 className="text-3xl text-maroon-600 font-bold mb-2">5,000+</h4>
          <p className="text-lg text-gray-600">Total Vehicles</p>
        </div>
      
        <div className="stat-item text-center p-6 bg-gray-100 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
          <p className="text-lg text-gray-600 mb-2">Routes</p>
          <h4 className="text-3xl text-maroon-600 font-bold mb-2">200+</h4>
          <p className="text-lg text-gray-600">Total Routes</p>
        </div>
        
        <div className="stat-item text-center p-6 bg-gray-100 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
          <p className="text-lg text-gray-600 mb-2">Vehicles</p>
          <h4 className="text-3xl text-maroon-600 font-bold mb-2">1,000+</h4>
          <p className="text-lg text-gray-600">Total Vehicles</p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
