import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeRouter, Route, Link } from "react-router-native";
import Payment from "./components/payment";

export default function App() {
  return (
    <View style={styles.container}>
      <NativeRouter>
        <Route>
          <Payment exact path="/" component={Payment} />
        </Route>
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
