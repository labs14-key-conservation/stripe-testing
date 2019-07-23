import React, { Component } from 'react';
import AddPaymentView from './AddPaymentView';
const STRIPE_ERROR = 'Payment service error. Try again later.';
const SERVER_ERROR = 'Server error. Try again later.';
const STRIPE_PUBLISHABLE_KEY = `pk_test_EBcmc6Evy9AbQlpgJYIhB27v00mK1APHLR`;
/**
 * The method sends HTTP requests to the Stripe API.
 * It's necessary to manually send the payment data
 * to Stripe because using Stripe Elements in React
 * Native apps isn't possible.
 *
 * @param creditCardData the credit card data
 * @return Promise with the Stripe data
 */
const getCreditCardToken = (creditCardData) => {
  const card = {
    'card[number]': creditCardData.values.number.replace(/ /g, ''),
    'card[exp_month]': creditCardData.values.expiry.split('/')[0],
    'card[exp_year]': creditCardData.values.expiry.split('/')[1],
    'card[cvc]': creditCardData.values.cvc,
    'card[name]': creditCardData.values.name,
  };
  return fetch(`https://api.stripe.com/v1/tokens`, {
    headers: {
      // Use the correct MIME type for your server
      Accept: 'application/json',
      // Use the correct Content Type to send data to Stripe
      'Content-Type': 'application/x-www-form-urlencoded',
      // Use the Stripe publishable key as Bearer
      Authorization: `Bearer pk_test_EBcmc6Evy9AbQlpgJYIhB27v00mK1APHLR`
    },
    // Use a proper HTTP method
    method: 'post',
    // Format the credit card data to a string of key-value pairs
    // divided by &
    // body: Object.keys(card)
    //   .map(key => key + '=' + card[key])
    //   .join('&')
  }).then(res => {
    res.json()
    })
    .catch(err => {
      console.log(err)
    })
};
/**
 * The method imitates a request to our server.
 *
 * @param creditCardToken
 * @return {Promise<Response>}
 */
const payingUser = (creditCardToken) => {
  return new Promise((resolve) => {
    console.log('Credit card token\n', creditCardToken);
    setTimeout(() => {
      resolve({ status: true });
    }, 1000)
  });
};
/**
 * The main class that submits the credit card data and
 * handles the response from Stripe.
 */
export default class AddPayment extends Component {
  static navigationOptions = {
    title: 'payment',
  };
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      error: null
    }
  }
  // Handles submitting the payment request
  onSubmit = async (creditCardInput) => {
    const { history } = this.props;
    // Disable the Submit button after the request is sent
    this.setState({ submitted: true });
    let creditCardToken;
    try {
      // Create a credit card token
      creditCardToken = await getCreditCardToken(creditCardInput);
      if (creditCardToken.error) {
        console.log('first')
        // Reset the state if Stripe responds with an error
        // Set submitted to false to let the user subscribe again
        this.setState({ submitted: false, error: STRIPE_ERROR });
        return;
      }
    } catch (e) {
      console.log(e)
      // Reset the state if the request was sent with an error
      // Set submitted to false to let the user subscribe again
      this.setState({ submitted: false, error: STRIPE_ERROR });
      return;
    }
    // Send a request to your server with the received credit card token
    const { error } = await payingUser(creditCardToken);
    // Handle any errors from your server
    if (error) {
      console.log('third')
      this.setState({ submitted: false, error: SERVER_ERROR });
    } else {
      this.setState({ submitted: false, error: null });
      history.push('/')
    }
  };

  // render the subscription view component and pass the props to it
  render() {
    const { submitted, error } = this.state;
    return (
        <AddPaymentView
          error={error}
          submitted={submitted}
          onSubmit={this.onSubmit}
        />
    );
  }
}