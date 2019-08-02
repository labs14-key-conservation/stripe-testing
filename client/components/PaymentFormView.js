import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { FontAwesome } from '@expo/vector-icons';

import { connect } from 'react-redux';
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
      orgTotalAmount: 0,
      keyTotalAmount: 0,
      totalAmount: 0,
      description: 'Donation',
      orgStripeAccountId: '1234',
    }

    componentDidUpdate(prevState) {
      if(this.state.totalAmount !== prevState.totalAmount) {
        console.log('update')
        this.props.extraPaymentInfo(this.state)
      }
    }



  render() {
    const { onSubmit, submitted, error } = this.props;
    return (
      <View>
        <View>
          <CreditCardInput requiresName onChange={(cardData) => this.setState({
            ...this.state,
            cardData: cardData
          })} />

          <Text>Org Donation</Text>
          <TextInput
            value={this.state.orgTotalAmount}
            onChangeText={text => {
              let orgAmount = (parseInt(text, 10) + .3)/(1 - .029)

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
              let keyAmount = (parseInt(text, 10))/(1 - .029)

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
