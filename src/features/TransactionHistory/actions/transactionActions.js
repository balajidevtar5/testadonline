// features/TransactionHistory/actions/transactionActions.js
import { getWalletHistory } from "../../../redux/services/payment.api";

export const TRANSACTION_ACTIONS = {
  LOAD_TRANSACTIONS_START: 'LOAD_TRANSACTIONS_START',
  LOAD_TRANSACTIONS_SUCCESS: 'LOAD_TRANSACTIONS_SUCCESS',
  LOAD_TRANSACTIONS_ERROR: 'LOAD_TRANSACTIONS_ERROR',
  RESET_TRANSACTIONS: 'RESET_TRANSACTIONS',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  COPY_REFERRAL_LINK: 'COPY_REFERRAL_LINK',
  TOGGLE_QR_CODE: 'TOGGLE_QR_CODE'
};

export const loadTransactions = (pageNumber = 1, pageSize = 30) => async (dispatch) => {
  dispatch({ type: TRANSACTION_ACTIONS.LOAD_TRANSACTIONS_START });
  
  try {
    const payload = { PageNumber: pageNumber, PageSize: pageSize };
    const response = await getWalletHistory(payload);
    
    if (response.success) {
      dispatch({
        type: TRANSACTION_ACTIONS.LOAD_TRANSACTIONS_SUCCESS,
        payload: {
          data: response.data,
          totalCount: response.data[0]?.totalcount || 0,
          pageNumber
        }
      });
    } else {
      dispatch({
        type: TRANSACTION_ACTIONS.LOAD_TRANSACTIONS_ERROR,
        payload: 'Failed to load transactions'
      });
    }
  } catch (error) {
    dispatch({
      type: TRANSACTION_ACTIONS.LOAD_TRANSACTIONS_ERROR,
      payload: error.message
    });
  }
};

export const resetTransactions = () => ({
  type: TRANSACTION_ACTIONS.RESET_TRANSACTIONS
});

export const setCurrentPage = (page) => ({
  type: TRANSACTION_ACTIONS.SET_CURRENT_PAGE,
  payload: page
});

export const copyReferralLink = (link) => ({
  type: TRANSACTION_ACTIONS.COPY_REFERRAL_LINK,
  payload: link
});

export const toggleQrCode = (isOpen) => ({
  type: TRANSACTION_ACTIONS.TOGGLE_QR_CODE,
  payload: isOpen
});