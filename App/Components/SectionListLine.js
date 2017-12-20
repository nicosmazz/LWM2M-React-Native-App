import React, {Component} from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Alert
} from "react-native";
import DialogManager, { ScaleAnimation, DialogContent } from 'react-native-dialog-component';
import Button from 'react-native-button';
import HttpRequest from "./HttpRequest.js";
import {serverIp} from "../Constants.js"

const timer = require('react-native-timer');

class SectionListLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pressStatus : false,
      itemValue : this.props.item.value,
      deviceName : this.props.deviceName
    }
  }

  _observeFunction = (objectId, istanceNumber, itemId) => {
    url = serverIp + "/" + this.state.deviceName + "/" + objectId + "/" + istanceNumber + "/" + itemId
    HttpRequest.fetchDataFromServer(url, 'GET')
    .then(responseJson => {
      this.setState({
        itemValue: responseJson.content.value
      })
    })
    .catch(error => {
      console.log(error);
      Alert.alert(
        'Errore lettura valore',
        "Si è verificato un errore, controllare la connessione a internet ed eventualmente ricaricare l'applicazione",
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
    });
  }

  _onPressExecuteAction = (objectId, istanceNumber, itemId) => {
      HttpRequest.postDataIntoServer(this.state.deviceName,objectId, istanceNumber, itemId);
  }

  _onPressExecuteActionWithParams = (objectId, istanceNumber, itemId, itemName, type) => {
    DialogManager.show({
      title: (
        <View style={styles.viewTitle}>
          <Text style={styles.title}>
            Update {itemName} value
          </Text>
        </View>
      ),
      width: Dimensions.get('window').width - 100,
      titleAlign: 'center',
      SlideAnimation: "bottom",
      animationDuration: 200,
      ScaleAnimation: new ScaleAnimation(),
      children: (
        <DialogContent>
          <View>
            <Text style={styles.text}>
              {itemName}
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.value = text}
            />
          </View>
          <View style={styles.bottom}>
            <Button
              containerStyle={[styles.buttonDialog, {marginRight: 20}]}
              style={styles.textButton}
              onPress={() => DialogManager.dismiss()}
              > Chiudi
            </Button>
            <Button
              style={styles.textButton}
              containerStyle={styles.buttonDialog}
              onPress={() => this._makeExecute(objectId,istanceNumber, itemId, this.value, type)}
              accessibilityLabel="Clicca per confermare la modifica"
              > Conferma </Button>
            </View>
          </DialogContent>
        )
      });
  }

  _makeExecute = (objectId, istanceNumber, itemId, value, type) =>{
    var correctValue
    if (type=="Integer" || type=="integer") {
      correctValue = parseInt(value)
    } else{
      correctValue = value;
    }
    HttpRequest.postDataIntoServerWithParams(this.state.deviceName,objectId, istanceNumber, itemId, correctValue);
    DialogManager.dismiss();

  }

  _updateAction = (objectId, istanceNumber, itemId, value, type) => {
    var correctValue
    if (type=="Integer" || type=="integer") {
      correctValue = parseInt(value)
    } else{
      correctValue = value;
    }
    HttpRequest.putDataIntoServer(this.state.deviceName,objectId, istanceNumber, itemId, correctValue);
    setTimeout(() => {
      this._onPressReadAction(objectId, istanceNumber, itemId);
    }, 3000)
    DialogManager.dismiss();
  }

  _onPressObserveAction = (objectId, istanceNumber, itemId) => {
    if(this.state.pressStatus){
      this.setState({
        pressStatus : false
      })
      timer.clearInterval(this);
    } else{
      this.setState({
        pressStatus: true
      }, () => timer.setInterval(
        this, 'checkValue', () => this._observeFunction(objectId, istanceNumber, itemId), 10000
      ));
    }
  }

  _onPressWriteAction = (objectId, istanceNumber, itemId, itemName, type, defaultValue) => {
    this.value = String(defaultValue);
    DialogManager.show({
      title: (
        <View style={styles.viewTitle}>
          <Text style={styles.title}>
            Update {itemName} value
          </Text>
        </View>
      ),
      width: Dimensions.get('window').width - 100,
      titleAlign: 'center',
      SlideAnimation: "bottom",
      animationDuration: 200,
      ScaleAnimation: new ScaleAnimation(),
      children: (
        <DialogContent>
          <View>
            <Text style={styles.text}>
              {itemName}
            </Text>
            <TextInput
              style={styles.input}
              defaultValue={String(defaultValue)}
              onChangeText={(text) => this.value = text}
            />
          </View>
          <View style={styles.bottom}>
            <Button
              containerStyle={[styles.buttonDialog, {marginRight: 20}]}
              style={styles.textButton}
              onPress={() => DialogManager.dismiss()}
              accessibilityLabel="Clicca per chiudere la finestra"
              > Chiudi
            </Button>
            <Button
              style={styles.textButton}
              containerStyle={styles.buttonDialog}
              onPress={() => this._updateAction(objectId,istanceNumber, itemId, this.value, type)}
              accessibilityLabel="Clicca per confermare la modifica"
              > Conferma </Button>
            </View>
          </DialogContent>
        )
      });
    }

  _onPressReadAction = (objectId, istanceNumber, itemId) => {
    url = serverIp + "/" + this.state.deviceName + "/" + objectId + "/" + istanceNumber + "/" + itemId
    HttpRequest.fetchDataFromServer(url, 'GET')
    .then(responseJson => {
      this.setState({
        itemValue: responseJson.content.value
      })
    })
    .catch(error => {
      console.log(error);
      Alert.alert(
        'Errore lettura valore',
        "Si è verificato un errore, controllare la connessione a internet ed eventualmente ricaricare l'applicazione",
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
    });
  }

  render(){
    const {item, detail, objectId, istanceNumber} = this.props
    var operations;
    if (detail[1] == "RW"){
      var istance = istanceNumber;
      operations =
      <View style={styles.operations}>
        <Button
          containerStyle={[styles.containerButton, {marginRight: 7}]}
          style={styles.button}
          onPress={() => this._onPressWriteAction(objectId, istance, item.id, detail[0], detail[2], this.state.itemValue)}
          accessibilityLabel="Clicca per effettuare la modifica del valore"
          > Write
        </Button>
        <Button
          containerStyle={[this.state.pressStatus ? styles.containerButtonAfterPressed : styles.containerButton, {marginRight: 7}]}
          style={styles.button}
          onPress={() => this._onPressObserveAction(objectId, istance, item.id)}
          accessibilityLabel="Clicca per osservare la risorsa"
          > Observe
        </Button>
        <Button
          containerStyle={styles.containerButton}
          style={styles.button}
          onPress={() => this._onPressReadAction(objectId, istance, item.id)}
          accessibilityLabel="Clicca per leggere il valore della risorsa"
          > Read
        </Button>
      </View>
    } else if(detail[1] == "R"){
      var istance = istanceNumber;
      operations =
      <View style={styles.operations}>
        <Button
          containerStyle={[this.state.pressStatus ? styles.containerButtonAfterPressed : styles.containerButton, {marginRight: 7}]}
          style={styles.button}
          onPress={() => this._onPressObserveAction(objectId, istance, item.id)}
          accessibilityLabel="Clicca per osservare la risorsa"
          > Observe
        </Button>
        <Button
          containerStyle={styles.containerButton}
          style={styles.button}
          onPress={() => this._onPressReadAction(objectId, istance, item.id)}
          accessibilityLabel="Clicca per leggere la risorsa"
          > Read
        </Button>
      </View>
    } else if(detail[1] == "E"){
      var istance = istanceNumber;
      operations =
        <View style={styles.operations}>
          <Button
            containerStyle={styles.containerButton}
            style={styles.button}
            onPress={() => this._onPressExecuteAction(objectId, istance, item.id)}
            accessibilityLabel="Clicca per eseguire l'execute"
            > Execute
          </Button>
          <Button
            containerStyle={styles.containerButton}
            style={styles.button}
            onPress={() => this._onPressExecuteActionWithParams(objectId, istance, item.id, detail[0], detail[2])}
            accessibilityLabel="Clicca per eseguire l'excute con parametro"
            > ExecuteWithParams
          </Button>
        </View>
    } else if( detail[1] == "NONE"){
      operations =
        <View style={styles.operations}> </View>
    }
    return(
      <View style={styles.container}>
        <Text style={styles.id}>{item.id}</Text>
        <Text style={styles.name}>
          <Text>{detail[0]}</Text>
          <Text style={{color:"#CCCAC9", fontSize: 10}}> ({objectId}/{istanceNumber}/{item.id})</Text>
        </Text>
        <Text style={styles.value}>{this.state.itemValue}</Text>
        {operations}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerButton: {
    backgroundColor: "#4295a4",
    paddingRight: 4
  },
  containerButtonAfterPressed: {
    backgroundColor: "#235861",
    paddingRight: 4
  },
  id: {
    width: 50
  },
  name: {
    flex: 1
  },
  value: {
    flex:2,
    textAlign: 'center'
  },
  operations: {
    width: 180,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  button: {
    color: "white",
    textAlign: 'center',
    fontWeight: 'bold',
  },
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
    color: "#5a5a5a"
	},
  bottom: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: "center",
    marginTop: 10,
	},
  buttonDialog:{
    backgroundColor: "#4295a4",
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    height: 35,
    borderRadius: 10
  },
  textButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  }
});

/*
<View style={styles.operations}>
  {buttonWrite}
  <Button
    containerStyle={[this.state.pressStatus ? styles.containerButtonAfterPressed : styles.containerButton, {marginRight: 7}]}
    style={styles.button}
    onPress={() => this._onPressObserveAction(objectId, istanceNumber, item.id)}
    accessibilityLabel="Clicca per effettuare l'update del valore"
    > Observe
  </Button>
  <Button
    containerStyle={styles.containerButton}
    style={styles.button}
    onPress={() => this._onPressReadAction(objectId, istanceNumber, item.id)}
    accessibilityLabel="Clicca per effettuare l'update del valore"
    > Read
  </Button>
</View>
*/
export default SectionListLine;
