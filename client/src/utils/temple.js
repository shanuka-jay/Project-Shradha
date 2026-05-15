export const fallbackTempleImage =
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80";

export const normalizeStateName = (state) => {
    if (state === "DC" || state === "D.C.") return "District of Columbia";
    return state || "";
};

export const normalizeTemple = (temple) => {
    const lat = temple.lat ?? temple.location?.lat;
    const lng = temple.lng ?? temple.location?.lng;
    const gallery = temple.galleryImages?.length
        ? temple.galleryImages
        : temple.images?.length
            ? temple.images
            : temple.mainImage
                ? [temple.mainImage]
                : temple.gallery?.length
                    ? temple.gallery
                    : [];

    return {
        ...temple,
        id: temple.id || temple._id,
        state: normalizeStateName(temple.state),
        region: temple.regionTag || temple.region || "Other",
        contact: temple.phone || temple.contact || "",
        description: temple.overview || temple.description || "",
        imageUrl: temple.mainImage || temple.imageUrl || gallery[0] || fallbackTempleImage,
        gallery,
        monkImage: temple.chiefMonkImage || temple.monkImage || temple.mainImage || gallery[0] || fallbackTempleImage,
        lat: lat === null || lat === undefined || lat === "" ? null : Number(lat),
        lng: lng === null || lng === undefined || lng === "" ? null : Number(lng),
    };
};

export const hasTempleCoordinates = (temple) => (
    Number.isFinite(temple.lat) && Number.isFinite(temple.lng)
);
