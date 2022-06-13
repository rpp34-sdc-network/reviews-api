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

const sortMap = {
  newest: 'r.date DESC',
  helpful: 'r.helpfulness DESC',
  relevant: 'r.helpfulness DESC, r.date DESC'
};

router.get('/', (req, res) => {
  const productId = req.query.product_id;
  const count = req.query.count || 5;
  const page = req.query.page || 1;
  const sortParameter = req.query.sort;

  const sqlQuery =
    `SELECT r.id AS review_id, r.rating, r.summary, r.recommend, r.response, r.body, to_timestamp(r.date / 1000)::date as date, r.reviewer_name, r.helpfulness,
      CASE WHEN count(photo.photo_url) = 0 THEN ARRAY[]::json[] ELSE array_agg(json_build_object('id', photo.id, 'url', trim('"' from photo.photo_url))) END AS photos
    FROM review r
      FULL OUTER JOIN photo
        ON r.id = photo.review_id
    WHERE r.product_id = ${productId} AND r.reported = false
    GROUP BY r.id
    ${sortParameter ? `ORDER BY ${sortMap[sortParameter]}` : '' }
    ${`LIMIT ${count}`} ${`OFFSET ${count * (page - 1)}`};`

  client.query(sqlQuery, (err, data) => {
      if (err) {
        res.status(500).json(err);
      } else {
        const reviewsData = {
          product: productId,
          page: page,
          count: count
        }
        const results = data.rows;
        reviewsData['results'] = results;
        res.json(reviewsData);
      }
    })
});

router.get('/meta', (req, res) => {
  const productId = req.query.product_id;
  const ratingsSqlQuery = `SELECT r.rating, r.id FROM review AS r WHERE product_id = ${productId} AND r.reported = false;`;
  client.query(ratingsSqlQuery, (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      const ratingsData = data.rows;
      const ratings = ratingsData.reduce((acc, cur) => {
        acc[cur.rating] = acc[cur.rating] ? acc[cur.rating] + 1 : 1;
        return acc;
      }, {});

      const stringifiedRatings = {};
      for (let key in ratings) {
        stringifiedRatings[key] = ratings[key].toString();
      };
      const recommendedSqlQuery = `SELECT r.recommend, r.id FROM review AS r WHERE product_id = ${productId} AND r.reported = false;`;
      client.query(recommendedSqlQuery, (err, data) => {
        if (err) {
          res.status(500).json(err);
        } else {
          const recommendedData = data.rows;
          const recommended = recommendedData.reduce((acc, cur) => {
            acc[cur.recommend] = acc[cur.recommend] ? acc[cur.recommend] + 1 : 1;
            return acc;
          }, {});
          const characteristicsSqlQuery = `select AVG(cr.value) as value, c.name, c.id from characteristic c full outer join characteristic_reviews cr on c.id = cr.characteristic_id where c.product_id = ${productId} group by c.name, c.id;`;
          client.query(characteristicsSqlQuery, (err, data) => {
            if (err) {
              res.status(500).json(err);
            } else {
              const characteristicsData = data.rows;
              const characteristics = characteristicsData.reduce((acc, cur) => {
                acc[cur.name] = {'id': cur.id, 'value': cur.value}
                return acc;
              }, {});
              const productMetadata = {
                product_id: productId,
                ratings: stringifiedRatings,
                recommended,
                characteristics
              };
              res.json(productMetadata);
            }
          })
        }
      })
    }
  })
});

module.exports = router;


