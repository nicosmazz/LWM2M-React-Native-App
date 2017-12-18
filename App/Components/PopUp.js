import React, {Component} from "react";
import {
  Button,
  View,
  StyleSheet,
  Text,
  Dimensions,
	TextInput
} from 'react-native'
import DialogManager, { ScaleAnimation, DialogContent } from 'react-native-dialog-component';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';


function showDialog() {

  DialogManager.show({
    title: (
      <View style={styles.viewTitle}>
        <Text style={styles.title}>
          Update Value
        </Text>
      </View>
    ),
    width: Dimensions.get('window').width - 100,
    titleAlign: 'center',
    animationDuration: 200,
    ScaleAnimation: new SlideAnimation({
      slideFrom: 'bottom',
    }),
    children: (
      <DialogContent>
        <View>
          <Text style={styles.text}>
            Username
          </Text>
          <TextInput
            style={styles.input}
            placeholder={"Inserisci la tua username"}
            color="#5a5a5a"
          />
        </View>
        <View style={styles.bottom}>
          <View style={styles.buttonConferma}>
            <Button
              onPress={closePopUp()}
              title="Chiudi"
              color="white"
              style={{borderRadius: 30}}
              accessibilityLabel="Clicca per effettuare l'update del valore"
            />
          </View>
          <View style={styles.buttonChiudi}>
            <Button
              onPress={this._closePopUp}
              title="Conferma"
              color="white"
              buttonStyle={styles.button}
              accessibilityLabel="Clicca per effettuare l'update del valore"
            />
          </View>
        </View>
      </DialogContent>
    ),

  }, () => {
    console.log('callback - show');
  });

}
function closePopUp(){
  DialogManager.dismiss();
}

const styles = StyleSheet.create({
  viewTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color:"#5a5a5a",
  },
  text: {
		textAlign: 'left',
		marginLeft: 15,
    fontWeight: 'bold',
		fontSize: 16,
		color: "#5a5a5a",
	},
	input: {
		borderWidth: 1,
		backgroundColor: "#ffffff",
		borderColor: "#bebebe",
		padding: 2,
		height: 40,
		textAlign: "left",
		paddingLeft: 15,
	},
  bottom: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: "center",
    marginTop: 20
	},
  buttonChiudi:{
    backgroundColor: "#4295a4",
  },
  buttonConferma:{
    backgroundColor: "#4295a4",
    marginRight: 20
  }

});

export default {showDialog: showDialog}
