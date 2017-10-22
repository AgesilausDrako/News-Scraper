# News-Scraper

## Demonstration on Heroku
A fully functional version of this application can be viewed at: [link to Demonstration!](https://arcane-tor-32857.herokuapp.com/)

## Description
 News-Scraper is a full stack web application, utilizing jQuery, AJAX, a node.js environment, Express.js server, and MongoDB to scrape the Russian BBC website and store the day's top articles' title, link to the full article, and a short summary of the article. This application also allows the user to save articles for later or delete articles from both the articles and saved articles pages. In addition, the user is also able to submit notes to each article and save/delete them when desired.

 ## Important Details
This application requires node.js so please be sure to have that installed or it will not work.
Before running the application it is necessary to navigate to the folder containing all of the application files and run the following command in the terminal: **npm install**
This will install all the packages and their necessary versions according to the package.json file.

## Utilization
In order to run News-Scraper the user will need to: 
1. Download the files and start a MongoDB server. **Be sure that you have MongoDB installed on your machine** This can be done by opening two terminals and entered **mongod** in one terminal and **mongo** in the other.
2. Navigate to the folder containing the files and type in either **npm start**.
3. Go to localhost:3000 in your browser. (Google Chrome is the preferred browser for this application)
4. Click on "Get Articles" button.
5. Read through the articles and save/delete them as desired.
6. Add notes if necessary.

## Note
The user will need to know Russian in order to benefit fully from this site.
