export var serverIp = ""
export var objectSpecs = [];

function writeServerIpConstant(value) {
  serverIp = value
}

function writeObjectSpecsConstant(value){
  objectSpecs = value

}

  export default {writeServerIpConstant: writeServerIpConstant, writeObjectSpecsConstant:writeObjectSpecsConstant}
