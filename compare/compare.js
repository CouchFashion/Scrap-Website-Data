const csv = require("csvtojson");
const uid = process.env.uid;
const getRemainingInList1 = (list1,list2) => {

  let ids = {};
  list2.map(i => {
    ids[i[uid]] = true;
  });
  let newList = list1.filter(item => ids[item[uid]]);
  return newList;
}

(async () => {
  let list1 = await csv().fromFile(process.env.file1);
  let list2 = await csv().fromFile(process.env.file2);
  let newList = getRemainingInList1(list1, list2);
  if(newList.length > 0){
    let keys = Object.keys(newList[0]);
    let str = keys.reduce((str,key) => `${str},${key}`);
    console.log(str);
    for(let i=0;i<newList.length;i++){
      let item = newList[i];
      str = '';
      Object.entries(item).map( ([key, value]) => {
        str = `${str},${value}`
      })
      str = str.substring(1)
      console.log(str)
    }
  }else {
    console.log('No Data')
  }
})();