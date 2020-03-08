# Movie api backend test

## Process and choices

My plan was to build in this order:
- Setup the project with what I thought I'd need (node, express, babel, eslint, yarn, scripts)
- Handle the database connection and provisioning from the gist
- Setup the endpoint
- Setup and handle deployment to heroku
- Add jest and a few basic tests

On reflection, I probably could've got away without using babel and nodemon.


I decided to build a script to download the gist and populate the database from that.
It depends how this api is going to be used but this might've been overkill since
with a relatively small dataset like this it could be handled more manually.
It could come in handy if the gist would regularly change although the script
doesn't handle updating at the moment (only inserting).

API is currently completely open with no restrictions on access or rate limiting.

## Challenges

- Uncertainty on how that gist would be used/updated makes it hard to design a process to keep our indexed db fresh.
- A few duplicates in the gist but can be handled with unique restraint on film in the database.
- Working directly with sql and postgres is a pain and would be difficult if this scaled.
Just in creating this I came across some limitations with the way node-postgres handles parameterisation.
Would use an ORM ideally.
