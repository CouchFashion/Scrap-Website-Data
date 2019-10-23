var express = require('express');
var app = express();

const puppeteer = require('puppeteer');
var HTMLParser = require('node-html-parser');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'test.csv',
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
for(var i =1;i<30;i++)
{
(async () => {
    
    try{
            var allProducts=[];
            var k = i;
            const browser = await puppeteer.launch({headless: true});
            const page = await browser.newPage();
            
            await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36');
            await page.goto('https://www.koovs.com/jarvis-service/v1/product/listing/complete?href=https%3A%2F%2Fwww.koovs.com%2Fwomen%2Fdresses%2F&page-size=36&sort=relevance&page='+k);
            var pageData = await page.content();
            console.log(pageData);
            //var trimStart = await getPosition(pageData, 'data', 2)
            var trimStart = pageData.indexOf("<pre");
            var trimEnd = pageData.indexOf("</pre>");
            console.log(trimStart,trimEnd);
            var resp = pageData.slice(trimStart+59, trimEnd);
            console.log(resp);
            jsonData = JSON.parse(resp);
            jsonData.data[0].data.forEach((data, index) => {
                
             var particularProduct = {
                     productId:data.sku,
                     productName:data.productName, 
                     productUrl:"https://www.koovs.com"+data.links[0].href.toLowerCase(),
                     imageUrl:data.imageSmallUrl.replace("search_big", "zoom"),
                     companyName:"Koovs"


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