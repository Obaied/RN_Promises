'use strict';

import React, { Component } from 'react';
import {
  AsyncStorage,
  PickerIOS,
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';


let PickerItemIOS = PickerIOS.Item;

let STORAGE_KEY = '@Promises:key';
let COLORS = ['red', 'orange', 'yellow', 'green', 'blue'];

class Promises extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedValue: COLORS[0],
      message: '',
    };

    this._onValueChange = this._onValueChange.bind(this);
    this._removeStorage = this._removeStorage.bind(this);
  }

  componentDidMount() {
    this._loadInitialState().done();
  }

  async _loadInitialState() {
    try {
      let value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null){
        this.setState({selectedValue: value});
        this._writeMessage('Recovered selection from disk: ' + value);
      } else {
        this._writeMessage('Initialized with no selection on disk.');
      }
    } catch (error) {
      this._writeMessage('AsyncStorage error: ' + error.message);
    }
  }

  render() {
    var color = this.state.selectedValue;

    return (
      <View>
        <PickerIOS
          selectedValue={color}
          onValueChange={this._onValueChange}>
          {COLORS.map((value) => (
            <PickerItemIOS
              key={value}
              value={value}
              label={value}
            />
            ))}
          </PickerIOS>
          <Text>
            {'Selected: '}
            <Text style={{color}}>
              {this.state.selectedValue}
            </Text>
          </Text>
          <Text>{' '}</Text>
          <Text onPress={this._removeStorage}>
            Press here to remove from storage.
          </Text>
          <Text>{' '}</Text>
          <Text>Message:</Text>
          <Text>{this.state.message}</Text>
        </View>
    );
  }

  async _onValueChange(selectedValue) {
    this.setState({selectedValue});
    try {
      await AsyncStorage.setItem(STORAGE_KEY, selectedValue);
      this._writeMessage('Saved selection to disk: ' + selectedValue);
    } catch (error) {
      this._writeMessage('AsyncStorage error: ' + error.message);
    }
  }

  async _removeStorage() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      this._writeMessage('Selection removed from disk.');
    } catch (error) {
      this._writeMessage('AsyncStorage error: ' + error.message);
    }
  }

  _writeMessage(message) {
    this.setState({
      message: message
    });
  }
}

const styles = StyleSheet.create({
});

AppRegistry.registerComponent('Promises', () => Promises);
