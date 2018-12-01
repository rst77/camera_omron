// Load the node-omron-hvc-p2 and get a `HvcP2` constructor object
const HvcP2 = require('node-omron-hvc-p2');
// Create a `HvcP2` object
const hvcp2 = new HvcP2();
console.log('Pre-Connection');
var connection = hvcp2.connect();
console.log('Post-Connection');
console.log('Serial Port Path: ' + connection.getSerialPortPath());

var res = hvcp2.detect({
    face: 1,
    direction: 1,
    age: 1,
    gender: 1,
    gaze: 1,
    blink: 1,
    expression: 1,
    recognition: 1,
    image: 1,
    imageType: 3,
    imageFormat: 'png',
    imagePath: './capture.png',
    imageMarker: true
  });
