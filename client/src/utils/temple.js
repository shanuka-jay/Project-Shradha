import templeFallback from '../assets/templeImageFallback/templeFallback.jpg';
import userFallback from '../assets/templeImageFallback/user.png';

export const fallbackTempleImage = templeFallback;
export const fallbackMonkImage = userFallback;

const isUsableImageUrl = (value) => {
    const imageUrl = String(value || "").trim();
    return imageUrl && !imageUrl.toLowerCase().includes("revoked");
};

const toArray = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];

    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    return [];
};

export const normalizeStateName = (state) => {
    if (state === "DC" || state === "D.C.") return "District of Columbia";
    return state || "";
};

export const normalizeTemple = (temple) => {
    const lat = temple.lat ?? temple.location?.lat;
    const lng = temple.lng ?? temple.location?.lng;
    const mainImage = isUsableImageUrl(temple.mainImage) ? temple.mainImage.trim() : "";
    const imageUrl = isUsableImageUrl(temple.imageUrl) ? temple.imageUrl.trim() : "";
    const chiefMonkImage = isUsableImageUrl(temple.chiefMonkImage) ? temple.chiefMonkImage.trim() : "";
    const monkImage = isUsableImageUrl(temple.monkImage) ? temple.monkImage.trim() : "";
    const galleryImages = toArray(temple.galleryImages);
    const images = toArray(temple.images);
    const existingGallery = toArray(temple.gallery);
    const gallery = galleryImages.length
        ? galleryImages.filter(isUsableImageUrl)
        : images.length
            ? images.filter(isUsableImageUrl)
            : mainImage
                ? [mainImage]
                : existingGallery.length
                    ? existingGallery.filter(isUsableImageUrl)
                    : [];

    return {
        ...temple,
        id: temple.id || temple._id,
        state: normalizeStateName(temple.state),
        region: temple.regionTag || temple.region || "Other",
        contact: temple.phone || temple.contact || "",
        description: temple.overview || temple.description || "",
        mainImage,
        imageUrl: mainImage || imageUrl || gallery[0] || fallbackTempleImage,
        gallery,
        monkImage: chiefMonkImage || monkImage || fallbackMonkImage,
        lat: lat === null || lat === undefined || lat === "" ? null : Number(lat),
        lng: lng === null || lng === undefined || lng === "" ? null : Number(lng),
    };
};

export const hasTempleCoordinates = (temple) => (
    Number.isFinite(temple.lat) && Number.isFinite(temple.lng)
);
