var express = require('express');
var app = express();

const puppeteer = require('puppeteer');
var HTMLParser = require('node-html-parser');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'paytm.csv',
  append:true, 
  header: [
    {id: 'productId', title: 'Product Id'},
    {id: 'productName', title: 'Product Name'},
    {id: 'productUrl', title: 'Product Url'},
    {id: 'imageUrl', title: 'Image Url'},
    {id: 'companyName', title: 'Company Name'},
  ]
});

function getPosition(string, subString, index) {
   return new Promise(resolve => {
     resolve(string.split(subString, index).join(subString).length)
   }) 
  }
for(var i =180;i<201;i++)
{
(async () => {
    
    try{
            var allProducts=[];
            var k = i;
            const browser = await puppeteer.launch({headless: true});
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36');
            await page.goto('https://middleware.paytmmall.com/women-western-cloth-dresses-glpid-5233?channel=web&child_site_id=6&site_id=2&version=2&use_mw=1&src=store&page='+k+'&page_count='+k+'&items_per_page=32');
            var pageData = await page.content();
            //console.log(pageData);
            //var trimStart = await getPosition(pageData, 'data', 2)
            var trimStart = pageData.indexOf("<pre");
            var trimEnd = pageData.indexOf("</pre>");
            //console.log(trimStart,trimEnd);
            var resp = pageData.slice(trimStart+59, trimEnd);
            jsonData = JSON.parse(resp);
            //console.log(jsonData.grid_layout);
            console.log(k);
            jsonData.grid_layout.forEach((data, index) => {
                
             var particularProduct = {
                     productId:data.product_id,
                     productName:data.name, 
                     productUrl:data.newurl.replace("https://catalog.paytm.com/","https://paytmmall.com/"),
                     imageUrl:data.image_url,
                     companyName:"Paytm"


                };
                 allProducts.push(particularProduct);
            });
            await browser.close();

            console.log(allProducts);

            csvWriter  
                .writeRecords(allProducts)
                .then(()=> console.log('The CSV file was written successfully'));
        }
        catch(e){
            console.log(e)
        }


    })();
 }
app.get('/', function(req, res){
   res.send("Hello world!");
});
app.listen(3000);