// Load the node-omron-hvc-p2 and get a `HvcP2` constructor object
const HvcP2 = require('node-omron-hvc-p2');
// Create a `HvcP2` object
const hvcp2 = new HvcP2();

var resultado = "";

module.exports = {

    reconhecePessoa: function() {
        return new Promise(function(resolve, reject) {
            var endereco = 'test' + new Date().getTime() + '.png';
            // Connect to the HVC-P2
            hvcp2.connect().then(() => {
                
                // Send a command for detecting
                return hvcp2.detect({
                    body: 1,
                    hand: 1,
                    face: 1,
                    direction: 1,
                    age: 1,
                    gender: 1,
                    gaze: 1,
                    blink: 1,
                    expression: 1,
                    recognition: 1,
                    image       : 1,            // Enable capturing image
                    imageType   : 3,            // Save the image as a file
                    imageFormat : 'png',        // Image format
                    imagePath   : './' + endereco, // File path
                    imageMarker : true          // Draw markers in the image
                });
            }).then((res) => {
            // Show the result
            //console.log(JSON.stringify(res, null, '  '));
            console.log('Processando a saida');
            // Disconnect the HVC-P2
            res.image.endereco = endereco;
            resolve(res);
            hvcp2.disconnect();
            }).then((res) => {
                console.log('Disconnected.');
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });
    }

}