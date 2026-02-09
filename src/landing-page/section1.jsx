import './section1.css';
import Landing from '../assets/landing/landing.png'
import { HashLink } from 'react-router-hash-link/dist/react-router-hash-link.cjs.production';
import { motion } from 'framer-motion';

export default function Section1() {
    // Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const fadeInLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <section className="hero-container">
            <div className="hero-image-side">
                <img
                    src={Landing}
                    alt="Luxury Nail Art"
                    className="hero-img"
                />
            </div>

            <div className="hero-content-side">
                <motion.div 
                    className="text-wrapper"
                    initial="hidden"
                    whileInView="visible"
                    // Changed once: false so it animates every time it enters the screen
                    viewport={{ once: false, amount: 0.3 }}
                >
                    <motion.p variants={fadeInUp} className="hero-subtitle">
                        Your nail journey
                    </motion.p>
                    
                    <motion.h2 variants={fadeInUp} className="text-starts">
                        Starts
                    </motion.h2>

                    <div className="brand-highlight">
                        <motion.div 
                            variants={fadeInLeft}
                            className="with-polomolok-row"
                        >
                            <span className="text-with">with</span>
                            <h2 className="text-polomolok">Polomolok's</h2>
                        </motion.div>
                        
                        <motion.span 
                            variants={{
                                hidden: { opacity: 0, x: 20 },
                                visible: { opacity: 1, x: 0, transition: { delay: 0.4, duration: 0.8 } }
                            }}
                            className="text-finest"
                        >
                            Finest Nails!
                        </motion.span>
                    </div>

                    <motion.p 
                        variants={fadeInUp}
                        className="hero-quote"
                    >
                        “Where Luxury Meets <br /> Perfectly Crafted Nails.”
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <HashLink smooth to="/#services">
                            <button className="btn-services">Services</button>
                        </HashLink>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}