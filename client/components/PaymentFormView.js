import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { FontAwesome } from '@expo/vector-icons';
/**
 * Renders the payment form and handles the credit card data
 * using the CreditCardInput component.
 */
export default class PaymentFormView extends Component {
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

  onChangeHandler = e => {
    const value = e.nativeEvent.text
    const name = e.nativeEvent.target
    console.log(value)
    const total = ( value + .3)/(1 - .029)

    if(name === 149) {
      this.setState({
        ...this.state,
        orgTotalAmount: total,
        totalAmount: this.state.orgTotalAmount + this.state.keyTotalAmount
      })
    } else if (name === 157) {
      this.setState({
        ...this.state,
        keyTotalAmount: total,
        totalAmount: this.state.orgTotalAmount + this.state.keyTotalAmount
      })
    }

    // extraPaymentInfo(this.state)
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

          <TextInput
            id='orgAmount'
            value={this.state.orgTotalAmount}
            onChange={this.onChangeHandler}
          />
          <Text>{this.state.orgTotalAmount}</Text>

          <TextInput
            id='keyAmount'
            value={this.state.keyTotalAmount}
            onChange={this.onChangeHandler}
          />
          <Text>{this.state.keyTotalAmount}</Text>

          <Text>Total Donation Amount for this campaign</Text>
          <Text>{this.state.totalAmount}</Text>
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
