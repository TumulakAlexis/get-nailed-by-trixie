import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid, faPlus, faCloudArrowUp, faXmark, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import './about4.css';

// Sub-component for individual review cards (compact fit with full-card modal trigger)
const ReviewCard = ({ rev, renderStars, onCardClick }) => {
  const CHARACTER_LIMIT = 90; // Truncates text early to keep cards compact
  const commentText = rev.comment || "";
  const isLongText = commentText.length > CHARACTER_LIMIT;
  const displayedText = isLongText 
    ? commentText.slice(0, CHARACTER_LIMIT) + "..." 
    : commentText;

  return (
    <div className="about4-review-card" onClick={() => onCardClick(rev)}>
      <div className="about4-review-header">
        <div>
          <h4 className="about4-client-name">{rev.clientName}</h4>
          <span className="about4-review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="about4-card-stars">{renderStars(rev.rating)}</div>
      </div>
      
      <div className="about4-comment-box">
        <p className="about4-review-comment">"{displayedText}"</p>
        {isLongText && (
          <span className="about4-read-more-hint">Click to read more</span>
        )}
      </div>

      {rev.imageUrl && (
        <div className="about4-review-img-wrapper">
          <img src={rev.imageUrl} alt="Client Nail Art" className="about4-review-photo" />
        </div>
      )}
    </div>
  );
};

const About4 = () => {
  const data = useQuery(api.reviews.getReviewsWithAnalytics);
  const generateUploadUrl = useMutation(api.reviews.generateUploadUrl);
  const addReview = useMutation(api.reviews.addReview);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for review detail modal and expanding reviews past 3
  const [activeReviewDetail, setActiveReviewDetail] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!data) return <div className="about4-loading">Loading reviews...</div>;

  const { reviews, averageRating, totalReviews, distribution } = data;

  // Limit initial view to 3 reviews
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !comment) return alert("Please fill in your name and review.");
    
    setIsSubmitting(true);
    try {
      let imageStorageId = undefined;

      if (selectedFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });
        const json = await result.json();
        imageStorageId = json.storageId;
      }

      await addReview({
        clientName,
        rating: Number(rating),
        comment,
        imageStorageId,
      });

      setClientName("");
      setRating(5);
      setComment("");
      setSelectedFile(null);
      setIsModalOpen(false);
      alert("Thank you for your review!");
    } catch (err) {
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (score) => {
    return [...Array(5)].map((_, i) => (
      <FontAwesomeIcon 
        key={i} 
        icon={i < Math.floor(score) ? faStarSolid : faStarRegular} 
        className="about4-star" 
      />
    ));
  };

  return (
    <section className="about4-container" id="reviews">
      <div className="about4-content-wrapper">
        
        <span className="about4-subtitle">Client Testimonials</span>
        <h2>Loved By Our Clients</h2>

        {/* Analytics & Graph Header Box */}
        <div className="about4-analytics-card">
          <div className="about4-score-overview">
            <span className="about4-big-score">{averageRating}</span>
            <div className="about4-big-stars">{renderStars(averageRating)}</div>
            <span className="about4-total-count">Based on {totalReviews} reviews</span>
            <button className="about4-write-btn" onClick={() => setIsModalOpen(true)}>
              <FontAwesomeIcon icon={faPlus} /> Leave a Review
            </button>
          </div>

          {/* Rating Breakdown Graph */}
          <div className="about4-graph-breakdown">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="about4-graph-row">
                  <span className="about4-graph-label">{star} <FontAwesomeIcon icon={faStarSolid} /></span>
                  <div className="about4-graph-bar-bg">
                    <div className="about4-graph-bar-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="about4-graph-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List Grid */}
        <div className="about4-reviews-grid">
          {reviews.length === 0 ? (
            <p className="about4-no-reviews">No reviews yet. Be the first to leave one!</p>
          ) : (
            displayedReviews.map((rev) => (
              <ReviewCard 
                key={rev._id} 
                rev={rev} 
                renderStars={renderStars} 
                onCardClick={setActiveReviewDetail} 
              />
            ))
          )}
        </div>

        {/* See More / See Less All Reviews Toggle (Triggered if more than 3) */}
        {reviews.length > 3 && (
          <div className="about4-show-more-container">
            <button 
              className="about4-show-more-reviews-btn" 
              onClick={() => setShowAllReviews(!showAllReviews)}
            >
              {showAllReviews ? (
                <>Show Less <FontAwesomeIcon icon={faChevronUp} /></>
              ) : (
                <>See More Reviews ({reviews.length - 3} more) <FontAwesomeIcon icon={faChevronDown} /></>
              )}
            </button>
          </div>
        )}

        {/* Modern Add Review Modal */}
        {isModalOpen && (
          <div className="about4-modal-overlay">
            <div className="about4-modal-content">
              <div className="about4-modal-header">
                <div>
                  <span className="about4-modal-tag">Feedback</span>
                  <h3>Share Your Experience</h3>
                </div>
                <button className="about4-close-icon-btn" onClick={() => setIsModalOpen(false)}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="about4-form">
                <div className="about4-input-group">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                    placeholder="e.g. Sarah Jenkins" 
                    required 
                  />
                </div>

                <div className="about4-input-group">
                  <label>Rating (1 to 5 Stars)</label>
                  <select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="5">★★★★★ (5/5) - Excellent</option>
                    <option value="4">★★★★☆ (4/5) - Very Good</option>
                    <option value="3">★★★☆☆ (3/5) - Average</option>
                    <option value="2">★★☆☆☆ (2/5) - Fair</option>
                    <option value="1">★☆☆☆☆ (1/5) - Poor</option>
                  </select>
                </div>

                <div className="about4-input-group">
                  <label>Your Review</label>
                  <textarea 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    placeholder="How was your visit with Trixie?" 
                    rows="3"
                    required 
                  />
                </div>

                <div className="about4-input-group">
                  <label>Upload Nail Photo (Optional)</label>
                  <div className="about4-file-upload-box">
                    <FontAwesomeIcon icon={faCloudArrowUp} className="about4-upload-icon" />
                    <span>{selectedFile ? selectedFile.name : "Choose a photo or drag it here"}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setSelectedFile(e.target.files[0])} 
                    />
                  </div>
                </div>

                <div className="about4-modal-buttons">
                  <button type="button" className="about4-cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="about4-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Full Review Details Modal */}
        {activeReviewDetail && (
          <div className="about4-modal-overlay" onClick={() => setActiveReviewDetail(null)}>
            <div className="about4-modal-content about4-detail-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="about4-modal-header">
                <div>
                  <span className="about4-modal-tag">Review Details</span>
                  <h3>{activeReviewDetail.clientName}</h3>
                </div>
                <button className="about4-close-icon-btn" onClick={() => setActiveReviewDetail(null)}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              <div className="about4-detail-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div className="about4-card-stars">{renderStars(activeReviewDetail.rating)}</div>
                <span className="about4-review-date">{new Date(activeReviewDetail.createdAt).toLocaleDateString()}</span>
              </div>

              <p className="about4-detail-comment">"{activeReviewDetail.comment}"</p>

              {activeReviewDetail.imageUrl && (
                <div className="about4-detail-img-container">
                  <img src={activeReviewDetail.imageUrl} alt="Full Client Nail Art" className="about4-detail-img" />
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default About4;