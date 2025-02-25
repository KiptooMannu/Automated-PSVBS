import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white w-full"> {/* Ensure full width */}
      <footer className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-white">CarHaven.io</h1>
          <p className='font-medium text-xl'>CarHaven.io is a car rental service that allows you to book a car from anywhere in the world.</p>
        </div>
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold text-white">Quick Links</h1>
          <ul className="space-y-2">
            <li><Link to='/' className="hover:text-gray-400">Home</Link></li>
            <li><Link to='/about' className="hover:text-gray-400">About</Link></li>
            <li><Link to='/cars' className="hover:text-gray-400">Cars</Link></li>
            <li><Link to='/contact' className="hover:text-gray-400">Contact</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-white">Head Office</h1>
          <ul className="space-y-2">
            <li>123 Nairobi</li>
            <li>Phone: +254 45768678</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-white">Newsletter</h1>
          <p>Subscribe to our newsletter to receive the latest news and exclusive offers every week.</p>
          <form className="flex flex-col space-y-2">
            <input type="email" placeholder="Enter your email" className="p-2 rounded bg-gray-700 text-white" />
            <button type="submit" className="p-2 rounded bg-primary hover:bg-primary-focus">Subscribe</button>
          </form>
        </div>
      </footer>
      <div className="bg-gray-700 text-center py-4">
        <p className='text-white'>© 2024 Car Rental. All Rights Reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
