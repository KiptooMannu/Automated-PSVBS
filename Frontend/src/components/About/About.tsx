import { CheckCircle } from "lucide-react";

const AboutSection = () => {
  // Local image URL (public folder)
  const imageURL = "../../../src/assets/Bus.jpg";  // Adjust this path based on where you placed your image

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center lg:space-x-8">
        {/* Image Section */}
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <div className="max-w-lg mx-auto lg:mx-0">
            <img
              src={imageURL}
              alt="Public Transport Bus"
              className="w-full rounded-lg shadow-lg object-cover" // Ensures the image covers the space properly
              loading="lazy"
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="lg:w-1/2">
          <div className="max-w-lg mx-auto lg:mx-0">
          <h2 className=" text-3xl font-bold mb-8 text-primary">
        About Us
      </h2>
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
    </div>
  );
};

export default AboutSection;
