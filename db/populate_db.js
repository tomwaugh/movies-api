const https = require('https');
const fs = require('fs');
const csv = require('fast-csv');
const { pool } = require('./db_config'); // connection to the db so we can insert parsed rows

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    deleteTempFile(dest);
    const file = fs.createWriteStream(dest, {flags: "wx"});

    // Make request and parse if successful
    const request = https.get(url, response => {
      if (response.statusCode === 200) {
        response.pipe(file);
        parse(fs.createReadStream(dest));
      } else {
        file.close();
        deleteTempFile(dest);
        reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
      }
    });

    // Handle request error
    request.on("error", err => {
      file.close();
      deleteTempFile(dest);
      reject(err.message);
    });

    // Resolve promise
    file.on("finish", () => {
      resolve();
    });

    // Handle file error
    file.on("error", err => {
      file.close();

      if (err.code === "EEXIST") {
        reject("File already exists");
      } else {
        deleteTempFile(dest);
        reject(err.message);
      }
    });
  });
};

const deleteTempFile = dest => fs.unlink(dest, () => {});

// Parse and insert row by row
const parse = (file) => {
  file.pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => insertRow(row))
    .on('end', movieCount => console.log(`Parsed ${movieCount} movies`));
};

const insertRow = (row) => {
  const values = [
    row['Film'],
    row['Genre'],
    row['Lead Studio'],
    row['Audience score %'],
    row['Profitability'],
    row['Rotten Tomatoes %'],
    row['Worldwide Gross'].replace('$', ''),
    row['Year']
  ];
  pool.query(
    'INSERT INTO movies (film, genre, lead_studio, audience_score, profitability, rotten_score, world_gross, year) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    values,
    error => (error && console.error(error)),
  );
};

download(
  'https://gist.githubusercontent.com/declanramsay/91bb2dee2fc423905628277cf8bc5ecd/raw/0c794a9717f18b094eabab2cd6a6b9a226903577/movies.csv',
  'movies.csv'
);
