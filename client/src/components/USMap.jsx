import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const USMap = ({ selectedState, onStateClick }) => {
    const handleClick = (geo) => {
        const stateName = geo.properties.name;

        if (!stateName) return;

        onStateClick(stateName);
    };

    return (
        <div className="map-wrapper">
            <ComposableMap projection="geoAlbersUsa">
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const stateName = geo.properties.name;
                            const isSelected = selectedState === stateName;

                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onClick={() => handleClick(geo)}
                                    style={{
                                        default: {
                                            fill: isSelected ? "#f97316" : "#d1d5db",
                                            stroke: "#ffffff",
                                            strokeWidth: 0.7,
                                            outline: "none",
                                            cursor: "pointer",
                                        },
                                        hover: {
                                            fill: "#fb923c",
                                            outline: "none",
                                            cursor: "pointer",
                                        },
                                        pressed: {
                                            fill: "#ea580c",
                                            outline: "none",
                                        },
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>
            </ComposableMap>
        </div>
    );
};

export default USMap;