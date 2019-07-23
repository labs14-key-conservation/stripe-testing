import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
/**
 * The class renders a view for Home Page
 */
export default class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} ref={ref => (this.scrollViewRef = ref)}>
          <View style={styles.textWrapper}>
            <Text style={styles.infoText}>
              Home
            </Text>
            <Button title="Donate" onPress={() => this.props.history.push('/payment')} />
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textWrapper: {
    margin: 10
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center'
  }
});
