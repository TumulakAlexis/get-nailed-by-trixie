import React, { useState, useRef, useEffect } from 'react';
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
                imageStorageId: storageId, // Will be null if no image selected
            });

            const templateParams = {
                user_name: formData.name,
                user_email: formData.email,
                user_phone: formData.phone,
                user_facebook: formData.facebook,
                booking_date: format(selectedDate, 'MMMM d, yyyy'),
                booking_slot: selectedSlot,
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
                        <h2 className="modal-title-date">{format(selectedDate, 'MMMM d')}</h2>

                        {step === 1 ? (
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
                        ) : (
                            <form className="modal-form" onSubmit={handleBooking}>
                                <div className="input-field">
                                    <input type="text" placeholder="Full Name" required 
                                        onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="input-field">
                                    <input type="text" placeholder="Facebook Name" required 
                                        onChange={e => setFormData({ ...formData, facebook: e.target.value })} />
                                </div>
                                <div className="input-field">
                                    <input type="email" placeholder="Email Address" required 
                                        onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="input-field">
                                    <input type="tel" placeholder="Phone Number" required 
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                                <div className="image-upload-wrapper">
                                    <div className={`upload-box ${selectedImage ? 'has-file' : ''}`} onClick={() => imageInput.current.click()}>
                                        <span className="upload-icon">{selectedImage ? '✅' : '📷'}</span>
                                        <p>{selectedImage ? selectedImage.name : "Add Reference (Optional)"}</p>
                                    </div>
                                    <input type="file" ref={imageInput} hidden accept="image/*" 
                                        onChange={(e) => setSelectedImage(e.target.files[0])} />
                                </div>
                                <div className="modal-form-actions single-action">
                                    <button type="submit" className="modal-main-btn" disabled={isUploading}>
                                        {isUploading ? "Processing..." : "Confirm Booking"}
                                    </button>
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