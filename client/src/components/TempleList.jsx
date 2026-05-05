import React from "react";

const TempleList = ({ selectedState, temples }) => {
    if (!selectedState) {
        return (
            <div className="temple-panel">
                <h3>Select a State</h3>
                <p>Click a state on the map to view temples.</p>
            </div>
        );
    }

    if (temples.length === 0) {
        return (
            <div className="temple-panel">
                <h3>{selectedState}</h3>
                <p>No temples available for this state yet.</p>
            </div>
        );
    }

    return (
        <div className="temple-panel">
            <h3>Temples in {selectedState}</h3>

            <div className="temple-list">
                {temples.map((temple) => (
                    <div key={temple.id} className="temple-card">
                        <img
                            src={temple.imageUrl}
                            alt={temple.name}
                            className="temple-image"
                        />

                        <div>
                            <h4>{temple.name}</h4>
                            <p>
                                <strong>Address:</strong> {temple.address}
                            </p>
                            <p>
                                <strong>History:</strong> {temple.history}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TempleList;