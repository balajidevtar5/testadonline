import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GetRewardDetailAction } from '../actions/rewardAction';
import { LayoutContext } from '../../../components/layout/LayoutContext';

const useGetRewardDetailAction = (shouldFetch) => {
  const [rewardDetail, setRewardDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { transactionHistoryRefreshKey } = useContext(LayoutContext);

  const fetchRewardDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetRewardDetailAction(); // Replace with your API
      setRewardDetail(response.data); // Or response.data.result, depending on API shape
    } catch (err) {
      console.error('Failed to fetch reward details:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchRewardDetail();
  }, [shouldFetch, transactionHistoryRefreshKey]);

  return { rewardDetail, loading, error,setLoading, refetch: fetchRewardDetail };
};

export default useGetRewardDetailAction;
