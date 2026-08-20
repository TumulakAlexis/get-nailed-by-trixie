import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from "convex/react"; 
import { api } from "../../convex/_generated/api";
import { format } from 'date-fns';
import emailjs from '@emailjs/browser';
import './bookingmodal.css';

const BookingModal = ({ selectedDate, onClose }) => {
    const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    const [step, setStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    // Service selection state
    const servicesData = useQuery(api.services.getServices) || [];
    const [selectedServices, setSelectedServices] = useState([]);

    const [formData, setFormData] = useState({
        name: '', facebook: '', phone: '', email: ''
    });

    const imageInput = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const slots = useQuery(api.bookings.getAvailableSlots, { date: dateKey });
    
    const generateUploadUrl = useMutation(api.bookings.generateUploadUrl);
    const createBooking = useMutation(api.bookings.createBooking);

    useEffect(() => {
        if (EMAILJS_PUBLIC_KEY) {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }
    }, [EMAILJS_PUBLIC_KEY]);

    const toggleService = (service) => {
        setSelectedServices(prev =>
            prev.find(s => s._id === service._id)
                ? prev.filter(s => s._id !== service._id)
                : [...prev, service]
        );
    };

    const totalServicePrice = useMemo(() => {
        return selectedServices.reduce((sum, s) => sum + s.price, 0);
    }, [selectedServices]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let storageId = null;

            // Optional Image Upload Logic
            if (selectedImage) {
                const postUrl = await generateUploadUrl();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": selectedImage.type },
                    body: selectedImage,
                });
                const response = await result.json();
                storageId = response.storageId;
            }

            await createBooking({
                name: formData.name,
                facebookName: formData.facebook,
                email: formData.email,
                phone: formData.phone,
                date: dateKey,
                slot: selectedSlot,
                imageStorageId: storageId,
                services: selectedServices.map(s => ({
                    name: s.name,
                    price: s.price
                })),
                totalFee: totalServicePrice,
            });

            const templateParams = {
                user_name: formData.name,
                user_email: formData.email,
                user_phone: formData.phone,
                user_facebook: formData.facebook,
                booking_date: format(selectedDate, 'MMMM d, yyyy'),
                booking_slot: selectedSlot,
                booking_services: selectedServices.map(s => s.name).join(', '),
                total_fee: `₱${totalServicePrice.toLocaleString()}`,
                to_email: formData.email,
            };

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );

            setIsSuccess(true); 
        } catch (err) {
            console.error("Booking Error:", err);
            alert("Something went wrong. Please check your connection.");
        } finally {
            setIsUploading(false);
        }
    };

    if (!slots) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <button className="close-x" onClick={onClose}>&times;</button>

                {isSuccess ? (
                    <div className="success-view">
                        <div className="success-icon">✨</div>
                        <h2 className="success-title">Booking Confirmed!</h2>
                        <p className="success-quote">"Life is not perfect, but your nails can be."</p>
                        <p className="success-subtext">
                            A confirmation has been sent to <strong>{formData.email}</strong>. <br /> 
                            See you on <strong>{format(selectedDate, 'MMMM d')}</strong> at <strong>{selectedSlot}</strong>!
                        </p>
                        <button className="modal-main-btn" onClick={onClose}>Done</button>
                    </div>
                ) : (
                    <>
                        <div className="modal-header-info">
                            <h2 className="modal-title-date">{format(selectedDate, 'MMMM d')}</h2>
                            <span className="step-indicator">Step {step} of 3</span>
                        </div>

                        {/* STEP 1: TIME SLOTS */}
                        {step === 1 && (
                            <div className="modal-step-content">
                                <div className="slot-container">
                                    {slots.map((slot) => (
                                        <div
                                            key={slot.time}
                                            className={`slot-row ${selectedSlot === slot.time ? 'selected' : ''} ${!slot.isAvailable ? 'disabled' : ''}`}
                                            onClick={() => slot.isAvailable && setSelectedSlot(slot.time)}
                                        >
                                            <span className="slot-time">{slot.time}</span>
                                            <span className={`slot-status ${slot.isAvailable ? 'vacant' : 'occupied'}`}>
                                                {slot.isAvailable ? 'Vacant' : 'Occupied'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <button className="modal-main-btn" disabled={!selectedSlot} onClick={() => setStep(2)}>
                                    Next
                                </button>
                            </div>
                        )}

                        {/* STEP 2: SERVICE SELECTION */}
                        {step === 2 && (
                            <div className="modal-step-content">
                                <div className="services-grid" style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                                    {servicesData.length > 0 ? (
                                        servicesData.map(s => {
                                            const isSelected = selectedServices.find(sel => sel._id === s._id);
                                            return (
                                                <div
                                                    key={s._id}
                                                    className={`slot-row ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => toggleService(s)}
                                                    style={{ 
                                                        justifyContent: 'space-between', 
                                                        padding: '10px 15px', 
                                                        borderRadius: '12px', 
                                                        border: isSelected ? '1.5px solid #2E403D' : '1px solid #eee',
                                                        background: isSelected ? '#f0f4ef' : '#fafafa',
                                                        fontSize: '1.1rem'
                                                    }}
                                                >
                                                    <div className="service-item-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        {s.imageUrl && <img src={s.imageUrl} alt="" className="mini-thumb" style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover' }} />}
                                                        <span style={{ color: '#333' }}>{s.name}</span>
                                                    </div>
                                                    <span style={{ color: '#798C71', fontWeight: 600 }}>₱{s.price.toLocaleString()}</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p style={{ textAlign: 'center', color: '#888' }}>No services found in menu.</p>
                                    )}
                                </div>

                                <div className="payment-summary" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', padding: '0 10px', fontWeight: 600, color: '#2E403D' }}>
                                    <span>Total:</span>
                                    <span style={{ color: '#798C71' }}>₱{totalServicePrice.toLocaleString()}</span>
                                </div>

                                <div className="modal-form-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <button type="button" className="back-link" onClick={() => setStep(1)}>Back</button>
                                    <button className="modal-main-btn" disabled={selectedServices.length === 0} onClick={() => setStep(3)} style={{ margin: 0, width: 'auto', padding: '16px 40px' }}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: CLIENT DETAILS */}
                        {step === 3 && (
                            <form className="modal-form" onSubmit={handleBooking}>
                                <div className="input-field">
                                    <input type="text" placeholder="Full Name" required 
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="input-field">
                                    <input type="text" placeholder="Facebook Name" required 
                                        value={formData.facebook}
                                        onChange={e => setFormData({ ...formData, facebook: e.target.value })} />
                                </div>
                                <div className="input-field">
                                    <input type="email" placeholder="Email Address" required 
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="input-field">
                                    <input type="tel" placeholder="Phone Number" required 
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                                <div className="image-upload-wrapper" onClick={() => imageInput.current.click()}>
                                    <div className={`upload-box ${selectedImage ? 'has-file' : ''}`}>
                                        <span className="upload-icon">{selectedImage ? '✅' : '📷'}</span>
                                        <p style={{ margin: 0 }}>{selectedImage ? selectedImage.name : "Add Reference (Optional)"}</p>
                                    </div>
                                    <input type="file" ref={imageInput} className="hidden-input" accept="image/*" 
                                        onChange={(e) => setSelectedImage(e.target.files[0])} />
                                </div>
                                <div className="modal-form-actions single-action" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                    <button type="submit" className="modal-main-btn" disabled={isUploading}>
                                        {isUploading ? "Processing..." : "Confirm Booking"}
                                    </button>
                                    <button type="button" className="back-link" onClick={() => setStep(2)}>Back</button>
                                </div>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingModal;