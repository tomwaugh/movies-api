CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  film VARCHAR(255) NOT NULL UNIQUE,
  genre VARCHAR(255) NOT NULL,
  lead_studio VARCHAR(255) NOT NULL,
  audience_score SMALLINT NOT NULL,
  profitability NUMERIC(12, 9) NOT NULL,
  rotten_score SMALLINT NOT NULL,
  world_gross NUMERIC(6, 2) NOT NULL,
  year SMALLINT NOT NULL
);
