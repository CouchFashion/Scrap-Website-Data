var express = require('express');
var app = express();
var request = require('request');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'myntraNew.csv',
  //append:true,
  header: [
    {id: 'productId', title: 'Product Id'},
    {id: 'productName', title: 'Product Name'},
    {id: 'productUrl', title: 'Product Url'},
    {id: 'imageUrl', title: 'Image Url'},
    {id: 'companyName', title: 'Company Name'}
    
  ]
});
for(var i = 0;i < 1;i++)
{
(async () => {
    
try{
    var k = i;
    var allProducts=[];
    request('https://www.myntra.com/web/v1/search/dresses-and-jumpsuits?f=Categories%3ADresses&rows=100&o='+k, function (error, response, body) {
  
          console.log(body);

          var data = JSON.parse(body);
          console.log(data);
          data.products.forEach((data, index) => {
                
            var particularProduct = {
                productId:data.productId,
                productName:data.product, 
                productUrl:"www.myntra.com/"+data.landingPageUrl.toLowerCase(),
                imageUrl:data.searchImage, 
                companyName:"Myntra"
           };
             allProducts.push(particularProduct);
            });
          csvWriter  
                .writeRecords(allProducts)
                .then(()=> console.log('The CSV file was written successfully'));
          // Show the HTML for the Google homepage.
     
      });

            
        }
        catch(e){
            console.log(e)
        }


    })();
 }
app.listen(3000);


    //   var url = "https://www.myntra.com/web/v1/search/dresses-for-women?p=4&rows=50&o=149";
    //  const digest = md5(url);

    //     exec(`curl ${url}`, (stderr, body) => {
    //         if (body) {
            
    //                 var data = JSON.parse(body);
    //                 console.log(data);
    //                 // data.products.forEach((data, index) => {
                          
    //                 //   var particularProduct = {
    //                 //       productId:data.productId,
    //                 //       productName:data.product, 
    //                 //       productUrl:"www.myntra.com/"+data.landingPageUrl.toLowerCase(),
    //                 //       imageUrl:data.searchImage, 
    //                 //       companyName:"Myntra"
    //                 //  };
    //                 //    allProducts.push(particularProduct);
    //                 //   });
    //                 // csvWriter  
    //                 //       .writeRecords(allProducts)
    //                 //       .then(()=> console.log('The CSV file was written successfully'));
                   
    //         }
    //         else{
    //           console.log("No data");
    //         }
    //     })