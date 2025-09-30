// utils/openPremiumImage.js
export const openPremiumImage = ({
  elm,
  API_ENDPOINT_PROFILE,
  setSlideData,
  setShowPostImages,
  setImageSlideOpen,
  handleGetPostDetailsById
}) => {
  setSlideData([]);
  setImageSlideOpen(false);

  if (elm.largeimage) {
    const imagePath = elm.largeimage ? elm.largeimage.replace(/^~/, "").replace("/S/", "/Original/") : "";
    const imageUrl = `${API_ENDPOINT_PROFILE}/${imagePath}`;
    const slideData = { key: elm.id, image: imageUrl };

    setShowPostImages(true);
    setSlideData([slideData]);

    setTimeout(() => {
      const images = document.querySelectorAll("a[data-fancybox='gallery']");
      if (images?.length > 0) {
        images[0].click();
      }
    }, 500);
  }

  handleGetPostDetailsById(elm);
};
