import React from 'react';
import "./TempleDetails.css"

const TempleDetails = ({ temple, onBack }) => {
    if (!temple){
        return (
            <div className="temple-details-page">
                <button onClick={onBack}> Back to Map</button>
                <p> No temple selected</p>
            </div>
        );
    }

    return (
        <main className="temple-details-page">
            <header className="details-top-nav">
                <div className="logo">Saddha.org</div>
                <nav aria-label="Temple details navigation">
                    <a href="#overview">Overview</a>
                    <a href="#history">History</a>
                    <a href="#gallery">Gallery</a>
                    <a href="#events">Events</a>
                    <button type="button" onClick={onBack}>Back to Map</button>
                </nav>
            </header>

            <section className="hero-gallery">
                <div className="hero-image-large">
                    <img src={temple.imageUrl} alt={temple.name} />
                    <div className="hero-overlay">
                        <h1>{temple.name}</h1>
                        <p>{temple.address}</p>
                    </div>
                </div>

                <div className="hero-image">
                    <img src={temple.gallery?.[0] || temple.imageUrl} alt="Temple view" />
                </div>

                <div className={"hero-image"}>
                    <img src={temple.gallery?.[1] || temple.imageUrl} alt="Temple monk" />
                </div>
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

                        <div className="event-cards">

                            <div>

                                <span>☸</span>

                                <h3>Dharma Events</h3>

                                <p>Regular sermons and meditation programs.</p>

                            </div>

                            <div>

                                <span>🙏</span>

                                <h3>Community Network</h3>

                                <p>Connect with Buddhist communities and volunteers.</p>

                            </div>

                            <div>

                                <span>📅</span>

                                <h3>Temple Directory</h3>

                                <p>Find other Buddhist temples across the United States.</p>

                            </div>

                        </div>

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

                    <div className="sidebar-card">

                        <h3>Dhamma Programs</h3>

                        <ul className="program-list">

                            <li>

                                <strong>Sunday Dhamma Sermon</strong>

                                <span>Every Sunday</span>

                            </li>

                            <li>

                                <strong>Meditation Sessions</strong>

                                <span>Weekly</span>

                            </li>

                            <li>

                                <strong>Poya Day Observance</strong>

                                <span>Monthly</span>

                            </li>

                            <li>

                                <strong>Dhamma School</strong>

                                <span>Sunday</span>

                            </li>

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
