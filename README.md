### Important setup instructions

Make sure to create .env.development & .env.test files containing 'PGDATABASE=<your-database-name>'. (default in this folder is 'nc_games(\_test)')

Along with this run:

```bash
npm install
```

This folder should also contain a file called 'Husky' for creating errorless pushes, if for any reason husky refuses to be a good boy please run:

```bash
npx husky-init && npm install
```

The current repo set up is made to work on Heroku, a platform as a service (PaaS) that will soon lose it's free status in the upcoming months, because of this some alternative hosting will be needed in the future.

The backend Api is currently here with a list of endpoints but may move in the future if/when heroku changes their buisness model.
https://nc-games-site.herokuapp.com/

### NC Games - back end tests and hosting.

You must fork this repository and host it using the procedures below in order to utilise this API for your front-end project.

## Hosting a PSQL DB using Heroku

Heroku is used to host a PSQL database.
Heroku is configured to host this repository. To set up your own working clone of the api, follow the procedures listed below.

## Step 1. installing the Heroku CLI

If you haven't previously, install the Heroku cli.

```bash
npm i heroku -g
```

## Step 2. Creating an Heroku App

Log into Heroku using their command line interface:

```bash
heroku login
```

Cd into the new directory after cloning your fork of this repository. From there, use the cli to create an app on Heroku.

```bash
heroku create your-app-name
```

Here `your-app-name` should be the name you want to give your application. You will receive a random app name if you don't provide one, and these can occasionally be confusing to work with.

This command will also create an app on Heroku and in your account. Your local git repository will gain a new "remote" as a result.
You can double check this by looking at your git remotes:

```bash
git remote -v
```

## Step 3. Pushing Your code up to your Heroku remote

```bash
git push heroku main
```

You will have to make sure that the current branch you want to push is set to 'main' as any others will not work with heroku

## Step 4. Creating a Hosted Database

Log in on the heroku website (https://id.heroku.com/login)

- Select your application

- `Configure Add-ons`

- Choose `Heroku Postgres`

For our needs, the free tier will be adequate. You will receive a pre-made "postgreSQL" database as a result.

Verify the database's existence. View the credentials by selecting "settings" from the menu. Pay attention to the URI. Leave this window open!

## Step 5. Seed the Production Database with your data

Check that your database's url is added to the environment variables on Heroku:

```bash
heroku config:get DATABASE_URL
```

If the database is correctly linked as an add-on to Heroku while you are in the directory for your app, it should display a DB URI string that is identical to the one in your credentials.

Make sure to **run the seed prod script** from your `package.json`:

```bash
npm run seed:prod
```

## Step 6. Viewing Your App

```bash
heroku open
```

If heroku fails to open a webpage due to vs code preferences instead go to the url link provided in the terminal or go to your app hosted on the Heroku website to see it working.

Any issues should be debugged with:

```bash
heroku logs --tail
```

Something to remember is that any debug logs for your heroku api are stored on heroku meaning that you could see old errors that are no longer relevant.
