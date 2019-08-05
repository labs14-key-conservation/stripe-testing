import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { FontAwesome } from '@expo/vector-icons';

import { connect } from 'react-redux';
// actions method
import { extraPaymentInfo } from '../actions'
/**
 * Renders the payment form and handles the credit card data
 * using the CreditCardInput component.
 */
class PaymentFormView extends Component {
    state = {
      cardData: {
        valid: false
      },
      // Dynamic info to be sent to backend for a charge
      orgTotalAmount: 0,
      keyTotalAmount: 0,
      totalAmount: 0,
      description: 'Donation',
      orgStripeAccountId: '1234',
    }

    componentDidUpdate(prevState) {
      if(this.state.totalAmount !== prevState.totalAmount) {
        // Passing Dynamic User inputs to the redux store
        this.props.extraPaymentInfo(this.state)
      }
    }



  render() {
    const { onSubmit, submitted, error } = this.props;
    return (
      <View>
        <View>
          <CreditCardInput requiresName onChange={(cardData) => this.setState({
            // Changing validity and credit card info in state.
            ...this.state,
            cardData: cardData
          })} />

          <Text>Org Donation</Text>
          <TextInput
            value={this.state.orgTotalAmount}
            onChangeText={text => {
              // if user inputs a value operate Stripe credit card fee formula
              // NOTE: The 30 cents is charged by stripe for processing,
              // NOTE: the 2.9% fee needs to calculated for the net total of the donation.
              if (text) {
                let orgAmount = (parseInt(text, 10) + .3)/(1 - .029)
              } else {
                let orgAmount = 0
              }

              this.setState({
                ...this.state,
                orgTotalAmount: orgAmount,
                totalAmount: orgAmount + this.state.keyTotalAmount
              })
            }}
          />
          <Text>Org total</Text>
          <Text>{this.state.orgTotalAmount.toFixed(2)}</Text>

          <Text>Key Donation</Text>
          <TextInput
            value={this.state.keyTotalAmount}
            onChangeText={text => {

              let keyAmount

              if (text) {
                // If user inputs value, and is choosing not to donate to the organization
                // then operate stripes credit card fee formula + 30cents.
                // NOTE: The 30 cents is charged by stripe for processing,
                // NOTE: the 2.9% fee needs to calculated for the net total of the donation.
                if(this.state.orgTotalAmount === 0) {
                  keyAmount = (parseInt(text, 10) + .3)/(1 - .029)
                } else {
                  // NOTE: 30 cents is not added in this formula because the user has inputed
                  // a donation amount for the Organization. The OrgAmount formula will take care of
                  // the 30 cent fee.
                  keyAmount = (parseInt(text, 10))/(1 - .029)
                }

              } else {
                keyAmount = 0
              }

              this.setState({
                ...this.state,
                keyTotalAmount: keyAmount,
                totalAmount: this.state.orgTotalAmount + keyAmount
              })
            }}
          />
          <Text>Key total</Text>
          <Text>{this.state.keyTotalAmount.toFixed(2)}</Text>

          <Text>Total Donation Amount for this campaign</Text>
          <Text>{this.state.totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title='Donate'
            disabled={!this.state.cardData.valid || submitted}
            onPress={() => onSubmit(this.state.cardData)}
          />
          {/* Show errors */}
          {error && (
            <View style={styles.alertWrapper}>
              <View style={styles.alertIconWrapper}>
                <FontAwesome name="exclamation-circle" size={20} style={{ color: '#c22' }} />
              </View>
              <View style={styles.alertTextWrapper}>
                <Text style={styles.alertText}>{error}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default connect(
  null,
  { extraPaymentInfo }
)(PaymentFormView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  buttonWrapper: {
    padding: 10,
    zIndex: 100
  },
  alertTextWrapper: {
    flex: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertIconWrapper: {
    padding: 5,
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertText: {
    color: '#c22',
    fontSize: 16,
    fontWeight: '400'
  },
  alertWrapper: {
    backgroundColor: '#ecb7b7',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 5,
    paddingVertical: 5,
    marginTop: 10
  }
});
