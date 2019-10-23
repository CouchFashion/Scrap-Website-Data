var express = require('express');
var app = express();
const puppeteer = require('puppeteer');
var request = require('request');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'stalkbuylove.csv',
  append:true,
  header: [
    {id: 'productId', title: 'Product Id'},
    {id: 'productName', title: 'Product Name'},
    {id: 'productUrl', title: 'Product Url'},
    {id: 'imageUrl', title: 'Image Url'},
    {id: 'companyName', title: 'Company Name'}
    
  ]
});
  for(var i = 2;i<11;i++)
{
(async () => {
    
try{
    var allProducts=[];
    request.post('https://api.stalkbuylove.com/api/v/2/catalog/search/category?category_id=11&page='+i, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var data = JSON.parse(body);
          console.log(JSON.parse(body));
          data.data.products.forEach((data, index) => {
                
          var particularProduct = {
                 productId:data.product_id,
                 productName:data.name, 
                 productUrl:data.url_path,
                 imageUrl:data.list_image, 
                 companyName:"Stalk Buy Love"
            };
             allProducts.push(particularProduct);
            });
          csvWriter  
                .writeRecords(allProducts)
                .then(()=> console.log('The CSV file was written successfully'));
          // Show the HTML for the Google homepage.
        } else {
          console.warn(error);
        }
      });

            
        }
        catch(e){
            console.log(e)
        }


    })();
 }
app.listen(3000);