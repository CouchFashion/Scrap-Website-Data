var express = require('express');
var app = express();

const puppeteer = require('puppeteer');
var HTMLParser = require('node-html-parser');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'myntrax.csv',
   append:true,
  header: [
    {id: 'productId', title: 'Product Id'},
    {id: 'productName', title: 'Product Name'},
    {id: 'productUrl', title: 'Product Url'},
    {id: 'imageUrl', title: 'Image Url'},
    {id: 'companyName', title: 'Company Name'}
 ]
});
 for(var i = 200;i<249;i++)
 { 
(async () => {
    try{
            var allProducts=[];
            var k = i*100-1;
            //var k = 0;
            const browser = await puppeteer.launch({headless: true});
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36');
            
            await page.goto('https://www.myntra.com/web/v1/search/dresses-and-jumpsuits?f=Categories%3ADresses&rows=100&o='+k);
            //console.log(await page.content());
            var pageData = await page.content();
            var trimStart = pageData.indexOf("<pre");
            var trimEnd = pageData.indexOf("</pre>");
            //console.log(trimStart,trimEnd);
            var resp = pageData.slice(trimStart+59, trimEnd);
            if (/^[\],:{}\s]*$/.test(resp.replace(/\\["\\\/bfnrtu]/g, '@').
                    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                        var jsonData = JSON.parse(resp);
                        //console.log(jsonData.products)
                        
                        jsonData.products.forEach((data, index) => {
                            
                            var particularProduct = {
                                 productId:data.productId,
                                 productName:data.product, 
                                 productUrl:"www.myntra.com/"+data.landingPageUrl.toLowerCase(),
                                 imageUrl:data.searchImage, 
                                 companyName:"Myntra"
                            };
            
                                 allProducts.push(particularProduct);
                        });

                    }else{

                                console.log(resp)

                    }
            //console.log(resp)
            
            // var root = HTMLParser.parse(getPage);
            // console.log(root.querySelector("pre"));
            await browser.close();

            //console.log(allProducts);

            csvWriter  
                .writeRecords(allProducts)
                .then(()=>{ 

                    console.log('The CSV file was written successfully')
        });
        }
        catch(e){
            console.log(e)
        }


    })();
 }
app.get('/', function(req, res){
   res.send("Hello world!");
});
app.listen(3001);