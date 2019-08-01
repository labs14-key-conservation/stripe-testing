import {
  SUBMITED_INFO
} from '../actions';

const initialState = {
  orgTotalAmount: 0,
  keyTotalAmount: 0,
  totalAmount: 0,
  description: 'Donation',
  orgStripeAccountId: '1234',
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case SUBMITED_INFO:
      return {
        ...state,
        orgTotalAmount: action.payload.orgTotalAmount.toFixed(2),
        keyTotalAmount: action.payload.keyTotalAmount.toFixed(2),
        totalAmount: action.payload.totalAmount.toFixed(2),
        description: action.payload.description,
        orgStripeAccountId: action.payload.orgStripeAccountId
      }

    default:
      return state
  }
}

export default reducer;
