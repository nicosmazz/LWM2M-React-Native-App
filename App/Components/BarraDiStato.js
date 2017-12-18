import React, { Component } from "react";
import {
	StyleSheet,
	Button,
	Platform,
	View,
	Text,
	StatusBar
} from "react-native";
import { Icon, Header } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';


class BarraDiStato extends Component {
	constructor(props) {
		super(props);
		this.state = {
			titolo: this.props.titolo,
			leftArrow: this.props.leftArrow,
			rightButton: this.props.rightButton,
			navigation: this.props.navigation
		};
	}
	onPress = () => {
		this.state.navigation.goBack()
	};

	render() {
		let header = null;
		const leftArrow = this.props.leftArrow;
		const rightButton = this.props.rightButton;
		if(!this.props.leftArrow && this.props.rightButton) {
			header=
				<Header
					centerComponent={<Text style={styles.titolo}>{this.state.titolo}</Text>}
					rightComponent={{
						icon: 'home',
						color: 'white',
						size: 35,
						onPress: this.onPress,
						marginRight: 100,
						underlayColor: '#e65244'}}
						outerContainerStyles={{ backgroundColor: '#e65244' }}
					/>
			}	else if(this.state.leftArrow && !this.state.rightButton ){
				header=
					<Header
						leftComponent={{
							icon: 'chevron-left',
							color: 'white',
							size: 35,
							onPress: this.onPress,
							underlayColor: '#e65244'}}
							centerComponent={<Text style={styles.titolo}>{this.state.titolo}</Text>}
							outerContainerStyles={{ backgroundColor: '#e65244' }}
						/>
				} else {
					header =
						<Header
							centerComponent={<Text style={styles.titolo}>{this.state.titolo}</Text>}
							outerContainerStyles={{ backgroundColor: '#e65244' }}
						/>
				}
				return(
				header
			);
		}
	}

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
	titolo: {
		fontWeight: 'bold',
		color: 'white',
		fontSize: 16,
		alignItems: 'center',
		marginBottom:  7
	},
	container: {
		marginBottom: 10
	}
});

export default BarraDiStato;
