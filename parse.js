// Read Synchrously
var fs = require("fs");
console.log("\n *START* \n");
var content = fs.readFileSync("teste3.txt");

var jsonContent = JSON.parse(content);
// Get Value from JSON

 console.log("\nFace count: ", jsonContent.face.length);

  console.log("Face first level:\n\n\ ", jsonContent.face);

 console.log("\nFace second level:\n\n ", jsonContent.face[0].face);

 console.log("\nFace second level:\n\n ", jsonContent.face[0].age);

 console.log("\nFace second level:\n\n ", jsonContent.face[0].expression);

console.log("\n *EXIT* \n");

