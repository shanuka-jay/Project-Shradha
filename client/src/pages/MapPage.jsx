import React, { useMemo, useState, useEffect } from "react";
import TempleDetails from "../components/TempleDetails.jsx";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import "../pages/MapPage.css";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";


const regionOptions = ["All", "Northeast", "South", "Midwest", "West"];

const Map = () => {
    const [selectedState, setSelectedState] = useState(null);
    const [viewMode, setViewMode] = useState("map");
    const [selectedTemple, setSelectedTemple] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeRegion, setActiveRegion] = useState("All");
    const [showOnlyWithTemples, setShowOnlyWithTemples] = useState(false);
    const [templeData, setTempleData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                // Fetch from the backend running on port 5001
                const res = await fetch("http://localhost:5001/api/temples");
                if (!res.ok) throw new Error("Failed to fetch temples");
                const data = await res.json();
                setTempleData(data);
            } catch (err) {
                console.error("Error fetching temples:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTemples();
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

    const totalTemples = templeData.length;
    const totalStates = statesWithTemples.length;

    const filteredStates = useMemo(() => {
        const search = (searchTerm || "").toLowerCase();

        const groupedStates = statesWithTemples.map((state) => {
            let temples = templeData.filter((temple) => temple.state === state);

            if (search) {
                const stateMatches = (state || "").toLowerCase().includes(search);
                if (!stateMatches) {
                    temples = temples.filter((t) =>
                        (t.name || "").toLowerCase().includes(search)
                    );
                }
            }

            return {
                state,
                count: temples.length,
                region: temples[0]?.region || "Other",
                temples,
            };
        });

        return groupedStates.filter((item) => {
            const matchesRegion =
                activeRegion === "All" || item.region === activeRegion;

            return item.count > 0 && matchesRegion;
        });
    }, [searchTerm, activeRegion, statesWithTemples, templeData]);

    const filteredTemples = useMemo(() => {
        if (!selectedState) return [];

        return templeData.filter(
            (temple) => (temple.state || "").toLowerCase() === selectedState.toLowerCase()
        );
    }, [selectedState, templeData]);

    const handleStateClick = (geo) => {
        const stateName = geo?.properties?.name;
        if (!stateName) return;

        const count = templeCountByState[stateName] || 0;

        if (showOnlyWithTemples && count === 0) return;

        setSelectedState(stateName);

        const firstTemple = templeData.find((temple) => temple.state === stateName);
        setSelectedTemple(firstTemple || null);
    };

    const handleTempleClick = (temple) => {
        setSelectedState(temple.state);
        setSelectedTemple(temple);
        setViewMode("details");
    };

    const clearSelection = () => {
        setSelectedState(null);
        setSelectedTemple(null);
    };

    if (loading) {
        return (
            <main className="temple-map-page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
                <h2>Loading temple data from backend...</h2>
            </main>
        );
    }

    return (
        <main className="temple-map-page">
            <aside className="directory-sidebar">
                <div className="brand">Saddha.org</div>

                <h2>Temple Directory</h2>

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
                    {filteredStates.map((item) => (
                        <div key={item.state}>
                            <button
                                className={`state-row ${
                                    selectedState === item.state ? "selected" : ""
                                }`}
                                onClick={() => {
                                    setSelectedState(item.state);
                                    setSelectedTemple(item.temples[0] || null);
                                }}
                            >
                                <span>{item.state}</span>
                                <span className="count-badge">{item.count}</span>
                            </button>

                            {(selectedState === item.state || searchTerm !== "") &&
                                item.temples.map((temple) => (
                                    <button
                                        key={temple._id || temple.name}
                                        className="temple-sub-row"
                                        onClick={() => handleTempleClick(temple)}
                                    >
                                        <span className="dot"></span>
                                        <span>{temple.name}</span>
                                    </button>
                                ))}
                        </div>
                    ))}
                </div>
            </aside>

            <section className="map-main">


                <div className="map-controls">
                    <div className="selected-card">
                        <span className="dot"></span>
                        <div>
                            <strong>{selectedState || "Select a State"}</strong>
                            <p>{selectedTemple ? selectedTemple.name : "Temple"}</p>
                        </div>
                    </div>

                    <div className="filter-buttons">
                        <button
                            className={!showOnlyWithTemples ? "active" : ""}
                            onClick={() => setShowOnlyWithTemples(false)}
                        >
                            All States
                        </button>
                        <button
                            className={showOnlyWithTemples ? "active" : ""}
                            onClick={() => setShowOnlyWithTemples(true)}
                        >
                            With Temples
                        </button>
                    </div>
                </div>

                <div className="map-canvas">
                    <ComposableMap projection="geoAlbersUsa">
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const stateName = geo.properties.name;
                                    const isSelected = stateName === selectedState;
                                    const templeCount = templeCountByState[stateName] || 0;
                                    const centroid = geoCentroid(geo);
                                    const hasTemples = templeCount > 0;

                                    return (
                                        <g key={geo.rsmKey}>
                                            <Geography
                                                geography={geo}
                                                onClick={() => handleStateClick(geo)}
                                                className="state-shape"
                                                style={{
                                                    default: {
                                                        fill: isSelected
                                                            ? "#c9a447"
                                                            : hasTemples
                                                                ? "#eee5d3"
                                                                : "#f7f4ee",
                                                        stroke: "#ffffff",
                                                        strokeWidth: 0.8,
                                                        outline: "none",
                                                        cursor:
                                                            showOnlyWithTemples && !hasTemples
                                                                ? "not-allowed"
                                                                : "pointer",
                                                        opacity:
                                                            showOnlyWithTemples && !hasTemples ? 0.35 : 1,
                                                    },
                                                    hover: {
                                                        fill: hasTemples ? "#d6b764" : "#e8e1d2",
                                                        outline: "none",
                                                        cursor: "pointer",
                                                    },
                                                    pressed: {
                                                        fill: "#b99032",
                                                        outline: "none",
                                                    },
                                                }}
                                            />

                                            {templeCount > 0 && (
                                                <Marker coordinates={centroid}>
                                                    <circle
                                                        r={12}
                                                        fill="#c19a3b"
                                                        stroke="#ffffff"
                                                        strokeWidth={2}
                                                        pointerEvents="none"
                                                    />
                                                    <text
                                                        textAnchor="middle"
                                                        y={4}
                                                        fontSize={10}
                                                        fontWeight="700"
                                                        fill="#ffffff"
                                                        pointerEvents="none"
                                                    >
                                                        {templeCount}
                                                    </text>
                                                </Marker>
                                            )}
                                        </g>
                                    );
                                })
                            }
                        </Geographies>

                        {templeData.map((temple) => (
                            <Marker
                                key={temple._id || temple.name}
                                coordinates={[temple.lng, temple.lat]}
                                onClick={() => handleTempleClick(temple)}
                            >
                                <g
                                    className={`pin-marker ${
                                        selectedTemple?._id === temple._id ? "active" : ""
                                    }`}
                                    role="button"
                                    tabIndex="0"
                                    aria-label={`View details for ${temple.name}`}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            handleTempleClick(temple);
                                        }
                                    }}
                                >
                                    <circle r={6} fill="#b91c1c" stroke="#ffffff" strokeWidth={2} />
                                </g>
                            </Marker>
                        ))}
                    </ComposableMap>
                </div>
            </section>

            <aside className={`details-panel ${selectedTemple ? "open" : ""}`}>
                {selectedTemple ? (
                    <>
                        <button className="close-btn" onClick={clearSelection}>
                            ×
                        </button>

                        <img
                            src={selectedTemple.imageUrl}
                            alt={selectedTemple.name}
                            className="details-image"
                        />

                        <div className="details-content">
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
                                        selectedTemple.address
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Get Directions
                                </a>

                                <button onClick={() => setViewMode("details")}>View Details</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-details">
                        <h2>No temple selected</h2>
                        <p>Click a state or temple marker to view temple information.</p>
                    </div>
                )}
            </aside>

            {viewMode === "details" && selectedTemple && (
                <div className="temple-details-modal" role="dialog" aria-modal="true">
                    <button
                        className="modal-backdrop"
                        aria-label="Close temple details"
                        onClick={() => setViewMode("map")}
                    />
                    <div className="temple-details-modal-content">
                        <TempleDetails
                            temple={selectedTemple}
                            onBack={() => setViewMode("map")}
                        />
                    </div>
                </div>
            )}
        </main>
    );
};

export default Map;
