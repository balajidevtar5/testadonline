import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { getWalletHistory } from "../../../redux/services/payment.api";
import { LayoutContext } from "../../../components/layout/LayoutContext";

export const useTransactionHistory = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { data: loginUserData } = useSelector(
    (state) => state.loginUser
  );
  const { isTransition, setIsTransition, transactionHistoryRefreshKey,setTransactionHistoryRefreshKey } = useContext(LayoutContext);
  
  
 const loadMoreData = async ({ isRefresh = false } = {}) => {
  setLoading(true);
  const pageToLoad = isRefresh ? 1 : currentPage;

  const payload = {
    PageNumber: pageToLoad,
    PageSize: 30,
  };
  

  if(isRefresh){
    setCurrentPage(1)
  }
  try {
    
    const response = await getWalletHistory(payload);
    if (response?.success) {
      setData(prev => {
        return isRefresh ? response.data : [...prev, ...response.data];
      });
      setTransactionHistoryRefreshKey(false);
      setIsTransition(false);
      setTotalCount(response.data[0]?.totalcount || 0);
    }
  } catch (error) {
    console.error("Error loading transaction data:", error);
  } finally {
    setLoading(false);
  }
};




  const refetch = async () => {
    setLoading(true);
    setCurrentPage(1);
    setData([]);
    const payload = {
      PageNumber: 1,
      PageSize: 30,
    };
    try {
      const response = await getWalletHistory(payload);
      if (response?.success) {
        setData(response.data);
        setTotalCount(response.data[0]?.totalcount || 0);
        setTransactionHistoryRefreshKey(false)
      }
    } catch (error) {
      console.error("Error refetching transaction data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentPage(prev => prev + 1);
    setIsTransition(false);
  };

  

  useEffect(() => {
  let isCancelled = false;

   const fetchData = async () => {
    if (isCancelled) return;
    await loadMoreData({ isRefresh: false });
  };

  fetchData();

  return () => {
    isCancelled = true;
  };
}, [ currentPage]);

useEffect(() => {
  if(transactionHistoryRefreshKey){
 refetch()
  }
}, [transactionHistoryRefreshKey])



  return {
    loading,
    data,
    currentPage,
    totalCount,
    loginUserData,
    handleNext,
    loadMoreData,
    refetch,
  };
};