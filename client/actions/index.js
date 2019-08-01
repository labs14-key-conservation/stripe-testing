export const SUBMITED_INFO = 'SUBMITED_INFO';

export const extraPaymentInfo = info => {
  return {
    type: SUBMITED_INFO,
    payload: info
  }
};
