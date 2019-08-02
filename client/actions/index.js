export const SUBMITED_INFO = 'SUBMITED_INFO';

export const extraPaymentInfo = info => {
  console.log(info, "----------------------------------------actions")
  return {
    type: SUBMITED_INFO,
    payload: info
  }
};
