-- CREATE TABLE review(
--   id SERIAL PRIMARY KEY,        --
--   product_id INT,               --
--   rating INT,                   --
--   "date" BIGINT,                --
--   summary VARCHAR(255),         --
--   body TEXT,                    --
--   recommend BOOLEAN,            --
--   reported BOOLEAN,             --
--   reviewer_name VARCHAR(100),   --
--   reviewer_email VARCHAR(100),
--   response TEXT,                --
--   helpfulness INT               --
-- );

-- CREATE TABLE photo(
--   id SERIAL PRIMARY KEY,
--   review_id INT,
--   photo_url VARCHAR(255),
--   CONSTRAINT fk_review
--     FOREIGN KEY(review_id)
--       REFERENCES review(id)
-- );

CREATE TABLE characteristic(
  id SERIAL PRIMARY KEY,
  product_id INT,
  name VARCHAR(25)
);

-- CREATE TABLE characteristic_reviews(
--   id SERIAL PRIMARY KEY,
--   characteristic_id INT,
--   review_id INT,
--   value INT,
--   FOREIGN KEY (characteristic_id) REFERENCES characteristic (id),
--   FOREIGN KEY (review_id) REFERENCES review (id)
-- );