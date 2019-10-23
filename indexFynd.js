var express = require('express');
var app = express();
const puppeteer = require('puppeteer');
var request = require('request');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'fynd.csv',
  append:true,
  header: [
    {id: 'productId', title: 'Product Id'},
    {id: 'productName', title: 'Product Name'},
    {id: 'productUrl', title: 'Product Url'},
    {id: 'imageUrl', title: 'Image Url'},
    {id: 'companyName', title: 'Company Name'}
    
  ]
});
 for(var i = 150;i<172;i++)
 {
(async () => {
    
try{
    var allProducts=[];
    request.post({
        headers:{
            'content-type' : 'application/json'
        },
        url:'https://api.fynd.com/orbis/api/v3/unsullied/product-list/?page_size=20&page='+i,
        body:
        JSON.stringify({
            "url":"https://www.fynd.com/women/clothing/dresses-jumpsuits?page="+i+"&page_size=20"
        })
              
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
           //console.log(body);
            var data = JSON.parse(body);
            console.log(data.groups);
        data.groups.forEach((data, index) => {
            
            data.value.items.forEach((item)=>{
                var particularProduct = {
                    productId:item.id,
                    productName:item.name, 
                    productUrl:"https://www.fynd.com/"+item.product_slug+".html",
                    imageUrl:item.image.url.replace("/135x0/","/540x0/"), 
                    companyName:"FYND"
               };
               allProducts.push(particularProduct);
            })
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
app.listen(3001);