var express = require('express');
var app = express();
const puppeteer = require('puppeteer');
var request = require('request');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'nnnow.csv',
  append:true,
  header: [
    {id: 'productId', title: 'Product Id'},
    {id: 'productName', title: 'Product Name'},
    {id: 'productUrl', title: 'Product Url'},
    {id: 'imageUrl', title: 'Image Url'},
    {id: 'companyName', title: 'Company Name'}
    
  ]
});
 for(var i = 2;i<32;i++)
 {
(async () => {
    
try{
    var allProducts=[];
    request.post({
        headers:{
            'content-type' : 'application/json',
            'bbversion':'v2',
            'clientSessionId':'1563349501105',
            'correlationId':'5028962d-b894-4504-9df6-8f7b00cbf490',
            'module':'odin'
        },
        url:'https://api.nnnow.com/d/apiV2/listing/products',
        body:
        JSON.stringify({
            "deeplinkurl": "/women-dresses-and-jumpsuits?p="+i+"&category=Dresses&cid=tn_women_dresses_and_jumpsuits"
        })
              
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
           //console.log(body);
       var data = JSON.parse(body);
        console.log(data.data.styles.styleList);
        data.data.styles.styleList.forEach((data, index) => {
                
          var particularProduct = {
                 productId:data.id,
                 productName:data.name, 
                 productUrl:"https://www.nnnow.com"+data.url,
                 imageUrl:data.imagePath, 
                 companyName:"NNNOW"
            };
             allProducts.push(particularProduct);
            });
          csvWriter  
                .writeRecords(allProducts)
                .then(()=> console.log('The CSV file was written successfully'));
          // Show the HTML for the Google homepage.
     } else {
           console.log(error);
     }
     });

            
        }
        catch(e){
            console.log(e)
        }


    })();
 }
app.listen(3000);