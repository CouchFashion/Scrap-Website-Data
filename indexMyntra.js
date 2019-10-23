var express = require('express');
var app = express();
const puppeteer = require('puppeteer');
var MongoClient = require('mongodb').MongoClient;
const Config= {
  mongoConfig: {
      DB_NAME : "selectedimagedb",
      URI: "mongodb://localhost:27017/"
  }
}

const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'myntraFor24k.csv',
  append:true,
  header: [
    {id: 'productId', title: 'Product Id'},
    {id: 'productName', title: 'Product Name'},
    {id: 'productUrl', title: 'Product Url'},
    {id: 'imagesUrl', title: 'Image Url'}
    
  ]
});
async function getData(db)
{ 
  for(var i = 260;i < 265;i++)
  {
  (async () => {
      
  try{
      var allProducts=[];
      var k = i*99;
      const browser = await puppeteer.launch({headless: true},{
        args: [
          '--incognito',
        ],
      });
      
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36');
      // await page.goto('https://www.myntra.com/web/v1/search/dresses-for-women?rows=100&o='+k);
      await page.goto('https://www.myntra.com/web/v1/search/dresses-and-jumpsuits?rows=100&o='+k);
      var pageData = await page.content();
      console.log(k);
      var trimStart = pageData.indexOf("<pre");
      var trimEnd = pageData.indexOf("</pre>");
      var resp = pageData.slice(trimStart+59, trimEnd);
      var data = JSON.parse(resp);
    
      data.products.forEach((data, index) => {
          var particularProduct = {
              productId:data.productId,
              productName:data.product, 
              productUrl:"www.myntra.com/"+data.landingPageUrl.toLowerCase(),
              imagesUrl:data.images
        };

        db.collection('myntra_products').insertOne(particularProduct, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
 
        });
          allProducts.push(particularProduct);
      });
      
        await browser.close();

      // csvWriter  
      //     .writeRecords(allProducts)
      //     .then(()=> console.log('The CSV file was written successfully'));
    
          }
          catch(e){
            // csvWriter  
            // .writeRecords(data)
            // .then(()=> console.log('The CSV file was written successfully'));
              console.log(e)
          }


      })();
  }
}

 async function quickstart() {

  let dbObject = await getMongoDB();
  await getData(dbObject).then(res => console.log("Done Processing"));
  
  }

 function getMongoDB() {
  try {
      return new Promise((resolve, reject) => {
          MongoClient.connect(Config.mongoConfig.URI, function (err, db) {
              if (err) {
                  reject(err);
              }
              var dbo = db.db(Config.mongoConfig.DB_NAME);
              resolve(dbo);
          })
      });
  }
  catch (e) {
      console.log(e);
  }

}
quickstart();
app.listen(3000);