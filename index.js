const fs = require('fs'); 
const puppeteer = require('puppeteer');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'NEW.csv',
    append: true,
    header: [
        { id: 'productId', title: 'Product Id' },
        { id: 'category', title: 'Category' },
        { id: 'default', title: 'Default Url' },
        { id: 'search', title: 'Search Url' },
        { id: 'top', title: 'Top Url' },
        { id: 'back', title: 'Back Url' },
        { id: 'right', title: 'Right Url' },
        { id: 'front', title: 'Front Url' },
        { id: 'left', title: 'Left Url' },
        { id: 'productName', title: 'Product Name' },
    ]
});
  let doneCount = 0
  let totalCount = 505
  let setIntervalId = setInterval(() => {
    if (doneCount < totalCount) {
        let offset = 0
        if(doneCount != 0){
            offset = (doneCount*50)-1
        }
        getMyntraData(doneCount+1,offset)
        doneCount++;
    } else {
      console.log("exiting")
      clearInterval(setIntervalId)
    }
  }, 2000);
const getMyntraData = async (i,offset) => {
        try {
            let allProducts = [];          
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36');
            await page.goto("https://www.myntra.com/web/v2/search/western-wear-dresses-menu?f=Categories%3ADresses&p="+i+"&rows=50&o="+offset);
            let pageData = await page.content();
            let trimStart = pageData.indexOf("<pre");
            let trimEnd = pageData.indexOf("</pre>");
            let resp = pageData.slice(trimStart + 59, trimEnd);
            if (/^[\],:{}\s]*$/.test(resp.replace(/\\["\\\/bfnrtu]/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                let jsonData = JSON.parse(resp);
                jsonData.products.forEach((data) => {
                    let particularProduct = {
                        productId: data.productId,
                        category: data.category,
                    };
                    data.images.forEach((img) => {
                        particularProduct[img.view] = img.src
                    })
                    particularProduct.productName = data.product,
                    allProducts.push(particularProduct);
                });

            } else {
                console.log(e)
                console.log('The CSV file was not written successfully for page '+i)
                fs.appendFile("err.txt", "Page no is "+ i+"\n", (err) => { 
                    if (err) { 
                      console.log(err); 
                    } 
                    console.log("Written successfully")
                  });
            }
            await browser.close();
            csvWriter
                .writeRecords(allProducts)
                .then(() => {
                    console.log('The CSV file was written successfully for page '+i)
                });
        }
        catch (e) {
            console.log(e)
            console.log('The CSV file was not written successfully for page '+i)
            fs.appendFile("err.txt", "Page no is "+ i+"\n", (err) => { 
                if (err) { 
                  console.log(err); 
                } 
                console.log("Written successfully")
              });
        }

    }