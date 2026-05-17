import React, { useEffect, useMemo, useState } from 'react';
import "./TempleDetails.css"

const DEFAULT_PROGRAMS = [
    { name: "Sunday Dhamma Sermon", time: "Every Sunday", icon: "sun" },
    { name: "Meditation Sessions", time: "Weekly", icon: "users" },
    { name: "Poya Day Observance", time: "Monthly", icon: "moon" },
    { name: "Dhamma School", time: "Sunday", icon: "book-open" },
];

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

const TempleDetails = ({ temple, onBack }) => {
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [eventsError, setEventsError] = useState("");

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
    const programs = templePrograms.length > 0 ? templePrograms : DEFAULT_PROGRAMS;

    return (
        <main className="temple-details-page">
            <header className="details-top-nav">
                <div className="logo">Saddha.org</div>
                <nav aria-label="Temple details navigation">
                    <a href="#overview">Overview</a>
                    <a href="#history">History</a>
                    <a href="#gallery">Gallery</a>
                    <a href="#programs">Programs</a>
                    <a href="#events">Events</a>
                    <button type="button" onClick={onBack}>Back to Map</button>
                </nav>
            </header>

            <section className="hero-gallery">
                <div className="hero-image-large">
                    <img src={temple.imageUrl} alt={temple.name} />
                </div>

                <div className="hero-image">
                    <img src={temple.gallery?.[0] || temple.imageUrl} alt="Temple view" />
                </div>

                <div className={"hero-image"}>
                    <img src={temple.gallery?.[1] || temple.imageUrl} alt="Temple monk" />
                </div>
            </section>

            <section className="hero-summary">
                <h1>{temple.name}</h1>
                <p>{temple.address}</p>
            </section>

            <section className="details-tabs">
                {/*<a href="#overview"> Overview</a>*/}
                {/*<a href="#history"> History</a>*/}
                {/*<a href="#gallery"> Gallery</a>*/}
                {/*<a href="#events" > Events</a>*/}

                <div className="tab-actions">
                    <a

                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(

                            temple.address

                        )}`}

                        target="_blank"

                        rel="noreferrer"

                    >

                        Directions

                    </a>

                    <button>Share</button>

                    <button>Contact Temple</button>

                </div>

            </section>

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

                            A sacred place established to support Buddhist practice,

                            meditation, cultural values, and community service.

                        </blockquote>

                        <p>{temple.history}</p>

                    </section>

                    <section id="gallery" className="content-section">

                        <p className="section-label">Gallery</p>

                        <h2>Temple Photos</h2>

                        <div className="photo-grid">

                            {(temple.gallery || [temple.imageUrl, temple.imageUrl, temple.imageUrl]).map(

                                (image, index) => (

                                    <img key={index} src={image} alt={`${temple.name} ${index + 1}`} />

                                )

                            )}

                        </div>

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

                        <button className="primary-btn">Send Message</button>

                    </div>

                    <div className="sidebar-card monk-card">

                        <img src={temple.monkImage || temple.imageUrl} alt="Chief monk" />

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

                                src={`https://www.google.com/maps?q=${encodeURIComponent(

                                    temple.address

                                )}&output=embed`}

                                loading="lazy"

                                referrerPolicy="no-referrer-when-downgrade"

                            />

                        </div>

                        <a

                            className="primary-link"

                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(

                                temple.address

                            )}`}

                            target="_blank"

                            rel="noreferrer"

                        >

                            Get Directions

                        </a>

                    </div>

                    <div id="programs" className="sidebar-card">

                        <h3>Dhamma Programs</h3>

                        <ul className="program-list">

                            {programs.map((program, index) => (
                                <li key={`${program.name}-${index}`}>
                                    <ServiceIcon icon={program.icon} />
                                    <div>
                                        <strong>{program.name}</strong>
                                        {program.time && <span>{program.time}</span>}
                                    </div>
                                </li>
                            ))}

                        </ul>

                    </div>

                </aside>

            </section>

            <footer className="details-footer">

                <div>

                    <h3>Saddha.org</h3>

                    <p>A sacred digital directory of Sri Lankan Buddhist temples.</p>

                </div>

                <div>

                    <h4>Pages</h4>

                    <p>Home</p>

                    <p>About</p>

                    <p>Temple Map</p>

                    <p>Contact</p>

                </div>

                <div>

                    <h4>Contact</h4>

                    <p>saddha.usa@gmail.com</p>

                    <p>Washington DC, USA</p>

                </div>

            </footer>

        </main>

    );

};

export default TempleDetails;
