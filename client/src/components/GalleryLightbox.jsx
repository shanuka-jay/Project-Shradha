import React, { useEffect, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import './GalleryLightbox.css';

const GalleryLightbox = ({ images, initialIndex = 0, templeName, onClose }) => {
    const [current, setCurrent] = useState(initialIndex);
    const [direction, setDirection] = useState(null); // 'next' | 'prev'
    const [animating, setAnimating] = useState(false);

    const total = images.length;

    const goTo = useCallback((index, dir) => {
        if (animating) return;
        setDirection(dir);
        setAnimating(true);
        setTimeout(() => {
            setCurrent(index);
            setAnimating(false);
        }, 280);
    }, [animating]);

    const goNext = useCallback(() => {
        goTo((current + 1) % total, 'next');
    }, [current, total, goTo]);

    const goPrev = useCallback(() => {
        goTo((current - 1 + total) % total, 'prev');
    }, [current, total, goTo]);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'ArrowRight') goNext();
            else if (e.key === 'ArrowLeft') goPrev();
            else if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [goNext, goPrev, onClose]);

    // Lock body scroll + inject a style tag that forces the backdrop to be truly fullscreen
    // (overrides any max-width / transform stacking context from parent containers)
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        // Inject override style to ensure nothing clips the portal
        const style = document.createElement('style');
        style.id = '__lightbox-override__';
        style.textContent = `
            .lightbox-backdrop {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                max-width: none !important;
                max-height: none !important;
                margin: 0 !important;
                padding: 0 !important;
                transform: none !important;
                z-index: 99999 !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.body.style.overflow = '';
            const existing = document.getElementById('__lightbox-override__');
            if (existing) existing.remove();
        };
    }, []);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const lightbox = (
        <div
            className="lightbox-backdrop"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label="Photo gallery"
        >
            {/* Close */}
            <button className="lightbox-close" onClick={onClose} aria-label="Close gallery">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>

            {/* Counter */}
            <div className="lightbox-counter">
                {current + 1} <span>/</span> {total}
            </div>

            {/* Main image area */}
            <div className="lightbox-stage">
                {/* Prev arrow */}
                {total > 1 && (
                    <button className="lightbox-arrow lightbox-arrow--prev" onClick={goPrev} aria-label="Previous photo">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                    </button>
                )}

                <div className={`lightbox-image-wrap ${animating ? `lightbox-image-wrap--${direction}` : ''}`}>
                    <img
                        src={images[current]}
                        alt={`${templeName} — photo ${current + 1}`}
                        className="lightbox-image"
                        draggable={false}
                    />
                </div>

                {/* Next arrow */}
                {total > 1 && (
                    <button className="lightbox-arrow lightbox-arrow--next" onClick={goNext} aria-label="Next photo">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"/>
                        </svg>
                    </button>
                )}
            </div>

            {/* Thumbnail strip */}
            {total > 1 && (
                <div className="lightbox-thumbs" role="list">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            className={`lightbox-thumb ${i === current ? 'lightbox-thumb--active' : ''}`}
                            onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                            aria-label={`Photo ${i + 1}`}
                            aria-pressed={i === current}
                            role="listitem"
                        >
                            <img src={img} alt="" draggable={false} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    return ReactDOM.createPortal(lightbox, document.body);
};

export default GalleryLightbox;
