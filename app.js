const express = require("express");
const https = require("https"); //standard, native node modules (não precisa instalar por fora)
const bodyParser = require("body-parser"); //para poder pegar o que o usuário mandar

const app = express();

app.use(bodyParser.urlencoded({extended: true})); //poder usar o bodyParser
//não faço ideia pq usar "units=metric" , pra transformar a temperatura em celsius, da merda
app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html")
});

app.post("/", function(req, res){
  const query = req.body.cityName;
  const apiKey = "cf32604f262d1a26ceded439282d6159"; //https://home.openweathermap.org/api_keys
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey;
  //CUIDADO PRA N PEGAR O SAMPLE AO INVES DO API, SE N N VEM AS PARADAS CERTAS

  https.get(url, function(response){
    console.log(response.statusCode);

    response.on("data", function(data){
      const weatherData = JSON.parse(data); //transformar em um objeto (sem isso, vira um monte de números em notação hexadecimal)
      /* const object = {
      name: "Guilherme",
       favoriteFood: "Pizza"
      }
      console.log(JSON.stringify(object)); //transfarma em uma string */

      var temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"; //link da imagem
      //https://openweathermap.org/weather-conditions
      //console.log(temp);
      console.log(weatherDescription);
      temp -= 273.15; //deixar a temperatura em celsius
      temp = temp.toPrecision(3); //limitar as casas decimais (precisão)
      res.write("<p>The weather is currently " +  weatherDescription + ".<p>");
      res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celsius.</h1>");
      res.write("<img src = " + imageURL + ">");
      res.send(); //só pode ter um res.send, mas pode ter vários res.write
    });
  });
  //res.send("Server is up and running.");
});

app.listen(3000, function(){
  console.log("Server is running on port 3000.");
});
