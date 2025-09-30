export const handleFavorite = ({ 
    e, 
    item,
    loginUserData,
    setLoginModelOpen,
    message,
    t,
    setFavoriteCount,
    interactionCounts,
    setInteractionCounts,
    handleClick,
    setIsStaticFav,
    setIsPostClear,
    filterValue,
    setFilterValue }) => {
    e.stopPropagation();

  if (!loginUserData?.data) {
    setLoginModelOpen(true);
    message.error(t("General.loginpopupmessage"));
    return;
  }

  setFavoriteCount(prev => {
    const wasFavorited = prev[item.id]?.fav ?? item.userfavorite;
    const currentCount = interactionCounts.favorites[item.id] ?? item.favorites ?? 0;
    const numericCount = Number(currentCount);

    const newCount = wasFavorited ? numericCount - 1 : numericCount + 1;

    setInteractionCounts(prevCounts => ({
      ...prevCounts,
      favorites: {
        ...prevCounts.favorites,
        [item.id]: newCount
      }
    }));
    return {
      ...prev,
      [item.id]: {
        fav: !wasFavorited,
        count: newCount
      }
    };
  });

  handleClick(e, "favUnFav", item);
};

