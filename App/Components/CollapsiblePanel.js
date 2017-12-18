import React, {
  Component,
  PropTypes
} from 'react';
import {
  View,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import InstanceTable from "./InstanceTable"

class Panel extends Component {
  static defaultProps = {
    expanded: false,
    onCollapse: this.emptyFn,
    onExpand: this.emptyFn,
  };

  constructor(props) {
    super(props);
    this.state = {
      height: this.props.expanded ? null : 0,
    };
  }

  emptyFn= () => {}

  render() {
    const children = this.props.children;
    const url = this.props.url;
    const title = this.props.title;
    const deviceName = this.props.deviceName
    const { height } = this.state;
    let currentView

    if (children == undefined){
      currentView =
      <View style={styles.main}>
        <TouchableOpacity onPress={this.onToggle}>
          <View style={styles.mainTitolo}>
            <Text style={styles.title}>
              {title}
            </Text>
            <Text style={styles.title}>
              /{url}/
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{ height }}>
          <Text style={styles.title}>
            No Value
          </Text>
        </View>
      </View>
    } else{
      const data = children;
      currentView =
      <View style={styles.main}>
        <TouchableOpacity onPress={this.onToggle}>
          <View style={styles.mainTitolo}>
            <Text style={styles.title}>
              {title}
            </Text>
            <Text style={styles.title}>
              /{url}/
            </Text>
          </View>
        </TouchableOpacity>
        <View style={[{ height }, styles.container]}>
          <InstanceTable
            data = {data}
            deviceName = {deviceName}>
          </InstanceTable>
        </View>
      </View>
    }
    return (
      currentView
    );
  }

  onToggle = () => {
    LayoutAnimation.spring();
    this.setState({
      height: this.state.height === null ? 0 : null,
    })
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#ffffff',
    borderColor: "#bebebe",
    borderRadius: 5,
    overflow: 'scroll',
		borderWidth:1,
    marginBottom: 7

  },
  container: {
    paddingBottom: 7
  },
  mainTitolo: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontWeight: 'bold',
    padding: 15,
    color: "#5a5a5a",
    fontSize: 16
  }
});


export default Panel;
