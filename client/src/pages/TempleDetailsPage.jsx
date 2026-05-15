import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TempleDetails from "../components/TempleDetails.jsx";
import { templeData as fallbackTempleData } from "../data/temples.js";
import { normalizeTemple } from "../utils/temple.js";

const TempleDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [temple, setTemple] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadTemple() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(`/api/temples/${encodeURIComponent(id)}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Could not load temple");
                }

                if (!ignore) {
                    setTemple(normalizeTemple(data));
                }
            } catch (loadError) {
                const fallbackTemple = fallbackTempleData.find(
                    (item) => String(item.id) === String(id)
                );

                if (!ignore) {
                    if (fallbackTemple) {
                        setTemple(normalizeTemple(fallbackTemple));
                    } else {
                        setTemple(null);
                        setError("Temple details are unavailable right now.");
                    }
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadTemple();

        return () => {
            ignore = true;
        };
    }, [id]);

    if (loading) {
        return (
            <main className="temple-details-page">
                <div className="details-loading">Loading temple details...</div>
            </main>
        );
    }

    if (error || !temple) {
        return (
            <main className="temple-details-page">
                <div className="details-loading">
                    <p>{error || "Temple details are unavailable right now."}</p>
                    <button type="button" onClick={() => navigate("/map")}>
                        Back to Map
                    </button>
                </div>
            </main>
        );
    }

    return (
        <TempleDetails
            temple={temple}
            onBack={() => navigate("/map")}
        />
    );
};

export default TempleDetailsPage;
