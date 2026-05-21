import React, { useEffect, useMemo, useState } from 'react';
import "./TempleDetails.css"
import { fallbackMonkImage, fallbackTempleImage } from "../utils/temple.js";
import GalleryLightbox from './GalleryLightbox';

const SERVICE_ICON_LABELS = {
    sun: "Dhamma service",
    moon: "Poya day",
    "book-open": "Dhamma school",
    heart: "Community",
    music: "Chanting",
    users: "Meditation",
    star: "Special event",
    calendar: "Weekly program",
    gift: "Dana",
    globe: "Cultural program",
};

const SERVICE_ICON_PATHS = {
    sun: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 7a5 5 0 100 10 5 5 0 000-10z",
    moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
    "book-open": "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
    heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    music: "M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    calendar: "M3 4h18M8 4V2m8 2V2M3 10h18M5 4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5z",
    gift: "M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
    globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
};

const EVENT_TYPE_ICON_PATHS = {
    "dhamma service": SERVICE_ICON_PATHS.sun,
    meditation: SERVICE_ICON_PATHS.users,
    school: SERVICE_ICON_PATHS["book-open"],
    celebration: SERVICE_ICON_PATHS.gift,
    vesak: SERVICE_ICON_PATHS.flower || "M12 2a4 4 0 0 1 4 4 4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 4-4zM12 8v8M8 12h8",
    "poson poya": SERVICE_ICON_PATHS.moon,
    other: SERVICE_ICON_PATHS.star,
    calendar: SERVICE_ICON_PATHS.calendar,
    clock: "M12 6v6l4 2M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z",
};

const ServiceIcon = ({ icon }) => {
    const label = SERVICE_ICON_LABELS[icon] || "Program";
    const path = SERVICE_ICON_PATHS[icon] || SERVICE_ICON_PATHS.star;

    return (
        <span className="program-icon" aria-label={label} title={label}>
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d={path} />
            </svg>
        </span>
    );
};

const InlineIcon = ({ path, label, className = "inline-icon" }) => (
    <svg
        className={className}
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label={label}
    >
        <path d={path} />
    </svg>
);

const EventTypeIcon = ({ eventType }) => {
    const normalizedType = eventType?.toLowerCase() || "other";
    const path = EVENT_TYPE_ICON_PATHS[normalizedType] || EVENT_TYPE_ICON_PATHS.other;

    return (
        <span className="event-type-icon" title={eventType || "Event"} aria-label={eventType || "Event"}>
            <InlineIcon path={path} label="" className="event-type-svg" />
        </span>
    );
};

const normalizeService = (service) => {
    if (!service) return null;

    if (typeof service === "string") {
        try {
            return normalizeService(JSON.parse(service));
        } catch {
            return { name: service, time: "", icon: "star" };
        }
    }

    return {
        name: service.name || "",
        time: service.time || "",
        icon: service.icon || "star",
    };
};

