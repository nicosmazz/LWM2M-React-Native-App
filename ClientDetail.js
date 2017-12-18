import React, { Component } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	StatusBar,
	StackNavigator,
	ListView,
	TouchableHighlight,
	FlatList,
	Alert
} from "react-native";

import HttpRequester from "./App/Components/HttpRequest";
import BarraDiStato from "./App/Components/BarraDiStato";
import CollapsiblePanel from "./App/Components/CollapsiblePanel";
import InstanceTable from "./App/Components/InstanceTable";
import {serverIp} from "./App/Constants.js"

class ClientDetail extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			data:[],
			detail:[],
			refreshing: false,
			error: null,
			nome:this.props.navigation.state.params.device
		};
	}

	componentDidMount() {
		this.makeRemoteRequest();
	}

	getObjectName = (url) => {
		let objectName;
		if(url === "1"){
			objectName = "System";
		} else if (url === "3") {
			objectName = "Device";
		} else if (url === "6") {
			objectName = "Location";
		} else if (url === "3303") {
			objectName = "Temperature";
		} else{
			objectName = "undefined";
		}
			return objectName;
	}

	makeRemoteRequest = () => {
		const url = serverIp + "/" + this.props.navigation.state.params.device;
		const arr = [];
		let lastUrl = null;
		HttpRequester.fetchDataFromServer(url, 'GET').then(responseJson => {
			this.setState({
				error: responseJson.error || null,
			});
			for (var i in responseJson.objectLinks)
			{
				if (responseJson.objectLinks[i].url != "/"){

					var str = responseJson.objectLinks[i].url;
					var tmpStr  = str.match("/(.*)/");
					var correntUrl  = tmpStr[0].substring(1,(tmpStr[0].length)-1);
					if (lastUrl == null) {
						arr.push({"url": correntUrl});
					} else if(lastUrl != correntUrl) {
						arr.push({"url": correntUrl});
					}
					lastUrl = correntUrl;
				}
			}
			if (arr != null){
				this.setState({data: arr});
				this.getObjectDetail()
			}
		})
		.catch(error => {
			console.log(error);
			this.setState({
				refreshing: false
			});
			Alert.alert(
				'Errore richiesta HTTP',
				"Si è verificato un errore, controllare la connessione a internet ed eventualmente ricaricare l'applicazione",
				[
					{text: 'OK', onPress: () => console.log('OK Pressed')},
				],
				{ cancelable: false }
			)
		});
	};

	getObjectDetail = () =>{
		const arr = [];
		for (var i in this.state.data){
			const url = serverIp + "/"
			+ this.props.navigation.state.params.device + "/" +this.state.data[i].url;
			HttpRequester.fetchDataFromServer(url, 'GET').then(responseJson => {
				this.setState({
					isLoading: false,
					error: responseJson.error || null,
				});
				for (var i in responseJson.content.instances)
				{
					this.state.detail.push({id:responseJson.content.id, key:responseJson.content.instances[i].id, data: responseJson.content.instances[i].resources	});
				}
				this.setState({
					isLoading: true,
					refreshing: false
				});
			})
			.catch(error => {
				this.setState({
					isLoading: true,
					refreshing: false
				});
				console.log(error);
				Alert.alert(
					'Errore richiesta HTTP',
					"Si è verificato un errore, controllare la connessione a internet ed eventualmente ricaricare l'applicazione",
					[
						{text: 'OK', onPress: () => console.log('OK Pressed')},
					],
					{ cancelable: false }
				)
			});
		}
	}

	_goBack = () => {
		this.props.navigation.goBack()
	};

	sortFunction = (a, b) => {
		if(a.id < b.id) return -1;
    if(a.id > b.id) return 1;
    return 0;
	}
	_renderItem = ({ item }) => {
		let objectName = this.getObjectName(item.url);
		let data = [];
		for(var i in this.state.detail){

			if(this.state.detail[i].id == item.url){
				data.push({istance: this.state.detail[i].key, data:this.state.detail[i].data.sort(this.sortFunction), url: item.url});
			}
		}
		let currentView
		if(data != null){
			currentView = <CollapsiblePanel
				title= {objectName}
				url = {item.url}
				children = {data}
				deviceName= {this.props.navigation.state.params.device}>
			</CollapsiblePanel>
		} else{
			currentView = <CollapsiblePanel
				title= {objectName}
				url = {item.url}>
			</CollapsiblePanel>
		}
		return (
			currentView
		);
	};

	_handleRefresh = () => {
		this.setState(
			{
				refreshing: true
			},
			() => {
				this.state.detail=[];
				this.makeRemoteRequest();
			}
		);
	};

	_renderFooter = () => {
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

	render() {
		const { navigate } = this.props.navigation;
		if (!this.state.isLoading) return null;
		return (
			<View style={styles.statusBar}>
				<BarraDiStato
					titolo={"Client / " + this.props.navigation.state.params.device}
					leftArrow={true}
					rightButton={false}
					navigation= {this.props.navigation}/>
				<View style={styles.parent}>
					<FlatList
						data={this.state.data}
						renderItem={this._renderItem}
						keyExtractor={item => item.url}
						ListFooterComponent={this.renderFooter}
						refreshing={this.state.refreshing}
						onRefresh={this._handleRefresh}
					/>
				</View>
			</View>
		);
	};
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
		bottom: 0,
		padding: 5
	}
});

export default ClientDetail;
