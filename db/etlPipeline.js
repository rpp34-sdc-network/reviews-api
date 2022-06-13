const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const format = require('pg-format');
const es = require('event-stream');
require('dotenv').config();

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: process.env.DB_PASSWORD,
  port: 5432,
  database: 'postgres'
});

client.connect();


// TABLE characteristic
// async function addCharacteristicDataAsync(data) {
//     await client.query(format('INSERT INTO characteristic(id, product_id, name) VALUES %L', data));
// }

// let characteristicResults = [];

// fs.createReadStream('/Users/dereksouthard/Downloads/characteristics.csv')
//   .pipe(parse({ delimeter: ',', from_line: 1 }))
//   .on('data', (row) => {
//     characteristicResults.push(row);
//     if (characteristicResults.length === 100) {
//       addCharacteristicDataAsync(characteristicResults);
//       characteristicResults = [];
//     }
//   })
//   .on('end', () => {
//     addCharacteristicDataAsync(characteristicResults);
//     characteristicResults = [];
//     console.log('done!');
//   })
//   .on('error', (err) => {
//     console.log('an error occured: ', err);
//   });


// TABLE reviews
// async function addReviewsDataAsync(data) {
//   await client.query(format('INSERT INTO review(id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness) VALUES %L', data));
// }

// let reviewsResults = [];

// fs.createReadStream('/Users/dereksouthard/Downloads/reviews.csv')
// .pipe(parse({ delimeter: ',', from_line: 1 }))
// .on('data', (row) => {
//   reviewsResults.push(row);
//   if (reviewsResults.length === 500) {
//     addReviewsDataAsync(reviewsResults);
//     reviewsResults = [];
//   }
// })
// .on('end', () => {
//   addReviewsDataAsync(reviewsResults);
//   reviewsResults = [];
//   console.log('done!');
// })
// .on('error', (err) => {
//   console.log('an error occured: ', err);
// });


// async function addDataAsync(data, tableName, columnHeaders) {
//   await client.query(format(`INSERT INTO ${tableName} (${[...columnHeaders]}) VALUES %L`, data));
// }


// const addCsvDataToDb = (filename, tableName, columnHeaders) => {

//   let tempStorage = [];

//   fs.createReadStream(`/Users/dereksouthard/Downloads/${filename}`)
//     .pipe(es.split())
//     .pipe(es.map(function(row, cb) {
//       tempStorage.push(row.split(','));
//       if (tempStorage.length === 1000) {
//         addDataAsync(tempStorage, tableName, columnHeaders);
//         tempStorage = [];
//       }
//       cb(null, row);
//     }))
//     .on('end', () => {
//       addDataAsync(tempStorage, tableName, columnHeaders);
//       tempStorage = [];
//       console.log('done!');
//     })
//     .on('error', (err) => {
//       console.log('an error occured: ', err);
//     });
// }


// addCsvDataToDb('reviews.csv', 'review', ['id',  'product_id', 'rating', 'date', 'summary', 'body', 'recommend', 'reported', 'reviewer_name', 'reviewer_email', 'response', 'helpfulness']);
// addCsvDataToDb('reviews_photos.csv', 'photo', ['id', 'review_id', 'photo_url']);
// addCsvDataToDb('characteristic_reviews.csv', 'characteristic_reviews', ['id', 'characteristic_id', 'review_id', 'value']);
// addCsvDataToDb('characteristics.csv', 'characteristic', ['id', 'product_id', 'name']);

// Client.disconnect();

