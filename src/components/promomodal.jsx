import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import './promomodal.css';

const PromoModal = ({ onBookNow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const promoData = useQuery(api.promo.getPromoSettings);

  useEffect(() => {
    // Check session storage so it pops up only once per visit session
    const hasSeenPromo = sessionStorage.getItem('hasSeenPromo');
    if (promoData?.promoActive && !hasSeenPromo && promoData?.imageUrl) {
      setIsOpen(true);
    }
  }, [promoData]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenPromo', 'true');
  };

  if (!isOpen || !promoData?.promoActive || !promoData?.imageUrl) return null;

  return (
    <div className="promo-overlay" onClick={handleClose}>
      <div className="promo-card-image-wrapper" onClick={(e) => e.stopPropagation()}>
        <button className="promo-close-btn" onClick={handleClose}>&times;</button>
        
        <img 
          src={promoData.imageUrl} 
          alt="Special Promo" 
          className="promo-banner-image"
          onClick={() => {
            handleClose();
            if (onBookNow) onBookNow();
          }}
        />
      </div>
    </div>
  );
};

export default PromoModal;