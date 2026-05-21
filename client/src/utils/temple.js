import templeFallback from '../assets/templeImageFallback/templeFallback.jpg';
import userFallback from '../assets/templeImageFallback/user.png';

export const fallbackTempleImage = templeFallback;
export const fallbackMonkImage = userFallback;

const isUsableImageUrl = (value) => {
    const imageUrl = String(value || "").trim();
    return imageUrl && !imageUrl.toLowerCase().includes("revoked");
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
    const gallery = temple.galleryImages?.length
        ? temple.galleryImages.filter(isUsableImageUrl)
        : temple.images?.length
            ? temple.images.filter(isUsableImageUrl)
            : mainImage
                ? [mainImage]
                : temple.gallery?.length
                    ? temple.gallery.filter(isUsableImageUrl)
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
