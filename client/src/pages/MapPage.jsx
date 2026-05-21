import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TempleGlobeMap from "../components/TempleGlobeMap.jsx";
import { templeData as fallbackTempleData } from "../data/temples.js";
import { hasTempleCoordinates, normalizeTemple } from "../utils/temple.js";
import "../pages/MapPage.css";

const regionOptions = ["All", "Northeast", "South", "Midwest", "West"];

const Map = () => {
    const navigate = useNavigate();
    const [selectedState, setSelectedState] = useState(null);
    const [selectedTemple, setSelectedTemple] = useState(null);
    const [templeData, setTempleData] = useState([]);
    const [templesLoading, setTemplesLoading] = useState(true);
    const [templesError, setTemplesError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeRegion, setActiveRegion] = useState("All");
    const [showOnlyWithTemples, setShowOnlyWithTemples] = useState(false);

    useEffect(() => {
        let ignore = false;

        async function loadTemples() {
            setTemplesLoading(true);
            setTemplesError("");

            try {
                const response = await fetch("/api/temples");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Could not load temples");
                }

                if (!ignore) {
                    const temples = Array.isArray(data) && data.length > 0
                        ? data
                        : fallbackTempleData;
                    setTempleData(temples.map(normalizeTemple));
                }
            } catch (error) {
                if (!ignore) {
                    setTemplesError("Showing sample temple data while the live directory is unavailable.");
                    setTempleData(fallbackTempleData.map(normalizeTemple));
                }
            } finally {
                if (!ignore) {
                    setTemplesLoading(false);
                }
            }
        }

        loadTemples();

        return () => {
            ignore = true;
        };
    }, []);

    const templeCountByState = useMemo(() => {
        return templeData.reduce((counts, temple) => {
            counts[temple.state] = (counts[temple.state] || 0) + 1;
            return counts;
        }, {});
    }, [templeData]);

    const statesWithTemples = useMemo(() => {
        return Object.keys(templeCountByState);
    }, [templeCountByState]);

    const filteredStates = useMemo(() => {
        const groupedStates = statesWithTemples.map((state) => {
            const temples = templeData.filter((temple) => temple.state === state);

            return {
                state,
                count: temples.length,
                region: temples[0]?.region || "Other",
                temples,
            };
        });

        return groupedStates.filter((item) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                item.state.toLowerCase().includes(search) ||
                item.temples.some((temple) =>
                    temple.name.toLowerCase().includes(search)
                );

            const matchesRegion =
                activeRegion === "All" || item.region === activeRegion;

            return matchesSearch && matchesRegion;
        });
    }, [searchTerm, activeRegion, statesWithTemples, templeData]);

    const filteredTemples = useMemo(() => {
        if (!selectedState) return [];

        return templeData.filter(
            (temple) => temple.state.toLowerCase() === selectedState.toLowerCase()
        );
    }, [selectedState, templeData]);

    const handleStateClick = (stateName) => {
        setSelectedState(stateName);
        setSelectedTemple(null);
    };

    const handleTempleClick = (temple) => {
        setSelectedState(temple.state);
        setSelectedTemple(temple);
    };

    const openTempleDetailsPage = (event, temple) => {
        event.preventDefault();
        event.stopPropagation();
        navigate(`/temples/${temple.id}`);
    };

    const clearSelection = () => {
        setSelectedState(null);
        setSelectedTemple(null);
    };

    return (
        <main className="temple-map-page">
            <aside className="directory-sidebar">
                <div className="brand">Saddha.org</div>

                <h2>Temple Directory</h2>

                {templesError && (
                    <p className="map-load-error">{templesError}</p>
                )}

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search temples or states..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <span>⌕</span>
                </div>

                <div className="region-tabs">
                    {regionOptions.map((region) => (
                        <button
                            key={region}
                            className={activeRegion === region ? "active" : ""}
                            onClick={() => setActiveRegion(region)}
                        >
                            {region}
                        </button>
                    ))}
                </div>

                <div className="state-list">
                    {templesLoading && (
                        <p className="map-loading-text">Loading temples...</p>
                    )}

                    {!templesLoading && filteredStates.map((item) => (
                        <div key={item.state}>
                            <button
                                className={`state-row ${
                                    selectedState === item.state ? "selected" : ""
                                }`}
                                onClick={() => handleStateClick(item.state)}
                            >
                                <span>{item.state}</span>
                                <span className="count-badge">{item.count}</span>
                            </button>

                            {selectedState === item.state && (
                                <div className="state-temple-dropdown" key={`${item.state}-temples`}>
                                    {item.temples.map((temple, index) => (
                                        <button
                                            key={temple.id}
                                            className="temple-sub-row"
                                            style={{ "--row-delay": `${Math.min(index * 0.035, 0.28)}s` }}
                                            onClick={() => handleTempleClick(temple)}
                                        >
                                            <span className="dot"></span>
                                            <span>{temple.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </aside>

            <TempleGlobeMap
                selectedState={selectedState}
                selectedTemple={selectedTemple}
                templeData={templeData}
                templeCountByState={templeCountByState}
                filteredTemples={filteredTemples}
                showOnlyWithTemples={showOnlyWithTemples}
                onShowOnlyWithTemplesChange={setShowOnlyWithTemples}
                onStateSelect={handleStateClick}
                onTempleSelect={handleTempleClick}
                onTempleDetailsOpen={openTempleDetailsPage}
            />

            <aside className={`details-panel ${selectedState ? "open" : ""}`}>
                {selectedState ? (
                    <>
                        <button className="close-btn" onClick={clearSelection}>
                            ×
                        </button>

                        <div className="state-temple-panel" key={`${selectedState}-panel`}>
                            <p className="state-label">{selectedState}</p>
                            <h2>Temples in {selectedState}</h2>

                            {filteredTemples.length > 0 ? (
                                <div className="right-temple-list">
                                    {filteredTemples.map((temple, index) => (
                                        <button
                                            key={temple.id}
                                            className={`right-temple-row ${
                                                selectedTemple?.id === temple.id ? "active" : ""
                                            }`}
                                            style={{ "--row-delay": `${Math.min(index * 0.035, 0.28)}s` }}
                                            onClick={() => handleTempleClick(temple)}
                                        >
                                            <span className="dot"></span>
                                            <span>
                                                <strong>{temple.name}</strong>
                                                <small>{temple.address}</small>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-state-temples">
                                    No temples are listed for this state yet.
                                </p>
                            )}
                        </div>

                        {selectedTemple ? (
                            <>
                                <img
                                    src={selectedTemple.imageUrl}
                                    alt={selectedTemple.name}
                                    className="details-image"
                                />

                                <div className="details-content" key={`${selectedTemple.id}-details`}>
                                    <p className="state-label">{selectedTemple.state}</p>
                                    <h2>{selectedTemple.name}</h2>

                                    <div className="info-card">
                                        <span>⌖</span>
                                        <div>
                                            <small>Address</small>
                                            <p>{selectedTemple.address}</p>
                                        </div>
                                    </div>

                                    <div className="info-card">
                                        <span>♙</span>
                                        <div>
                                            <small>Chief Monk / Guardian</small>
                                            <p>{selectedTemple.chiefMonk}</p>
                                        </div>
                                    </div>

                                    <div className="info-card">
                                        <span>☎</span>
                                        <div>
                                            <small>Contact</small>
                                            <p>{selectedTemple.contact}</p>
                                        </div>
                                    </div>

                                    <div className="info-card">
                                        <span>✉</span>
                                        <div>
                                            <small>Email</small>
                                            <p>{selectedTemple.email}</p>
                                        </div>
                                    </div>

                                    <div className="history-box">
                                        <small>History & Background</small>
                                        <p>{selectedTemple.history}</p>
                                    </div>

                                    <div className="details-actions">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                hasTempleCoordinates(selectedTemple)
                                                    ? `${selectedTemple.lat},${selectedTemple.lng}`
                                                    : selectedTemple.address || selectedTemple.name
                                            )}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Get Directions
                                        </a>

                                        <button onClick={(event) => openTempleDetailsPage(event, selectedTemple)}>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="state-details-prompt">
                                <p>Select a temple from the map or this list to view its details.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-details">
                        <h2>No temple selected</h2>
                        <p>Click a state or temple marker to view temple information.</p>
                    </div>
                )}
            </aside>

        </main>
    );
};

export default Map;
