import React, { Component } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	StatusBar,
	StackNavigator,
	FlatList,
	Alert
} from "react-native";
import { List, ListItem, SearchBar, Avatar } from "react-native-elements"
import HttpRequester from "./App/Components/HttpRequest"
import BarraDiStato from "./App/Components/BarraDiStato"
import ClientDetail from "./ClientDetail"
import Zeroconf from 'react-native-zeroconf'
import WriteConstant from './App/Constants.js'

const zeroconf = new Zeroconf();
var serverIp="";

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			data:[],
			refreshing: false,
			error: null,
			connection: false,
			serverNotFound: true
		};
	}

	foundZeroConfService = (device) => {
		if(device.name == "Leshan Server"){
			serverIp= "http://" + device.addresses[0] + ":8080/api/clients";+
			WriteConstant.writeServerIpConstant(serverIp)
			var url = "http://" + device.addresses[0] + ":8080/api/objectspecs"
			HttpRequester.fetchObjectSpecsFromServer(url).then(responseJson => {
				WriteConstant.writeObjectSpecsConstant(responseJson)
				serverObjectSpecs = responseJson
			});
			this.setState({
				serverNotFound: false
			})
			zeroconf.stop();
			this.makeRemoteRequest();
		}
	}

	_serverNotFound = () => {
		zeroconf.stop();
		this.setState({
			refreshing: false
		})
		Alert.alert(
			'Server Leshan Error',
			"Non è stato rilevato alcun server Leshan nella rete locale",
			[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
			],
			{ cancelable: false }
		)
	}

	startZeroConfSearch = () => {
		this.setState({
			serverNotFound: true
		})
		zeroconf.on('resolved', (device) => this.foundZeroConfService(device));
		zeroconf.scan();
		setTimeout(() => {
			if(this.state.serverNotFound){
				console.log(zeroconf.getServices())
				this._serverNotFound();
			}
		}, 10000)
	}

	componentDidMount() {
		this.startZeroConfSearch();
	}

	makeRemoteRequest = () => {
		const url = serverIp;
		const arr = [];
		this.setState({ isLoading: true });
		HttpRequester.fetchDataFromServer(url, 'GET')
		.then(responseJson => {
			this.setState({
				isLoading: false,
				refreshing: false,
				error: responseJson.error || null,
			});

			for (var i in responseJson)
			{
				arr.push({"nome": responseJson[i].endpoint, "lastUpdate": responseJson[i].lastUpdate});
			}
			this.setState({data: arr});
			if(arr.length == []){
				Alert.alert(
		      'Client Leshan',
		      "Non è stato rilevato alcun client collegato al server Leshan",
		      [
		        {text: 'OK', onPress: () => console.log('OK Pressed')},
		      ],
		      { cancelable: false }
		    )
			}
		})
		.catch(error => {
			this.setState({
				isLoading: false,
				refreshing: false
			});
			console.log(error);
			Alert.alert(
	      'Client Leshan',
	      "Non è stato rilevato alcun client collegato al server Leshan",
	      [
	        {text: 'OK', onPress: () => console.log('OK Pressed')},
	      ],
	      { cancelable: false }
	    )
		});
	};

	_renderItem = ({ item }) => {
		const { navigate } = this.props.navigation;
		return (
			<ListItem
				title={item.nome}
				subtitle={`Last Update: ${item.lastUpdate}`}
				onPress={() => navigate(
					'ClientDetail',
					{ device: item.nome},
				)}
				avatar={
					<Avatar
						small
						rounded
						title ="D"
					/>
				}
			/>
		);
	};

_renderHeader = () => {
	return <SearchBar placeholder="Type Here..." lightTheme round />;
};

_renderFooter = () => {
	if (!this.state.isLoading) return null;
	return (
		<View
			style={{
				paddingVertical: 20,
				borderTopWidth: 1,
				borderColor: "#CED0CE"
			}}
			>
				<ActivityIndicator animating size="large" />
			</View>
		);
	};

	_renderSeparator = () => {
		return (
			<View
				style={{
					height: 1,
					width: "86%",
					backgroundColor: "#CED0CE",
					marginLeft: "14%"
				}}
			/>
		);
	};

	_handleRefresh = () => {
		this.setState(
			{
				refreshing: true
			},
			() => {
				this.startZeroConfSearch();
			}
		);
	};

	render() {
		return (
			<View style={styles.statusBar}>
				<BarraDiStato titolo={"Home"} leftArrow={false} rightButton={true} navigation={this.props.navigation}/>
				<View style={styles.parent}>
					<FlatList
						data={this.state.data}
						renderItem={this._renderItem}
						keyExtractor={item => item.nome}
						ListHeaderComponent={this._renderHeader}
						ListFooterComponent={this.renderFooter}
						ItemSeparatorComponent={this._renderSeparator}
						refreshing={this.state.refreshing}
						onRefresh={this._handleRefresh}
					/>
				</View>
			</View>

		);
	}
}

const styles = StyleSheet.create({
	statusBar: {
		flexDirection: 'column',
		flex: 1
	},
	parent: {
		backgroundColor: "#f7f5f1",
		flexDirection: 'column',
		justifyContent: 'flex-start',
		position: "absolute",
		top: 60,
		left: 0,
		right: 0,
		bottom: 0
	},
	text: {
		fontWeight: 'bold',
		color: "#5a5a5a",
		borderWidth: 1,
		borderColor: "#5a5a5a"
	}
});

export default Home;
