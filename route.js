var reconhecimento = require("./reconhecePessoa.js");
var faker = require("faker");

var appRouter = function (app) {

  app.get("/", function (req, res) {
    res.status(200).send({ message: 'Welcome to our restful API' });
  });

  app.get("/user", function (req, res) {
    var data = ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email()
    });
    res.status(200).send(data);
  });

  app.get("/reconhecePessoa", function (req, res) {
    console.time('test');
    reconhecimento.reconhecePessoa().then(function(result) {
        console.log( JSON.stringify(result, null, '  ') ) ;
        console.log('');
        console.log('');
        console.log('');
        console.timeEnd('test');
        res.status(200).send( result );
    }, function(err) {
        console.log(err);
    });
    
  });

 app.get("/users/:num", function (req, res) {
   var users = [];
   var num = req.params.num;

   if (isFinite(num) && num  > 0 ) {
     for (i = 0; i <= num-1; i++) {
       users.push({
           firstName: faker.name.firstName(),
           lastName: faker.name.lastName(),
           username: faker.internet.userName(),
           email: faker.internet.email()
        });
     }

     res.status(200).send(users);
    
   } else {
     res.status(400).send({ message: 'invalid number supplied' });
   }

 });
}

module.exports = appRouter;