const formatEventDate = (dateTime) => {
    if (!dateTime) return "";

    const date = new Date(dateTime);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const formatEventTime = (dateTime, endDateTime) => {
    if (!dateTime) return "";

    const start = new Date(dateTime);
    if (Number.isNaN(start.getTime())) return "";

    const timeOptions = { hour: "numeric", minute: "2-digit" };
    const startTime = start.toLocaleTimeString("en-US", timeOptions);

    if (!endDateTime) return startTime;

    const end = new Date(endDateTime);
    if (Number.isNaN(end.getTime())) return startTime;

    return `Until ${end.toLocaleTimeString("en-US", timeOptions)}`;
};

const getPhoneHref = (phone) => {
    const normalizedPhone = String(phone || "").trim();
    const callablePhone = normalizedPhone.replace(/[^\d+]/g, "");

    return callablePhone ? `tel:${callablePhone}` : "";
};

const getTempleShareUrl = () => {
    if (typeof window === "undefined") return "";

    return window.location.href;
};

const getTempleHeroPhotos = (temple) => {
    const photos = [temple.imageUrl, ...(temple.gallery || [])]
        .map((photo) => String(photo || "").trim())
        .filter(Boolean);

    return [...new Set(photos)].slice(0, 3);
};

const handleImageFallback = (event) => {
    if (event.currentTarget.dataset.fallbackApplied) return;

    event.currentTarget.dataset.fallbackApplied = "true";
    event.currentTarget.src = fallbackTempleImage;
};

const handleMonkImageFallback = (event) => {
    if (event.currentTarget.dataset.fallbackApplied) return;

    event.currentTarget.dataset.fallbackApplied = "true";
    event.currentTarget.src = fallbackMonkImage;
};

const TempleDetails = ({ temple, onBack }) => {
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [eventsError, setEventsError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [lightboxIndex, setLightboxIndex] = useState(null); // null = closed

    useEffect(() => {
        if (!temple?.id) {
            setEvents([]);
            return;
        }

        let ignore = false;

        async function loadEvents() {
            setEventsLoading(true);
            setEventsError("");

            try {
                const response = await fetch(`/api/events?templeId=${encodeURIComponent(temple.id)}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Could not load events");
                }

                if (!ignore) {
                    setEvents(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                if (!ignore) {
                    setEvents([]);
                    setEventsError("Events are unavailable right now.");
                }
            } finally {
                if (!ignore) {
                    setEventsLoading(false);
                }
            }
        }

        loadEvents();

        return () => {
            ignore = true;
        };
    }, [temple?.id]);

    const upcomingEvents = useMemo(() => {
        const now = Date.now();

        return events
            .filter((event) => {
                const startsAt = new Date(event.dateTime).getTime();
                return event.recurring || (Number.isFinite(startsAt) && startsAt >= now);
            })
            .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
            .slice(0, 3);
    }, [events]);

    if (!temple){
        return (
            <div className="temple-details-page">
                <button onClick={onBack}> Back to Map</button>
                <p> No temple selected</p>
            </div>
        );
    }

    const templePrograms = (temple.services || [])
        .map(normalizeService)
        .filter((service) => service?.name?.trim());
    const heroPhotos = getTempleHeroPhotos(temple);
    const phoneHref = getPhoneHref(temple.contact);
    const emailAddress = String(temple.email || "").trim();

    const handleShare = async () => {
        const shareUrl = getTempleShareUrl();
        const shareData = {
            title: temple.name,
            text: `View ${temple.name} on Saddha.org`,
            url: shareUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                setActionMessage("");
                return;
            }

            if (navigator.clipboard && shareUrl) {
                await navigator.clipboard.writeText(shareUrl);
                setActionMessage("Temple page link copied to clipboard.");
                return;
            }

            setActionMessage("Sharing is unavailable in this browser.");
        } catch (error) {
            if (error.name !== "AbortError") {
                setActionMessage("Sharing is unavailable right now.");
            }
        }
    };

    const handleContactTemple = () => {
        if (!phoneHref) {
            setActionMessage("No contact number exists for this temple.");
            return;
        }

        setActionMessage("");
        window.location.href = phoneHref;
    };

    const handleSendMessage = () => {
        if (!emailAddress) {
            setActionMessage("No email address exists for this temple.");
            return;
        }

        const subject = encodeURIComponent(`Inquiry about ${temple.name}`);
        const body = encodeURIComponent(`Hello,\n\nI would like to contact ${temple.name}.\n\nThank you.`);

        setActionMessage("");
        window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    };

    return (
        <main className="temple-details-page">
            <header className="details-top-nav">
                <div className="logo"></div>
                <nav aria-label="Temple details navigation">
                    <a href="#overview">Overview</a>
                    <a href="#history">History</a>
                    <a href="#gallery">Gallery</a>
                    <a href="#programs">Programs</a>
                    <a href="#events">Events</a>
                    <button type="button" onClick={onBack}>Back to Map</button>
                </nav>
            </header>

            <section className={`hero-gallery hero-gallery--count-${heroPhotos.length}`}>
                {heroPhotos.map((photo, index) => (
                    <div
                        className={index === 0 ? "hero-image-large" : "hero-image"}
                        key={photo}
                    >
                        <img
                            src={photo}
                            alt={index === 0 ? temple.name : `${temple.name} view ${index + 1}`}
                            onError={handleImageFallback}
                        />
                    </div>
                ))}
            </section>

            <section className="hero-summary">
                <div className="hero-summary-copy">
                    <h1>{temple.name}</h1>
                    <p>{temple.address}</p>
                </div>

                <div className="hero-summary-actions">
                    <a
                        className="hero-action-btn"
                        href={
                            Number.isFinite(temple.lat) && Number.isFinite(temple.lng)
                                ? `https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lng}`
                                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(temple.address || temple.name)}`
                        }
                        target="_blank"
                        rel="noreferrer"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                        Directions
                    </a>

                    <button className="hero-action-btn" type="button" onClick={handleShare}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        Share
                    </button>

                    <button className="hero-action-btn hero-action-btn--primary" type="button" onClick={handleContactTemple}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 6.23 6.23l1.76-1.76a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        Contact Temple
                    </button>
                </div>

            </section>

            {actionMessage && (
                <p className="details-action-message" role="status">{actionMessage}</p>
            )}

            <section className="details-layout">

                <article className="main-details">

                    <section id="overview" className="content-section">

                        <p className="section-label">Overview</p>

                        <h2>

                            About this <em>Temple</em>

                        </h2>

                        <p>{temple.description || temple.history}</p>

                        <div className="info-grid">

                            <div>

                                <small>Temple Name</small>

                                <strong>{temple.name}</strong>

                            </div>

                            <div>

                                <small>State</small>

                                <strong>{temple.state}</strong>

                            </div>

                            <div>

                                <small>Chief Monk</small>

                                <strong>{temple.chiefMonk}</strong>

                            </div>

                            <div>

                                <small>Email</small>

                                <strong>{temple.email}</strong>

                            </div>

                            <div>

                                <small>Phone</small>

                                <strong>{temple.contact}</strong>

                            </div>

                            <div>

                                <small>Address</small>

                                <strong>{temple.address}</strong>

                            </div>

                        </div>

                    </section>

                    <section id="history" className="content-section">

                        <p className="section-label">History</p>

                        <h2>Temple History</h2>

                        <blockquote>

                            <p>{temple.history}</p>

                        </blockquote>



                    </section>

                    <section id="gallery" className="content-section">

                        <p className="section-label">Gallery</p>

                        <h2>Temple Photos</h2>

                        {(() => {
                            const allImages = [temple.imageUrl, ...(temple.gallery || [])]
                                .map((p) => String(p || "").trim())
                                .filter(Boolean)
                                .filter((v, i, arr) => arr.indexOf(v) === i);
                            const GRID_MAX = 5;
                            const gridImages = allImages.slice(0, GRID_MAX);
                            const remaining = allImages.length - GRID_MAX;

                            return (
                                <div className={`photo-grid photo-grid--${Math.min(gridImages.length, GRID_MAX)}`}>
                                    {gridImages.map((image, index) => {
                                        const isLastAndMore = index === GRID_MAX - 1 && remaining > 0;
                                        return (
                                            <div
                                                key={index}
                                                className="photo-tile"
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${temple.name} photo ${index + 1}`}
                                                    onError={handleImageFallback}
                                                />
                                                <div className="photo-tile-overlay">
                                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                                                </div>
                                                {isLastAndMore && (
                                                    <div className="photo-tile-more">
                                                        <span>+{remaining}</span>
                                                        <small>more photos</small>
                                <>
                                    <div className={`photo-grid photo-grid--${Math.min(gridImages.length, GRID_MAX)}`}>
                                        {gridImages.map((image, index) => {
                                            const isLastAndMore = index === GRID_MAX - 1 && remaining > 0;
                                            return (
                                                <div
                                                    key={index}
                                                    className="photo-tile"
                                                    role="button"
                                                    tabIndex={0}
                                                    aria-label={isLastAndMore ? `View all ${allImages.length} photos` : `View photo ${index + 1}`}
                                                    onClick={() => setLightboxIndex(isLastAndMore ? index : index)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLightboxIndex(index); }}
                                                >
                                                    <img src={image} alt={`${temple.name} photo ${index + 1}`} />
                                                    <div className="photo-tile-overlay">
                                                        {isLastAndMore ? (
                                                            <>
                                                                <span className="photo-tile-overlay__count">+{remaining}</span>
                                                                <small className="photo-tile-overlay__label">View all photos</small>
                                                            </>
                                                        ) : (
                                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                                                        )}
                                                    </div>
                                                    {isLastAndMore && (
                                                        <div className="photo-tile-more">
                                                            <span>+{remaining}</span>
                                                            <small>more photos</small>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {allImages.length > 0 && (
                                        <button
                                            type="button"
                                            className="gallery-view-all-btn"
                                            onClick={() => setLightboxIndex(0)}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                                            View all {allImages.length} photos
                                        </button>
                                    )}
                                    {lightboxIndex !== null && (
                                        <GalleryLightbox
                                            images={allImages}
                                            initialIndex={lightboxIndex}
                                            templeName={temple.name}
                                            onClose={() => setLightboxIndex(null)}
                                        />
                                    )}
                                </>
                            );
                        })()}

                    </section>

                    <section id="events" className="content-section">

                        <p className="section-label">Events</p>

                        <h2>Upcoming Events</h2>

                        {eventsLoading ? (
                            <p className="event-empty">Loading temple events...</p>
                        ) : eventsError ? (
                            <p className="event-empty">{eventsError}</p>
                        ) : upcomingEvents.length > 0 ? (
                            <div className="event-cards">
                                {upcomingEvents.map((event) => (
                                    <article className="event-card" key={event.id}>
                                        <EventTypeIcon eventType={event.eventType} />
                                        <h3>{event.title}</h3>
                                        <div className="event-detail-row">
                                            <InlineIcon path={EVENT_TYPE_ICON_PATHS.calendar} label="Date" />
                                            <span>
                                                {event.recurring && event.recurringPattern
                                                    ? event.recurringPattern
                                                    : formatEventDate(event.dateTime)}
                                            </span>
                                        </div>
                                        {formatEventTime(event.dateTime, event.endDateTime) && (
                                            <div className="event-detail-row">
                                                <InlineIcon path={EVENT_TYPE_ICON_PATHS.clock} label="Time" />
                                                <span>{formatEventTime(event.dateTime, event.endDateTime)}</span>
                                            </div>
                                        )}
                                        {event.description && <p>{event.description}</p>}
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <p className="event-empty">No upcoming events have been added for this temple yet.</p>
                        )}

                    </section>

                </article>

                <aside className="details-sidebar">

                    <div className="sidebar-card">

                        <h3>Contact Information</h3>

                        <div className="contact-row">

                            <small>Address</small>

                            <p>{temple.address}</p>

                        </div>

                        <div className="contact-row">

                            <small>Phone</small>

                            <p>{temple.contact}</p>

                        </div>

                        <div className="contact-row">

                            <small>Email</small>

                            <p>{temple.email}</p>

                        </div>

                        <button className="primary-btn" type="button" onClick={handleSendMessage}>
                            Send Message
                        </button>

                    </div>

                    <div className="sidebar-card monk-card">

                        <img
                            src={temple.monkImage || fallbackMonkImage}
                            alt="Chief monk"
                            onError={handleMonkImageFallback}
                        />

                        <h4>{temple.chiefMonk}</h4>

                        <small>Chief Monk</small>

                        <p>

                            Spiritual representative of {temple.name}, supporting Buddhist

                            practice and community service.

                        </p>

                    </div>

                    <div className="sidebar-card">

                        <h3>Location</h3>

                        <div className="map-preview">
                            <iframe
                                title={`${temple.name} location`}
                                src={
                                    Number.isFinite(temple.lat) && Number.isFinite(temple.lng)
                                        ? `https://www.google.com/maps?q=${temple.lat},${temple.lng}&output=embed`
                                        : `https://www.google.com/maps?q=${encodeURIComponent(temple.address || temple.name)}&output=embed`
                                }
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        <a
                            className="primary-link"
                            href={
                                Number.isFinite(temple.lat) && Number.isFinite(temple.lng)
                                    ? `https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lng}`
                                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(temple.address || temple.name)}`
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            Get Directions
                        </a>

                    </div>

                    <div id="programs" className="sidebar-card">

                        <h3>Dhamma Programs</h3>

                        {templePrograms.length > 0 ? (
                            <ul className="program-list">
                                {templePrograms.map((program, index) => (
                                    <li key={`${program.name}-${index}`}>
                                        <ServiceIcon icon={program.icon} />
                                        <div>
                                            <strong>{program.name}</strong>
                                            {program.time && <span>{program.time}</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="program-empty">No programmes have been added for this temple yet.</p>
                        )}

                    </div>

                </aside>

            </section>



        </main>

    );

};

export default TempleDetails;
