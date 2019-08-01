import {
  SUBMITED_INFO
} from '../actions';

const initialState = {
  orgTotalAmount: '0',
  keyTotalAmount: '0',
  totalAmount: '0',
  description: 'Donation',
  orgStripeAccountId: '1234',
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case SUBMITED_INFO:
      return {
        ...state,
        orgTotalAmount: action.payload.orgTotalAmount,
        keyTotalAmount: action.payload.keyTotalAmount,
        totalAmount: action.payload.totalAmount,
        description: action.payload.description,
        orgStripeAccountId: action.payload.orgStripeAccountId
      }

    default:
      return state
  }
}

export default reducer;
