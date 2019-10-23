const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'newestMyntraFor2k.csv',
  append:true,
  header: [
    {id: 'productId', title: 'Product Id'},
    {id: 'productUrl', title: 'Product Url'},
    {id: 'imageUrl', title: 'Image Url'},
    
  ]
});
const product = [];
const allProducts= [];
const id = [];
fs.createReadStream('newMyntraFor2k.csv')
  .pipe(csv())
  .on('data', (row) => {
  
    product.push(row);
  })
  .on('end', () => {
    console.log(product);

    fs.createReadStream('dupId.csv')
        .pipe(csv())
        .on('data', (row) => {
        
            id.push(Number(row.Product_Id));
        })
        .on('end', () => {
            console.log(id);
            id.map((x)=>{

                    const found = product.some(pro => {
                        if(Number(pro.Product_Id)=== x)
                        {
                                console.log(pro);
                                var particularProduct = {
                                    productId:pro.Product_Id,
                                    productUrl:pro.Product_Url,
                                    imageUrl:pro.Image_Url
                            };
                             allProducts.push(particularProduct);
                            return pro;
                        }
                        return false;
                    });
               
                    console.log(found);
               
            })
            console.log('Id successfully processed');
            csvWriter  
            .writeRecords(allProducts)
            .then(()=> console.log('The CSV file was written successfully'));
        });

    console.log('CSV file successfully processed');
  });