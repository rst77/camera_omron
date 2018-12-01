//Parse data from JSON POST and insert into MYSQL
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');

// Load the node-omron-hvc-p2 and get a `HvcP2` constructor object
const HvcP2 = require('node-omron-hvc-p2');
// Create a `HvcP2` object
const hvcp2 = new HvcP2();

// Configure MySQL connection
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'omron',
  password: 'omron',
  database: 'omron'
  })

//Establish MySQL connection
connection.connect(function(err) {
   if (err) 
      throw err
   else {
       console.log('Connected to MySQL');
       // Start the app when connection is ready
       app.listen(3000);
       console.log('Server listening on port 3000');
 }
});


  // Connect to the HVC-P2
  hvcp2.connect().then(() => {
    // Send a command for detecting
    return hvcp2.detect({
      face        : 1,            // Enable face detection
      age         : 1,            // Enable age estimation
      direction   : 1,
      gender      : 1,
      expression  : 1,
      image       : 1,            // Enable capturing image
      imageType   : 3,            // Save the image as a file
      imageFormat : 'png',        // Image format
      imagePath   : './test' + new Date().getTime() + '.png', // File path
      imageMarker : true          // Draw markers in the image
    });
  }).then((res) => {
    // Show the result

    console.log(JSON.stringify(res, null, '  '));

    //var jsondata = JSON.parse(res);
    var jsondata = JSON.parse(JSON.stringify(res, null, '  '));
    console.log("Building values");

    for(var i=0; i< jsondata.face.length; i++) {
      var values = [];
      // Le dados da face
      values.push(jsondata.face[i].face.x,jsondata.face[i].face.y,jsondata.face[i].face.size,jsondata.face[i].face.confidence);
      // Le dados de idade
      values.push(jsondata.face[i].age.age,jsondata.face[i].age.confidence);
      // Le dados de sexo
      values.push(jsondata.face[i].gender.gender,jsondata.face[i].gender.confidence)
      // Le dados de humor
      values.push(jsondata.face[i].expression.neutral, jsondata.face[i].expression.happiness,jsondata.face[i].expression.surprise);
      values.push(jsondata.face[i].expression.anger, jsondata.face[i].expression.sadness, jsondata.face[i].expression.positive);

      console.log('\n\nEstrutura de Dados:\n\n');
      console.log( values );
      console.log('\n\n*******************\n\n');
    //Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
    connection.query('INSERT INTO omron.image_data (' +
                                        'face_x, ' +
                                        'face_y, ' +
                                        'face_size, ' +
                                        'face_confidence, ' +
                                        'age, ' +
                                        'age_confidence, ' +
                                        'gender, ' +
                                        'gender_confidence, ' +
                                        'exp_neutral, ' +
                                        'exp_happiness, ' +
                                        'exp_anger, ' +
                                        'exp_surprise, ' +
                                        'exp_sadness, ' +
                                        'exp_positive ' +
                                        ') VALUES (?)', [values], function(err,result) {
        if(err) {
           console.log('Error');
           console.log(err);
        }
       else {
           console.log('Success');
        }
      });
    }
    // Disconnect the HVC-P2
    return hvcp2.disconnect();

  }).then(() => {
    console.log('Disconnected.');
  }).catch((error) => {
    console.error(error);
  });


