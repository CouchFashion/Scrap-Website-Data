var express = require('express');
var app = express();
const puppeteer = require('puppeteer');
var request = require('request');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'tatacliq.csv',
  append:true,
  header: [
    {id: 'productId', title: 'Product Id'},
    {id: 'productName', title: 'Product Name'},
    {id: 'productUrl', title: 'Product Url'},
    {id: 'imageUrl', title: 'Image Url'},
    {id: 'companyName', title: 'Company Name'}
    
  ]
});
  for(var i = 137;i<138;i++)
{

(async () => {
    
try{
    var allProducts=[];
    request('https://www.tataque.com/marketplacewebservices/v2/mpl/products/searchProducts/?searchText=%3Arelevance%3Acategory%3AMSH1016100%3AinStockFlag%3Atrue&isKeywordRedirect=false&isKeywordRedirectEnabled=true&isTextSearch=false&isFilter=false&page='+i+'&isPwa=true&pageSize=40&typeID=all', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
          var data = JSON.parse(body);
          console.log(data.searchresult);
          data.searchresult.forEach((data, index) => {
                
          var particularProduct = {
                 productId:data.productId,
                 productName:data.productname, 
                 productUrl:"https://www.tatacliq.com"+data.webURL,
                 imageUrl:"https:"+data.imageURL, 
                 companyName:"Tata Cliq"
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