import React, {Component} from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
} from "react-native";
import DialogManager, { ScaleAnimation, DialogContent } from 'react-native-dialog-component';
import ObjectSpecs from "./ObjectSpecs.js";
import SectionListLine from "./SectionListLine.js";

class InstanceTable extends Component {

  constructor(props) {
    super(props);
    this.objectId = null;
    this.istanceNumber=null;
    this.deviceName = null;
    this.value = null;
  }

  _renderItem = ({ item }) => {
      const detail = ObjectSpecs.getObjectSpecs(this.objectId, item.id);
      return (
        <SectionListLine
  				item= {item}
  				detail = {detail}
  				objectId = {this.objectId}
  				istanceNumber = {this.istanceNumber}
          deviceName = {this.deviceName}>
  			</SectionListLine>
      );
    };

  _renderHeader = ({ section }) => {
    this.istanceNumber = section.key;
    var sectionTitle = null
    if(section.key == 0){
      sectionTitle =
      <Text style={styles.headingText}>
        Istance {section.key}
      </Text>;
    } else{
      sectionTitle =
      <Text style={styles.headingTextNext}>
        Istance {section.key}
      </Text>;
    }
    return (
      sectionTitle
    );
  };

  _renderItemSeparator = () => {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: "#bebebe",
          marginLeft: 10,
          marginRight: 10
        }}
        >
      </View>
    );
  };

  render() {
    const {data, deviceName} = this.props
    const sectionListData = [];
    this.deviceName = deviceName

    for(var i in data){
      sectionListData.push({key: data[i].istance, data: data[i].data});
      this.objectId = data[i].url
    }

    return (
      <SectionList
        sections={sectionListData}
        keyExtractor={item => item.id}
        renderSectionHeader={this._renderHeader}
        numColumns={5}
        renderItem={this._renderItem}
        renderSectionHeader={this._renderHeader}
        ItemSeparatorComponent={this._renderItemSeparator}
      />
    );
  }
}

const styles = StyleSheet.create({
  headingText: {
    padding: 5,
    fontSize: 14,
    fontWeight: 'bold'
  },
  headingTextNext:{
    marginTop: 15,
    padding: 5,
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default InstanceTable;
