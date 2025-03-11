import { Link } from 'react-router-dom';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Hero.scss';

const Hero = () => {
    const user = useSelector((state: RootState) => state.user);
    const name = user.user?.first_name;

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 hero-bg flex justify-center items-center">
            {/* Background Overlay */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50"></div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : -20 }}
                transition={{ duration: 1 }}
                className="relative z-10 text-center text-neutral-content"
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: loaded ? 1 : 0.9 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className="flex flex-col justify-center items-center"
                >
                    {/* Heading */}
                    <h1 className="mb-6 mt-4 text-3xl lg:text-5xl font-bold text-white text-shadow-lg">
    Welcome to {' '}
    <span className="text-webcolor">
    Automated Public Service Vehicle 
    </span>
    <br />
    <span className="text-webcolor">
    Seat Booking System
    </span>
    {name && (
        <span className="block text-xl mt-2">
            {name}!
        </span>
    )}
</h1>

                    {/* Description */}
                    <p className="mt-4 mb-6 text-lg lg:text-xl text-white max-w-2xl px-4">
                        Book affordable and convenient PSV seats effortlessly
                        with our automated reservation system. Experience secure
                        payments, real-time availability, and hassle-free travel
                        planning at your fingertips.
                    </p>

                    {/* Book Now Button */}
                    <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="mt-4"
>
    <button
        onClick={() => {
            if (user?.user?.user_id) {
                // ✅ User is logged in, navigate to booking form
                window.location.href = "/dashboard/booking_form";
            } else {
                // ❌ User is NOT logged in, show an alert or redirect to login
                alert("You must log in first to book a seat!");
                window.location.href = "/login"; // Redirect to login page
            }
        }}
        className="btn text-white hover:text-black bg-orange-700 hover:bg-orange-600 transition-all duration-300 px-8 py-3 rounded-full text-lg lg:text-xl"
    >
        Book Now!!
    </button>
</motion.div>


                    {/* Links */}
                    <div className="mt-8 flex justify-center gap-6">
                        {/* About Us Link */}
                        <motion.div
                            whileHover={{
                                scale: 1.2,
                                color: '#f97316',
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link
                                to="/about"
                                className="text-white text-lg transition-colors duration-300"
                            >
                                About Us
                            </Link>
                        </motion.div>

                        {/* Contact Link */}
                        <motion.div
                            whileHover={{
                                scale: 1.2,
                                color: '#f97316',
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link
                                to="/Contact"
                                className="text-white text-lg transition-colors duration-300"
                            >
                                Contact
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Hero;
