// Load the node-omron-hvc-p2 and get a `HvcP2` constructor object
const HvcP2 = require('node-omron-hvc-p2');
// Create a `HvcP2` object
const hvcp2 = new HvcP2();

// Connect to the HVC-P2
hvcp2.connect().then(() => {
  // Send a command for detecting
  return hvcp2.detect({
    face        : 1,            // Enable face detection
    age         : 1,            // Enable age estimation
    direction   : 1,
    expression  : 1,
    image       : 1,            // Enable capturing image
    imageType   : 3,            // Save the image as a file
    imageFormat : 'png',        // Image format
    imagePath   : './test.png', // File path
    imageMarker : true          // Draw markers in the image
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
});
