import React, { Component } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Dimensions,
	StatusBar,
	Navigator
} from "react-native";
import { StackNavigator } from 'react-navigation';
import BarraDiStato from "./App/Components/BarraDiStato";
import Home from "./Home.js"
import ClientDetail from "./ClientDetail.js"
import Button from 'react-native-button';

class Login extends Component {


	constructor(props) {
		super(props);
		this.state = {
			connection: false
		}
	}

	render() {
		const { navigate } = this.props.navigation;
		return (
			<View style={styles.statusBar}>
				<BarraDiStato titolo={"Login"}/>
				<View style={styles.parent}>
			  	<View style={styles.top}>
							<Text style={styles.text}>
								Username
							</Text>
							<TextInput
								style={[styles.input, {marginBottom: 20}]}
								placeholder={"Inserisci la tua username"}
							/>
							<Text style={styles.text}>
								Password
							</Text>
				 		<TextInput
							style={styles.input}
							placeholder={"Inserisci la tua password"}
						/>
					</View>
					<View style={styles.bottom}>
						<Button
			        containerStyle={styles.containerButton}
			        style={styles.button}
			        onPress={() => navigate('HomePage')}
			        accessibilityLabel="Clicca per effettuare l'update del valore"
			      > Conferma
			      </Button>
					</View>
				</View>
			</View>
		);
	}
}

const App = StackNavigator({
	LoginPage: { screen: Login },
	HomePage: { screen: Home },
	ClientDetail: { screen: ClientDetail}
},
{
   headerMode: 'none'
 });

const styles = StyleSheet.create({
	statusBar: {
		flexDirection: 'column',
		flex: 1
	},
	parent: {
    backgroundColor: "#f7f5f1",
		flexDirection: 'column',
		justifyContent: 'center',
		position: "absolute",
		top: 60,
		left: 0,
		right: 0,
		bottom: 0
	},
	top: {
		flexDirection: 'column',
		marginBottom: 130
	},
	containerButton: {
		backgroundColor: "#4295a4",
		width: Dimensions.get('window').width - 10 ,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
	},
	button: {
		color: "white",
		textAlign: 'center',
		fontWeight: 'bold',
	},
	bottom: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: "center",
	},
	text: {
		textAlign: 'left',
		marginLeft: 15,
    fontWeight: 'bold',
		fontSize: 18,
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
		color:'#5a5a5a'
	}
});

export default App;
