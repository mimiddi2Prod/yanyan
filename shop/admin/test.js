var jsonBigInt = require('json-bigint')
let num = 54804280202818474
// let num = 690073578176795872
let i = jsonBigInt.parse(num)

FillZero(i)

function FillZero(number, size = 14){
let str = number.toString()
if (str.length < size){
let i = size - str.length
for(var p = 0; p < i; p++){
str = '0' + str
}
}
return str
}
console.info(i)

// var JSONbigString = require('json-bigint')({"storeAsString": true});
// var withString = JSONbigString.parse(key);