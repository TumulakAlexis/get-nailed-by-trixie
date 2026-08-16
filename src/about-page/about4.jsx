import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid, faPlus, faCloudArrowUp, faXmark, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import './about4.css';

// Sub-component for individual review cards
const ReviewCard = ({ rev, renderStars, onCardClick }) => {
  const CHARACTER_LIMIT = 90;
  const commentText = rev.comment || "";
  const isLongText = commentText.length > CHARACTER_LIMIT;
  const displayedText = isLongText ? commentText.slice(0, CHARACTER_LIMIT) + "..." : commentText;

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
        {isLongText && <span className="about4-read-more-hint">Tap to read full review</span>}
      </div>

      {rev.imageUrl && (
        <div className="about4-review-img-wrapper">
          <img src={rev.imageUrl} alt="Client Work" className="about4-review-photo" />
        </div>
      )}
    </div>
  );
};

// Sub-component for Analytics & Breakdown Graph
const AnalyticsHeader = ({ averageRating, totalReviews, distribution, renderStars, onOpenModal }) => (
  <div className="about4-analytics-card">
    <div className="about4-score-overview">
      <span className="about4-big-score">{averageRating}</span>
      <div className="about4-big-stars">{renderStars(averageRating)}</div>
      <span className="about4-total-count">Based on {totalReviews} reviews</span>
      <button className="about4-write-btn" onClick={onOpenModal}>
        <FontAwesomeIcon icon={faPlus} /> Leave a Review
      </button>
    </div>

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
);

// Sub-component for Write Review Modal
const ReviewModal = ({ isOpen, onClose, onSubmit, formData, setFormData, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div className="about4-modal-overlay">
      <div className="about4-modal-content">
        <div className="about4-modal-header">
          <div>
            <span className="about4-modal-tag">Feedback</span>
            <h3>Share Your Experience</h3>
          </div>
          <button className="about4-close-icon-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="about4-form">
          <div className="about4-input-group">
            <label>Your Name</label>
            <input 
              type="text" 
              value={formData.clientName} 
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} 
              placeholder="e.g. Sarah Jenkins" 
              required 
            />
          </div>

          <div className="about4-input-group">
            <label>Rating (1 to 5 Stars)</label>
            <select value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })}>
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
              value={formData.comment} 
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })} 
              placeholder="How was your visit?" 
              rows="3"
              required 
            />
          </div>

          <div className="about4-input-group">
            <label>Upload Photo (Optional)</label>
            <div className="about4-file-upload-box">
              <FontAwesomeIcon icon={faCloudArrowUp} className="about4-upload-icon" />
              <span>{formData.selectedFile ? formData.selectedFile.name : "Choose a photo or drag it here"}</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setFormData({ ...formData, selectedFile: e.target.files[0] })} 
              />
            </div>
          </div>

          <div className="about4-modal-buttons">
            <button type="button" className="about4-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="about4-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-component for Full Review Detail Modal
const ReviewDetailModal = ({ review, onClose, renderStars }) => {
  if (!review) return null;

  return (
    <div className="about4-modal-overlay" onClick={onClose}>
      <div className="about4-modal-content about4-detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="about4-modal-header">
          <div>
            <span className="about4-modal-tag">Review Details</span>
            <h3>{review.clientName}</h3>
          </div>
          <button className="about4-close-icon-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="about4-detail-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div className="about4-card-stars">{renderStars(review.rating)}</div>
          <span className="about4-review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
        </div>

        <p className="about4-detail-comment">"{review.comment}"</p>

        {review.imageUrl && (
          <div className="about4-detail-img-container">
            <img src={review.imageUrl} alt="Full Review" className="about4-detail-img" />
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const About4 = () => {
  const data = useQuery(api.reviews.getReviewsWithAnalytics);
  const generateUploadUrl = useMutation(api.reviews.generateUploadUrl);
  const addReview = useMutation(api.reviews.addReview);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ clientName: "", rating: 5, comment: "", selectedFile: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeReviewDetail, setActiveReviewDetail] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!data) return <div className="about4-loading">Loading reviews...</div>;

  const { reviews, averageRating, totalReviews, distribution } = data;
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientName || !formData.comment) return alert("Please fill in your name and review.");
    
    setIsSubmitting(true);
    try {
      let imageStorageId = undefined;

      if (formData.selectedFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": formData.selectedFile.type },
          body: formData.selectedFile,
        });
        const json = await result.json();
        imageStorageId = json.storageId;
      }

      await addReview({
        clientName: formData.clientName,
        rating: Number(formData.rating),
        comment: formData.comment,
        imageStorageId,
      });

      setFormData({ clientName: "", rating: 5, comment: "", selectedFile: null });
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

        <AnalyticsHeader 
          averageRating={averageRating}
          totalReviews={totalReviews}
          distribution={distribution}
          renderStars={renderStars}
          onOpenModal={() => setIsModalOpen(true)}
        />

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

        <ReviewModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
        />

        <ReviewDetailModal 
          review={activeReviewDetail}
          onClose={() => setActiveReviewDetail(null)}
          renderStars={renderStars}
        />
      </div>
    </section>
  );
};

export default About4;