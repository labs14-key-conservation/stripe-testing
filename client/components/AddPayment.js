import React from 'react';
import axios from 'axios'
import AddPaymentView from './AddPaymentView';

const STRIPE_ERROR = 'Payment service error. Try again later.';
const SERVER_ERROR = 'Server error. Try again later.';
const STRIPE_PUBLISHABLE_KEY = 'STRIPE_PUBLISHABLE_KEY';

import { connect } from 'react-redux';

/**
 * The method sends HTTPS requests to the Stripe API.
 * It's necessary to manually send the payment data
 * to Stripe because using Stripe Elements in React Native apps
 * isn't possible.
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
    'card[name]': creditCardData.values.name
  };



  return fetch(`https://api.stripe.com/v1/tokens`, {
    headers: {
      // Use the correct MIME type for your server
      Accept: 'application/json',
      // Use the correct Content Type to send data in request body
      'Content-Type': 'application/x-www-form-urlencoded',
      // Use the Stripe publishable key as Bearer
      Authorization: `Bearer ${STRIPE_PUBLISHABLE_KEY}`
    },
    // Use a proper HTTP method
    method: 'post',
    // Format the credit card data to a string of key-value pairs
    // divided by &
    body: Object.keys(card)
      .map(key => key + '=' + card[key])
      .join('&')
  }).then(res => {
    return res.json()
  });
};

/**
 * The method imitates a request to our server.
 *
 * @param creditCardToken
 * @return {Promise<Response>}
 */
const subscribeUser = (creditCardToken) => {
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
class AddPayment extends React.Component {
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
        // Reset the state if Stripe responds with an error
        // Set submitted to false to let the user subscribe again
        this.setState({ submitted: false, error: STRIPE_ERROR });
        return;
      }
    } catch (e) {
      // Reset the state if the request was sent with an error
      // Set submitted to false to let the user subscribe again
      this.setState({ submitted: false, error: STRIPE_ERROR });
      return;
    }

    // Send a request to your server with the received credit card token
    const { error } = await subscribeUser(creditCardToken);
    // Handle any errors from your server
    if (error) {
      this.setState({ submitted: false, error: SERVER_ERROR });
    } else {
      this.setState({ submitted: false, error: null });

      // Object to be sent to server to be used to create charge, and customer in stripe
      const tok = {
        token: creditCardToken.id,
        orgAmount: this.props.orgTotalAmount,
        keyAmount: this.props.keyTotalAmount,
        totalAmount: Number(this.props.totalAmount).toFixed(2),
        description: this.props.description,
        stripeAccountId: this.props.orgStripeAccountId
      }

      // NOTE: NGROK is required here to work on a real device. Real devices will not
      // submit a HTTP request. Must be HTTPS.
      axios
      .post('https://dc18d3af.ngrok.io/api/doPayment', tok)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })

      history.push('/')
    }
  };

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

const mapStateToProps = state => ({
  orgTotalAmount: state.orgTotalAmount,
  keyTotalAmount: state.keyTotalAmount,
  totalAmount: state.totalAmount,
  description: state.description,
  orgStripeAccountId: state.orgStripeAccountId,
});

export default connect(
  mapStateToProps,
  { }
)(AddPayment);
