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
    ${sortParameter ? `ORDER BY ${sortMap[sortParameter]}` : '' };`

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
        res.json(reviewsData);
      }
    }
    )
});

module.exports = router;