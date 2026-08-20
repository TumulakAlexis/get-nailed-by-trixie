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
        <div className="modal-overlay" onClick={onClose} style={{ padding: '16px', boxSizing: 'border-box' }}>
            <div 
                className="modal-card" 
                onClick={e => e.stopPropagation()}
                style={{ 
                    width: '100%', 
                    maxWidth: '420px', 
                    maxHeight: '90vh', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                }}
            >
                <button className="close-x" onClick={onClose}>&times;</button>

                {isSuccess ? (
                    <div className="success-view" style={{ padding: '20px 10px', textAlign: 'center' }}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                        <div className="modal-header-info" style={{ flexShrink: 0 }}>
                            <h2 className="modal-title-date">{format(selectedDate, 'MMMM d')}</h2>
                            <span className="step-indicator">Step {step} of 3</span>
                        </div>

                        {/* STEP 1: TIME SLOTS */}
                        {step === 1 && (
                            <div className="modal-step-content" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                                <div 
                                    className="slot-container" 
                                    style={{ 
                                        maxHeight: '45vh', 
                                        overflowY: 'auto', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        gap: '10px',
                                        paddingRight: '4px',
                                        width: '100%',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    {slots.map((slot) => (
                                        <div
                                            key={slot.time}
                                            className={`slot-row ${selectedSlot === slot.time ? 'selected' : ''} ${!slot.isAvailable ? 'disabled' : ''}`}
                                            onClick={() => {
                                                if (slot.isAvailable) {
                                                    setSelectedSlot(slot.time);
                                                    setStep(2);
                                                }
                                            }}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '14px 16px',
                                                borderRadius: '12px',
                                                border: selectedSlot === slot.time ? '1.5px solid #2E403D' : '1px solid #eee',
                                                background: selectedSlot === slot.time ? '#f0f4ef' : '#fafafa',
                                                cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                                                boxSizing: 'border-box'
                                            }}
                                        >
                                            <span className="slot-time" style={{ fontSize: '1rem', color: '#333' }}>{slot.time}</span>
                                            <span className={`slot-status ${slot.isAvailable ? 'vacant' : 'occupied'}`} style={{ fontWeight: 600, color: slot.isAvailable ? '#798C71' : '#ccc', fontSize: '0.9rem' }}>
                                                {slot.isAvailable ? 'Vacant' : 'Occupied'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: SERVICE SELECTION */}
                        {step === 2 && (
                            <div className="modal-step-content" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                                <div className="services-grid" style={{ maxHeight: '40vh', overflowY: 'auto', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
                                    {servicesData.length > 0 ? (
                                        servicesData.map(s => {
                                            const isSelected = selectedServices.find(sel => sel._id === s._id);
                                            return (
                                                <div
                                                    key={s._id}
                                                    className={`slot-row ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => toggleService(s)}
                                                    style={{ 
                                                        display: 'flex',
                                                        justifyContent: 'space-between', 
                                                        alignItems: 'center',
                                                        padding: '12px 15px', 
                                                        borderRadius: '12px', 
                                                        border: isSelected ? '1.5px solid #2E403D' : '1px solid #eee',
                                                        background: isSelected ? '#f0f4ef' : '#fafafa',
                                                        fontSize: '1rem',
                                                        boxSizing: 'border-box',
                                                        cursor: 'pointer'
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

                                <div className="payment-summary" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', padding: '0 5px', fontWeight: 600, color: '#2E403D' }}>
                                    <span>Total:</span>
                                    <span style={{ color: '#798C71' }}>₱{totalServicePrice.toLocaleString()}</span>
                                </div>

                                <div className="modal-form-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: 'auto' }}>
                                    <button type="button" className="back-link" onClick={() => setStep(1)}>Back</button>
                                    <button className="modal-main-btn" disabled={selectedServices.length === 0} onClick={() => setStep(3)} style={{ margin: 0, width: 'auto', padding: '14px 30px' }}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: CLIENT DETAILS */}
                        {step === 3 && (
                            <form className="modal-form" onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '55vh', paddingRight: '2px' }}>
                                <div className="input-field" style={{ marginBottom: '12px' }}>
                                    <input type="text" placeholder="Full Name" required 
                                        value={formData.name}
                                        style={{ fontSize: '16px', width: '100%', boxSizing: 'border-box' }}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="input-field" style={{ marginBottom: '12px' }}>
                                    <input type="text" placeholder="Facebook Name" required 
                                        value={formData.facebook}
                                        style={{ fontSize: '16px', width: '100%', boxSizing: 'border-box' }}
                                        onChange={e => setFormData({ ...formData, facebook: e.target.value })} />
                                </div>
                                <div className="input-field" style={{ marginBottom: '12px' }}>
                                    <input type="email" placeholder="Email Address" required 
                                        value={formData.email}
                                        style={{ fontSize: '16px', width: '100%', boxSizing: 'border-box' }}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="input-field" style={{ marginBottom: '12px' }}>
                                    <input type="tel" placeholder="Phone Number" required 
                                        value={formData.phone}
                                        style={{ fontSize: '16px', width: '100%', boxSizing: 'border-box' }}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                                <div className="image-upload-wrapper" onClick={() => imageInput.current.click()} style={{ marginBottom: '15px', cursor: 'pointer' }}>
                                    <div className={`upload-box ${selectedImage ? 'has-file' : ''}`} style={{ padding: '12px', boxSizing: 'border-box', textAlign: 'center' }}>
                                        <span className="upload-icon">{selectedImage ? '✅' : '📷'}</span>
                                        <p style={{ margin: 0, fontSize: '0.95rem' }}>{selectedImage ? selectedImage.name : "Add Reference (Optional)"}</p>
                                    </div>
                                    <input type="file" ref={imageInput} className="hidden-input" accept="image/*" 
                                        onChange={(e) => setSelectedImage(e.target.files[0])} />
                                </div>
                                <div className="modal-form-actions single-action" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingBottom: '5px' }}>
                                    <button type="submit" className="modal-main-btn" disabled={isUploading} style={{ width: '100%', boxSizing: 'border-box' }}>
                                        {isUploading ? "Processing..." : "Confirm Booking"}
                                    </button>
                                    <button type="button" className="back-link" onClick={() => setStep(2)}>Back</button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;