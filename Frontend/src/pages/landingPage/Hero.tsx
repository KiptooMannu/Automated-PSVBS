import { Link } from 'react-router-dom';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import './Hero.scss'; // Import the SCSS file

const Hero = () => {
    const user = useSelector((state: RootState) => state.user);
    const name = user.user?.first_name;

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div className="relative min-h-screen hero-bg">
            <div className="hero-overlay bg-opacity-50"></div>
            <div className={`hero-content text-neutral-content text-center transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`flex flex-col justify-center items-center transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : '-translate-y-10'}`}>
    <h1 className="mb-5 text-3xl lg:text-5xl font-bold text-center">
        Welcome to Automated PSV Seat Reservation System,
        <span className="text-webcolor">
            {name ? ` ${name}` : ''}
        </span>
    </h1>
    <p className="mb-5 text-white text-center">
        Book affordable and convenient PSV seats effortlessly with our automated reservation system. Our solution ensures secure payments,
        real-time availability, and hassle-free travel planning for all.
    </p>
    <Link to="/dashboard/booking_form">
        <button className="btn text-text-light hover:text-black border-none bg-orange-700">
            Book Now!!
        </button>
    </Link>
</div>

            </div>
        </div>
    );
};

export default Hero;
