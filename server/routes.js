const express = require('express');
const router = express.Router();
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: process.env.DB_PASSWORD,
  port: 5432,
  database: 'postgres'
});

client.connect();

router.get('/:id', (req, res) => {
  const productId = req.params.id;
  // const sqlQuery = `select r.id as review_id, r.rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness, array_agg(photo.photo_url) as photos from review r full outer join photo on r.id = photo.review_id where r.product_id = ${productId} and r.reported = false group by r.id;`
  // const sqlQuery = `select r.id as review_id, r.rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness, photo.id as photo_id, photo.photo_url from review r full outer join photo on r.id = photo.review_id where r.product_id = ${productId} and r.reported = false;`
  const sqlQuery = `SELECT r.id AS review_id, r.rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness, CASE WHEN count(photo.photo_url) = 0 THEN ARRAY[]::json[] ELSE array_agg(json_build_object('id', photo.id, 'url', trim('"' from photo.photo_url))) END AS photos FROM review r FULL OUTER JOIN photo ON r.id = photo.review_id WHERE r.product_id = ${productId} AND r.reported = false GROUP BY r.id;`
  client.query(sqlQuery, (err, data) => {
      if (err) {
        res.status(500).json(err);
      } else {
        const reviewsData = {
          product: productId,
          page: 0,
          count: 5
        }
        const results = data.rows;
        reviewsData['results'] = results;
        // const photoData = {};
        // results.forEach((result, index) => {
        //   if (!photoData[result.review_id]) {
        //     photoData[result.review_id] =
        //   }
        // })
        // const reviews = {
        //   product: productId,
        //   results: []
        // };
        // results.forEach(result => {

        // })
        res.json(reviewsData);
      }
    }
    )
  // send first 5 reviews
  // if count param passed in, return that many reviews
  // sort reviews by 'newest', 'helpful', or 'relevant'

  // EXAMPLE OUTPUT

  // {
  //   "product": "2",
  //   "page": 0,
  //   "count": 5,
  //   "results": [
  //     {
  //       "review_id": 5,
  //       "rating": 3,
  //       "summary": "I'm enjoying wearing these shades",
  //       "recommend": false,
  //       "response": null,
  //       "body": "Comfortable and practical.",
  //       "date": "2019-04-14T00:00:00.000Z",
  //       "reviewer_name": "shortandsweeet",
  //       "helpfulness": 5,
  //       "photos": [{
  //           "id": 1,
  //           "url": "urlplaceholder/review_5_photo_number_1.jpg"
  //         },
  //         {
  //           "id": 2,
  //           "url": "urlplaceholder/review_5_photo_number_2.jpg"
  //         },
  //         // ...
  //       ]
  //     },
  //     {
  //       "review_id": 3,
  //       "rating": 4,
  //       "summary": "I am liking these glasses",
  //       "recommend": false,
  //       "response": "Glad you're enjoying the product!",
  //       "body": "They are very dark. But that's good because I'm in very sunny spots",
  //       "date": "2019-06-23T00:00:00.000Z",
  //       "reviewer_name": "bigbrotherbenjamin",
  //       "helpfulness": 5,
  //       "photos": [],
  //     },
  //     // ...
  //   ]
  // }
});

module.exports = router;