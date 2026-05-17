import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ComposableMap,
    Geographies,
    Geography,
    Graticule,
    Marker,
    Sphere,
} from "react-simple-maps";
import { geoCentroid, geoDistance } from "d3-geo";
import { templeData as fallbackTempleData } from "../data/temples.js";
import { hasTempleCoordinates, normalizeTemple } from "../utils/temple.js";
import "../pages/MapPage.css";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const worldGeoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const globeStart = { rotate: [98, -38, 0], scale: 300 };
const usaFocus = { rotate: [98, -39, 0], scale: 520 };
const minGlobeScale = 250;
const maxGlobeScale = 760;

const regionOptions = ["All", "Northeast", "South", "Midwest", "West"];

const getPopupNameLines = (name = "") => {
    const words = name.split(" ").filter(Boolean);
    const lines = [];

    words.forEach((word) => {
        if (lines.length === 0) {
            lines.push(word);
            return;
        }

        const currentLine = lines[lines.length - 1] || "";
        const nextLine = currentLine ? `${currentLine} ${word}` : word;

        if (nextLine.length <= 22) {
            lines[lines.length - 1] = nextLine;
        } else if (lines.length < 2) {
            lines.push(word);
        }
    });

    if (lines.length > 2) {
        lines.length = 2;
    }

    const lastLine = lines[lines.length - 1] || "";
    if (lastLine.length > 24) {
        lines[lines.length - 1] = `${lastLine.slice(0, 21)}...`;
    }

    return lines.length ? lines : [name];
};

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
    const [globeRotate, setGlobeRotate] = useState(globeStart.rotate);
    const [globeScale, setGlobeScale] = useState(globeStart.scale);
    const [dragStart, setDragStart] = useState(null);

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

    const focusGlobe = (coordinates, scale = usaFocus.scale) => {
        if (!coordinates.every(Number.isFinite)) return;

        const [lng, lat] = coordinates;

        setGlobeRotate([-lng, -lat, 0]);
        setGlobeScale(scale);
    };

    const zoomGlobe = (direction) => {
        setGlobeScale((currentScale) => {
            const nextScale = currentScale + direction * 80;
            return Math.min(maxGlobeScale, Math.max(minGlobeScale, nextScale));
        });
    };

    const handleGlobeWheel = (event) => {
        event.preventDefault();
        zoomGlobe(event.deltaY > 0 ? -1 : 1);
    };

    const handleGlobePointerDown = (event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragStart({
            x: event.clientX,
            y: event.clientY,
            rotate: globeRotate,
        });
    };

    const handleGlobePointerMove = (event) => {
        if (!dragStart) return;

        const sensitivity = 0.45;
        const nextLng = dragStart.rotate[0] + (event.clientX - dragStart.x) * sensitivity;
        const nextLat = Math.max(
            -80,
            Math.min(80, dragStart.rotate[1] - (event.clientY - dragStart.y) * sensitivity)
        );

        setGlobeRotate([nextLng, nextLat, 0]);
    };

    const handleGlobePointerUp = (event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        setDragStart(null);
    };

    const isCoordinateVisible = (coordinates) => {
        const center = [-globeRotate[0], -globeRotate[1]];
        return geoDistance(coordinates, center) < Math.PI / 2;
    };

    const handleStateClick = (geo) => {
        const stateName = geo?.properties?.name;
        if (!stateName) return;

        const count = templeCountByState[stateName] || 0;

        if (showOnlyWithTemples && count === 0) return;

        setSelectedState(stateName);
        setSelectedTemple(null);

        const firstTemple = templeData.find((temple) => temple.state === stateName);

        if (firstTemple && hasTempleCoordinates(firstTemple)) {
            focusGlobe([firstTemple.lng, firstTemple.lat], 650);
        }
    };

    const handleMapStateClick = (event, geo) => {
        event.preventDefault();
        event.stopPropagation();
        setDragStart(null);
        handleStateClick(geo);
    };

    const handleTempleClick = (temple) => {
        setSelectedState(temple.state);
        setSelectedTemple(temple);
        if (hasTempleCoordinates(temple)) {
            focusGlobe([temple.lng, temple.lat], 700);
        }
    };

    const handleMapTempleClick = (event, temple) => {
        event.preventDefault();
        event.stopPropagation();
        setDragStart(null);
        handleTempleClick(temple);
    };

    const openTempleDetailsPage = (event, temple) => {
        event.preventDefault();
        event.stopPropagation();
        navigate(`/temples/${temple.id}`);
    };

    const handleCountryClick = (geo) => {
        const isUnitedStates =
            geo?.id === "840" ||
            geo?.id === 840 ||
            geo?.properties?.name === "United States of America";

        if (isUnitedStates) {
            setGlobeRotate(usaFocus.rotate);
            setGlobeScale(usaFocus.scale);
        }
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
                                onClick={() => {
                                    setSelectedState(item.state);
                                    setSelectedTemple(null);
                                    if (item.temples[0] && hasTempleCoordinates(item.temples[0])) {
                                        focusGlobe([item.temples[0].lng, item.temples[0].lat], 650);
                                    }
                                }}
                            >
                                <span>{item.state}</span>
                                <span className="count-badge">{item.count}</span>
                            </button>

                            {selectedState === item.state &&
                                item.temples.map((temple) => (
                                    <button
                                        key={temple.id}
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
                            <p>
                                {selectedTemple
                                    ? selectedTemple.name
                                    : selectedState
                                        ? `${filteredTemples.length} temple${filteredTemples.length === 1 ? "" : "s"}`
                                        : "Temple"}
                            </p>
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

                <div
                    className="map-canvas globe-canvas"
                    onWheel={handleGlobeWheel}
                    onPointerDown={handleGlobePointerDown}
                    onPointerMove={handleGlobePointerMove}
                    onPointerUp={handleGlobePointerUp}
                    onPointerCancel={handleGlobePointerUp}
                >
                    <ComposableMap
                        projection="geoOrthographic"
                        projectionConfig={{
                            rotate: globeRotate,
                            scale: globeScale,
                            clipAngle: 90,
                        }}
                        width={900}
                        height={720}
                    >
                        <defs>
                            <radialGradient id="globeOcean" cx="38%" cy="32%" r="72%">
                                <stop offset="0%" stopColor="#202020" />
                                <stop offset="68%" stopColor="#050505" />
                                <stop offset="100%" stopColor="#000000" />
                            </radialGradient>
                            <filter id="globeShadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="22" stdDeviation="18" floodColor="#1a1209" floodOpacity="0.18" />
                            </filter>
                        </defs>

                        <Sphere fill="url(#globeOcean)" stroke="#15100c" strokeWidth={1} filter="url(#globeShadow)" />
                        <Graticule stroke="rgba(255,255,255,0.08)" strokeWidth={0.45} />

                        <Geographies geography={worldGeoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo, index) => {
                                    const isUnitedStates =
                                        geo.id === "840" ||
                                        geo.id === 840 ||
                                        geo.properties?.name === "United States of America";

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            onClick={() => handleCountryClick(geo)}
                                            className="country-shape"
                                            style={{
                                                default: {
                                                    fill: isUnitedStates
                                                        ? "#fff8ba"
                                                        : index % 5 === 0
                                                            ? "#4ec967"
                                                            : index % 5 === 1
                                                                ? "#f057ad"
                                                                : index % 5 === 2
                                                                    ? "#35bdda"
                                                                    : index % 5 === 3
                                                                        ? "#ffd037"
                                                                        : "#ff7d64",
                                                    stroke: "#050505",
                                                    strokeWidth: 0.7,
                                                    outline: "none",
                                                    cursor: isUnitedStates ? "pointer" : "grab",
                                                },
                                                hover: {
                                                    fill: isUnitedStates ? "#fff5a0" : "#f7d36b",
                                                    stroke: "#050505",
                                                    strokeWidth: 0.8,
                                                    outline: "none",
                                                },
                                                pressed: {
                                                    fill: "#d8b24f",
                                                    outline: "none",
                                                },
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>

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
                                                role="button"
                                                aria-label={`Select ${stateName}`}
                                                onPointerDown={(event) => {
                                                    event.stopPropagation();
                                                }}
                                                onClick={(event) => handleMapStateClick(event, geo)}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter" || event.key === " ") {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        handleStateClick(geo);
                                                    }
                                                }}
                                                className="state-shape globe-state-shape"
                                                style={{
                                                    default: {
                                                        fill: isSelected
                                                            ? "#d5a742"
                                                            : hasTemples
                                                                ? "#f8edbb"
                                                                : "rgba(255, 247, 206, 0.56)",
                                                        stroke: "#1d130a",
                                                        strokeWidth: 0.45,
                                                        outline: "none",
                                                        cursor:
                                                            showOnlyWithTemples && !hasTemples
                                                                ? "not-allowed"
                                                                : "pointer",
                                                        opacity:
                                                            showOnlyWithTemples && !hasTemples ? 0.35 : 1,
                                                    },
                                                    hover: {
                                                        fill: hasTemples ? "#d8af4e" : "#f5e4a8",
                                                        outline: "none",
                                                        cursor: "pointer",
                                                    },
                                                    pressed: {
                                                        fill: "#b99032",
                                                        outline: "none",
                                                    },
                                                }}
                                            />

                                        </g>
                                    );
                                })
                            }
                        </Geographies>

                        {templeData.map((temple) => (
                            hasTempleCoordinates(temple) && isCoordinateVisible([temple.lng, temple.lat]) && (
                                <Marker
                                    key={temple.id}
                                    coordinates={[temple.lng, temple.lat]}
                                >
                                    <g
                                        className={`pin-marker ${
                                            selectedTemple?.id === temple.id ? "active" : ""
                                        }`}
                                        role="button"
                                        tabIndex="0"
                                        aria-label={`View details for ${temple.name}`}
                                        onPointerDown={(event) => {
                                            event.stopPropagation();
                                        }}
                                        onClick={(event) => handleMapTempleClick(event, temple)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                handleTempleClick(temple);
                                            }
                                        }}
                                    >
                                        <circle
                                            r={19}
                                            cy={-5}
                                            fill="transparent"
                                            onPointerDown={(event) => {
                                                event.stopPropagation();
                                            }}
                                            onClick={(event) => handleMapTempleClick(event, temple)}
                                        />
                                        <path
                                            d="M0,-20 C9,-20 16,-13 16,-4 C16,8 0,22 0,22 C0,22 -16,8 -16,-4 C-16,-13 -9,-20 0,-20 Z"
                                            fill="#cf1f1f"
                                            stroke="#ffffff"
                                            strokeWidth={2}
                                            onPointerDown={(event) => {
                                                event.stopPropagation();
                                            }}
                                            onClick={(event) => handleMapTempleClick(event, temple)}
                                        />
                                        <circle
                                            r={5}
                                            cy={-4}
                                            fill="#fff8dc"
                                            onPointerDown={(event) => {
                                                event.stopPropagation();
                                            }}
                                            onClick={(event) => handleMapTempleClick(event, temple)}
                                        />
                                    </g>
                                </Marker>
                            )
                        ))}

                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const stateName = geo.properties.name;
                                    const templeCount = templeCountByState[stateName] || 0;
                                    const centroid = geoCentroid(geo);

                                    if (templeCount === 0 || !isCoordinateVisible(centroid)) {
                                        return null;
                                    }

                                    return (
                                        <Marker key={`${geo.rsmKey}-count`} coordinates={centroid}>
                                            <g
                                                className="state-count-marker"
                                                role="button"
                                                tabIndex="0"
                                                aria-label={`View temples in ${stateName}`}
                                                onPointerDown={(event) => {
                                                    event.stopPropagation();
                                                }}
                                                onClick={(event) => handleMapStateClick(event, geo)}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter" || event.key === " ") {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        handleStateClick(geo);
                                                    }
                                                }}
                                            >
                                                <circle
                                                    r={12}
                                                    cy={-26}
                                                    fill="#c19a3b"
                                                    stroke="#ffffff"
                                                    strokeWidth={2}
                                                />
                                                <text
                                                    textAnchor="middle"
                                                    y={-22}
                                                    fontSize={10}
                                                    fontWeight="700"
                                                    fill="#ffffff"
                                                >
                                                    {templeCount}
                                                </text>
                                            </g>
                                        </Marker>
                                    );
                                })
                            }
                        </Geographies>

                        {selectedTemple &&
                            hasTempleCoordinates(selectedTemple) &&
                            isCoordinateVisible([selectedTemple.lng, selectedTemple.lat]) && (
                                <Marker
                                    key={`${selectedTemple.id}-popup`}
                                    coordinates={[selectedTemple.lng, selectedTemple.lat]}
                                >
                                    <g
                                        className="temple-map-popup"
                                        role="button"
                                        tabIndex="0"
                                        aria-label={`Open details page for ${selectedTemple.name}`}
                                        onPointerDown={(event) => {
                                            event.stopPropagation();
                                        }}
                                        onClick={(event) => openTempleDetailsPage(event, selectedTemple)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                openTempleDetailsPage(event, selectedTemple);
                                            }
                                        }}
                                    >
                                        <rect
                                            className="temple-popup-card"
                                            x={-82}
                                            y={-128}
                                            width={164}
                                            height={98}
                                            rx={8}
                                        />
                                        <path
                                            className="temple-popup-pointer"
                                            d="M-10,-31 L10,-31 L0,-18 Z"
                                        />
                                        <image
                                            href={selectedTemple.imageUrl}
                                            x={-73}
                                            y={-119}
                                            width={146}
                                            height={58}
                                            preserveAspectRatio="xMidYMid slice"
                                        />
                                        <rect
                                            className="temple-popup-image-border"
                                            x={-73}
                                            y={-119}
                                            width={146}
                                            height={58}
                                            rx={5}
                                        />
                                        {getPopupNameLines(selectedTemple.name).map((line, index) => (
                                            <text
                                                key={`${selectedTemple.id}-name-${index}`}
                                                textAnchor="middle"
                                                x={0}
                                                y={-48 + index * 12}
                                                className="temple-popup-title"
                                            >
                                                {line}
                                            </text>
                                        ))}
                                    </g>
                                </Marker>
                            )}
                    </ComposableMap>

                    <div
                        className="globe-zoom-controls"
                        aria-label="Map zoom controls"
                        onPointerDown={(event) => event.stopPropagation()}
                    >
                        <button type="button" onClick={() => zoomGlobe(1)} aria-label="Zoom in">
                            +
                        </button>
                        <button type="button" onClick={() => zoomGlobe(-1)} aria-label="Zoom out">
                            -
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setGlobeRotate(globeStart.rotate);
                                setGlobeScale(globeStart.scale);
                            }}
                            aria-label="Reset globe"
                        >
                            ⌂
                        </button>
                    </div>
                </div>
            </section>

            <aside className={`details-panel ${selectedState ? "open" : ""}`}>
                {selectedState ? (
                    <>
                        <button className="close-btn" onClick={clearSelection}>
                            ×
                        </button>

                        <div className="state-temple-panel">
                            <p className="state-label">{selectedState}</p>
                            <h2>Temples in {selectedState}</h2>

                            {filteredTemples.length > 0 ? (
                                <div className="right-temple-list">
                                    {filteredTemples.map((temple) => (
                                        <button
                                            key={temple.id}
                                            className={`right-temple-row ${
                                                selectedTemple?.id === temple.id ? "active" : ""
                                            }`}
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
