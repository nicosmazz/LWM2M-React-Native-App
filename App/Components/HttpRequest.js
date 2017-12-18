import {Alert} from "react-native"
import {serverIp} from "../Constants.js"


function fetchDataFromServer(url, method) {
     return fetch(url, {
       method: method
     })
     .then((response) => response.json())
     .then((responseJson) => {
        return responseJson
     })
     .catch(error => {
       console.log(error);
     });
}

function fetchObjectSpecsFromServer(url) {
     return fetch(url, {
       method: 'GET'
     })
     .then((response) => response.json())
     .then((responseJson) => {
        return responseJson
     })
     .catch(error => {
       console.log(error);
     });
}

function putDataIntoServer(deviceName,objectId, istanceNumber, itemId, value) {
  const url = serverIp+"/"+deviceName+ "/" + objectId + "/" + istanceNumber + "/" + itemId;
  fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: itemId,
      value: value
    })
  })
  .then((response) => {
    var risposta = null;
    if (response.status == 200){
        risposta = "Valore aggiornato correttamente."
    } else{
      risposta = "Errore durante la richiesta di aggiormento. Tentare di nuovo fra poco. " + response._bodyText
    }
    Alert.alert(
      'HTTP Request Response',
      risposta,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  })
  .catch((error) => {
      console.log(error);
      Alert.alert(
	      'Errore richiesta HTTP',
	      "Si è verificato un errore, controllare la connessione a internet ed eventualmente ricaricare l'applicazione",
	      [
	        {text: 'OK', onPress: () => console.log('OK Pressed')},
	      ],
	      { cancelable: false }
	    )
    })
  .done();
}

export default {fetchDataFromServer: fetchDataFromServer, putDataIntoServer:putDataIntoServer, fetchObjectSpecsFromServer: fetchObjectSpecsFromServer}
