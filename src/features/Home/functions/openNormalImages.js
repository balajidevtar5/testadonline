// utils/openNormalImages.js
export const openNormalImages = ({
  elm,
  API_ENDPOINT_PROFILE,
  setSlideData,
  setShowPostImages,
  setImageSlideOpen,
  handleGetPostDetailsById,
}) => {
  setSlideData([]);
  setImageSlideOpen(false);

  if (elm.pictures && elm.pictures?.length > 0) {
    const slideData = JSON.parse(elm.pictures).map((img) => {
      const imagePath = img?.LargeImage ? img.LargeImage.replace(/^~/, "").replace("/S/", "/Original/") : "";
      const imageUrl = `${API_ENDPOINT_PROFILE}/${imagePath}`;
      return { key: img?.id, image: imageUrl };
    });

    setShowPostImages(true);
    setSlideData(slideData);

    setTimeout(() => {
      const images = document.querySelectorAll("a[data-fancybox='gallery']");
      if (images?.length > 0) {
        images[0].click();
      }
    }, 500);
  }

  handleGetPostDetailsById(elm);
};
