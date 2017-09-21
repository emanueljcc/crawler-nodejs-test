'use strict'

const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
const fs = require('fs');

/**
 
  Link original http://www.odeonstar.com.au/session-times/ pero esta 403
  
  En este otro Link que aparece en la pagina principal ofrecen los mismos datos a usar 
  https://ticketing.oz.veezi.com/sessions/?siteToken=hrqx63mdmcnrd0x03w95trdshr

**/

request("https://ticketing.oz.veezi.com/sessions/?siteToken=hrqx63mdmcnrd0x03w95trdshr", (error, response, body) => {
  
  if(!error && response.statusCode==200) {  

    var $ = cheerio.load(body);
    var arr = [];
    
    $('#sessionsByFilmConent .film').each(function(index) {
      
      var titulo, fecha, horas;
      var json = {titulo: ""};

      titulo = $(this).find('h3.title').text().trim();
      json.titulo = titulo;

      var fechaArr = [];
      var divSessions = $(this).find('.sessions').html();
      
      $(divSessions).each(function(index) {
        
        fecha = $(this).find('.date-container h4').html();
        var json = { 
              titulo: titulo,
              sessions : []
            };
        if (fecha != null) {
          var horas = $(this).find('.date-container ul').html();
          var horasFinal,dateTime;
          var horasArr = [];
          $(horas).each(function(index) {
            horasFinal = $(this).find('time').html();
            if (horasFinal != null){
              var formato =`${fecha} ${horasFinal}`;
              dateTime = moment(formato).format("YYYY-MM-DD HH:mm");
              horasArr.push(dateTime);
              json.sessions = horasArr;
            }

          });
          arr.push(json);
          console.log(arr);
          fs.writeFile('file.json', JSON.stringify(arr,null,2), function(err){
            console.log('Archivo .json creado...');
          })

        }

      });

    });

  }
});