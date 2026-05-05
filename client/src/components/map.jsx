import React, { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import {temples} from "../data/temples.js";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";



const Map = () => {
  const [selectedState, setSelectedState] = useState(null);

  const templeCountByState = useMemo(() => {
    return temples.reduce((counts, temple) => {
      counts[temple.state] = (counts[temple.state] || 0) + 1;
      return counts;
    }, {});
  }, []);

  const filteredTemples = useMemo(() => {
    if (!selectedState) return [];

    return temples.filter(
      (temple) => temple.state.toLowerCase() === selectedState.toLowerCase()
    );
  }, [selectedState]);

  const handleStateClick = (geo) => {
    const stateName = geo?.properties?.name;

    if (!stateName) return;

    setSelectedState(stateName);
  };

  return (
    <div>
      <h2>USA Temple Map</h2>
      <p>Click a state to view temples in that state.</p>

      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name;
              const isSelected = stateName === selectedState;
              const templeCount = templeCountByState[stateName] || 0;
              const centroid = geoCentroid(geo);

              return (
                <g key={geo.rsmKey}>
                  <Geography
                    geography={geo}
                    onClick={() => handleStateClick(geo)}
                    style={{
                      default: {
                        fill: isSelected ? "#FF5733" : "#D6D6DA",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.7,
                        outline: "none",
                        cursor: "pointer",
                      },
                      hover: {
                        fill: "#F53",
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#E42",
                        outline: "none",
                      },
                    }}
                  />

                  {templeCount > 0 && (
                    <Marker coordinates={centroid}>
                      <circle
                        r={10}
                        fill="#111827"
                        stroke="#ffffff"
                        strokeWidth={2}
                        pointerEvents="none"
                      />
                      <text
                        textAnchor="middle"
                        y={4}
                        fontSize={10}
                        fontWeight="bold"
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
      </ComposableMap>

      <section style={{ marginTop: "24px" }}>
        {!selectedState && (
          <div>
            <h3>Select a state</h3>
            <p>No state selected yet.</p>
          </div>
        )}

        {selectedState && (
          <div>
            <h3>Selected State: {selectedState}</h3>

            {filteredTemples.length > 0 ? (
              <div>
                <h4>Temples in {selectedState}</h4>

                {filteredTemples.map((temple) => (
                  <div
                    key={temple.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <img
                      src={temple.imageUrl}
                      alt={temple.name}
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                    <h4>{temple.name}</h4>
                    <p>
                      <strong>Address:</strong> {temple.address}
                    </p>
                    <p>
                      <strong>History:</strong> {temple.history}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No temples available for this state yet.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Map;