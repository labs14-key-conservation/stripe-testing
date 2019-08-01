import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeRouter, Route, Link, Switch } from "react-router-native";
import AddPayment from "./components/AddPayment";
import Home from "./components/Home";

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import reducer from "./reducers";

let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <NativeRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/payment" component={AddPayment} />
          </Switch>
        </NativeRouter>
      </View>
    </Provider>
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
