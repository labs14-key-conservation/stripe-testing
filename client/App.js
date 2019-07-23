import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeRouter, Route, Link, Switch } from "react-router-native";
import AddPayment from "./components/AddPayment";
import Home from "./components/Home";

export default function App() {
  return (
    <View style={styles.container}>
      <NativeRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/payment" component={AddPayment} />
        </Switch>
      </NativeRouter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
