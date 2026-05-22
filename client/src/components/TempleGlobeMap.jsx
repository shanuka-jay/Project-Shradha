import React, { useEffect, useRef, useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    Graticule,
    Marker,
    Sphere,
} from "react-simple-maps";
import { geoCentroid, geoDistance } from "d3-geo";
import { hasTempleCoordinates } from "../utils/temple.js";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const worldGeoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const globeStart = { rotate: [98, -38, 0], scale: 300 };
const usaFocus = { rotate: [98, -39, 0], scale: 520 };
const minGlobeScale = 250;
const maxGlobeScale = 760;
const globeFocusDuration = 760;

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

const easeInOutCubic = (progress) => (
    progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2
);

const getShortestRotation = (from, to) => {
    let delta = to - from;

    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;

    return from + delta;
};

const TempleGlobeMap = ({
    selectedState,
    selectedTemple,
    templeData,
    templeCountByState,
    filteredTemples,
    showOnlyWithTemples,
    onShowOnlyWithTemplesChange,
    onStateSelect,
    onTempleSelect,
    onTempleDetailsOpen,
}) => {
    const [globeRotate, setGlobeRotate] = useState(globeStart.rotate);
    const [globeScale, setGlobeScale] = useState(globeStart.scale);
    const [dragStart, setDragStart] = useState(null);
    const globeRotateRef = useRef(globeStart.rotate);
    const globeScaleRef = useRef(globeStart.scale);
    const focusAnimationRef = useRef(null);

    useEffect(() => {
        globeRotateRef.current = globeRotate;
    }, [globeRotate]);

    useEffect(() => {
        globeScaleRef.current = globeScale;
    }, [globeScale]);

    useEffect(() => {
        return () => {
            if (focusAnimationRef.current) {
                cancelAnimationFrame(focusAnimationRef.current);
            }
        };
    }, []);

    const focusGlobe = (coordinates, scale = usaFocus.scale, duration = globeFocusDuration) => {
        if (!coordinates.every(Number.isFinite)) return;

        const [lng, lat] = coordinates;
        const startRotate = globeRotateRef.current;
        const startScale = globeScaleRef.current;
        const targetRotate = [
            getShortestRotation(startRotate[0], -lng),
            Math.max(-80, Math.min(80, -lat)),
            0,
        ];
        const targetScale = Math.min(maxGlobeScale, Math.max(minGlobeScale, scale));
        const startTime = performance.now();

        if (focusAnimationRef.current) {
            cancelAnimationFrame(focusAnimationRef.current);
        }

        const animate = (currentTime) => {
            const progress = Math.min(1, (currentTime - startTime) / duration);
            const easedProgress = easeInOutCubic(progress);
            const nextRotate = startRotate.map((value, index) => (
                value + (targetRotate[index] - value) * easedProgress
            ));
            const nextScale = startScale + (targetScale - startScale) * easedProgress;

            setGlobeRotate(nextRotate);
            setGlobeScale(nextScale);

            if (progress < 1) {
                focusAnimationRef.current = requestAnimationFrame(animate);
            } else {
                setGlobeRotate(targetRotate);
                setGlobeScale(targetScale);
                focusAnimationRef.current = null;
            }
        };

        focusAnimationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (selectedTemple && hasTempleCoordinates(selectedTemple)) {
            focusGlobe([selectedTemple.lng, selectedTemple.lat], 700);
            return;
        }

        if (!selectedState) return;

        const firstTemple = templeData.find(
            (temple) => temple.state === selectedState && hasTempleCoordinates(temple)
        );

        if (firstTemple) {
            focusGlobe([firstTemple.lng, firstTemple.lat], 650);
        }
    }, [selectedState, selectedTemple, templeData]);

    const zoomGlobe = (direction) => {
        if (focusAnimationRef.current) {
            cancelAnimationFrame(focusAnimationRef.current);
            focusAnimationRef.current = null;
        }

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
        if (focusAnimationRef.current) {
            cancelAnimationFrame(focusAnimationRef.current);
            focusAnimationRef.current = null;
        }

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

        onStateSelect(stateName);
    };

    const handleMapStateClick = (event, geo) => {
        event.preventDefault();
        event.stopPropagation();
        setDragStart(null);
        handleStateClick(geo);
    };

    const handleMapTempleClick = (event, temple) => {
        event.preventDefault();
        event.stopPropagation();
        setDragStart(null);
        onTempleSelect(temple);
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

    return (
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
                        onClick={() => onShowOnlyWithTemplesChange(false)}
                    >
                        All States
                    </button>
                    <button
                        className={showOnlyWithTemples ? "active" : ""}
                        onClick={() => onShowOnlyWithTemplesChange(true)}
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
                            <stop offset="0%" stopColor="#7ec7e8" />
                            <stop offset="68%" stopColor="#1d83b6" />
                            <stop offset="100%" stopColor="#0c4f7a" />
                        </radialGradient>
                        <filter id="globeShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="22" stdDeviation="18" floodColor="#1a1209" floodOpacity="0.18" />
                        </filter>
                    </defs>

                    <Sphere fill="url(#globeOcean)" stroke="#0a3d5d" strokeWidth={1} filter="url(#globeShadow)" />
                    <Graticule stroke="rgba(255,255,255,0.2)" strokeWidth={0.45} />

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
                                                stroke: "#0b3852",
                                                strokeWidth: 0.7,
                                                outline: "none",
                                                cursor: isUnitedStates ? "pointer" : "grab",
                                            },
                                            hover: {
                                                fill: isUnitedStates ? "#fff5a0" : "#f7d36b",
                                                stroke: "#0b3852",
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
                                            onTempleSelect(temple);
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
                                    onClick={(event) => onTempleDetailsOpen(event, selectedTemple)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            onTempleDetailsOpen(event, selectedTemple);
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
    );
};

export default TempleGlobeMap;
