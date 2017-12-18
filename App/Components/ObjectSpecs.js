import React, { Component } from "react";
import {Text} from 'react-native';
import {objectSpecs} from "../Constants.js"

function getObjectSpecs(idObject, idItem) {
	for (var i in serverObjectSpecs){
		if(serverObjectSpecs[i].id == idObject ){
			for(var j in serverObjectSpecs[i].resourcedefs){
				if(serverObjectSpecs[i].resourcedefs[j].id == idItem){
					return [serverObjectSpecs[i].resourcedefs[j].name, serverObjectSpecs[i].resourcedefs[j].operations, serverObjectSpecs[i].resourcedefs[j].type];
					break;
				}
			}
			break;
		}
	}
}


export default { getObjectSpecs: getObjectSpecs};
