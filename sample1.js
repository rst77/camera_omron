// Load the node-omron-hvc-p2 and get a `HvcP2` constructor object
const HvcP2 = require('node-omron-hvc-p2');
// Create a `HvcP2` object
const hvcp2 = new HvcP2();

// Connect to the HVC-P2
hvcp2.connect().then(() => {
  // Send a command for detecting
  return hvcp2.detect({
    face   : 1, // Enable face detection
    age    : 1, // Enable age estimation
    gender : 1  // Enable gender Estimation
  });
}).then((res) => {
  // Show the result
  console.log(JSON.stringify(res, null, '  '));
  // Disconnect the HVC-P2
  return hvcp2.disconnect();
}).then(() => {
  console.log('Disconnected.');
}).catch((error) => {
  console.error(error);
