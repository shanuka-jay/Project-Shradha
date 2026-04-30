import React, {useState} from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl =
    "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";



const Map = () => {
    const [selectedState, setSelectedState] = useState(null);

    const handleStateClick = (geo) => {
        alert(`You clicked: ${geo.properties.name}`);
    };

    return (
        <div>
            <h2>USA Temple Map</h2>

            <ComposableMap projection="geoAlbersUsa">
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const isSelected =
                                geo.properties.name === selectedState;
                            return(
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                onClick={() => handleStateClick(geo)}
                                style={{
                                    default: {
                                        fill: isSelected ? "#FF5733":"#D6D6DA",
                                        outline: "none",
                                    },
                                    hover: {
                                        fill: "#F53",
                                        outline: "none",
                                    },
                                    pressed: {
                                        fill: "#E42",
                                        outline: "none",
                                    },
                                }}
                            />
                        );
                            })
                    }
                </Geographies>
            </ComposableMap>
                    {selectedState && (
                    <div>
                        <h3>Selected state: {selectedState}</h3>
                        </div>
                        )}
        </div>
    );
};

export default Map;