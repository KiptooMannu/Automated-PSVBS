import { Link } from 'react-router-dom';
import { RootState } from '../../app/store';
// import bgrides from '../../assets/images/bgrides.jpeg';
import bghome from '../../assets/bus station.jpg'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const Hero = () => {
    const user = useSelector((state: RootState) => state.user);
    const name = user.user?.first_name;

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div
            className="hero h-full lg:h-screen"
            style={{
                backgroundImage: `url(${bghome})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="hero-overlay bg-opacity-50 rounded-lg"></div>
            <div className={`hero-content text-neutral-content text-center transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : '-translate-y-10'}`}>
                    <h1 className="mb-5 text-3xl lg:text-5xl font-bold">
                        Welcome to Automated PSV Seat Reservation System,
                        <span className='text-webcolor'>
                            {name ? ` ${name}` : ''}
                        </span>
                    </h1>
                    <p className="mb-5">
                    Book affordable and convenient PSV seats effortlessly with our automated reservation system. Our solution ensures secure payments, 
                    real-time availability, and hassle-free travel planning for all.
                    </p>
                    <Link to="/dashboard/vehicles" className="btn bg-webcolor text-text-light hover:text-black border-none">Book Now!!</Link>
                </div>
            </div>
        </div>
    );
}

export default Hero;
