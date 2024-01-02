# Project 3 – Group 2: Interactive dashboard ECO-POP to explore and analyse Census and GDP data
The aim of our project is to explore the relationship between a country's economic prosperity and the population's health and wellbeing indicators. We will examime the relationships between GPD, population, 
health of population and fertility dates around the world. Out hypothesis is there is a positive correlation between economic prosperity and health and wellbring.
The project team has created and interactive dashboard to allow users to explore census and GPD data.

## How to run the interactive site
- Clone repo: https://github.com/thecodingshiba/p3-app
- Create a new file named secret_key.py and paste in the password submitted via the Monash Submission Portal
- Launch a virtual environment
- Run app_solutions.py to reach the website

## Interactive Website Summary
1) Country Visualization
- To study the economic Vs the population indicators for two countries simultaneously
- To study the rankings of the countries for various indicators
2) Sub-region Visualization
- To study the economic Vs the population indicators for subregions
3) Geographical Visualization
- To understand geographic locations of different countries for comparative population analysis

## Limitations
- The census data covers the period of 1960 - 2021.
- During the data cleaning process, smaller countries which had did not have conistent GDP and population data for every year was dropped form the set presented
- For ease of navigation, specific sets of certain of health data was selected for the drop down options

## Data Sources
- Population data United Nations Data Portal Population Division <https://population.un.org/wpp/Download/Standard/MostUsed/>
- GDP from World Bank data <https://data.worldbank.org/indicator/NY.GDP.MKTP.PP.CD?end=2022&start=1990&view=chart>
- lat & long data from Developers Dataset <https://developers.google.com/public-data/docs/canonical/countries_csv>
- Js Library list <https://kinsta.com/blog/javascript-libraries/>

## Tools
- Python Flask-powered API
- HTML/CSS
- JavaScript
- Neon has been used to manage the serverless PostgreSQL
- pgAdmin has been adopted as ther open ciurse management tool for this project

## Contributors
- Abhidnya Thakur
- Bich Jennings
- Duc Trieu Pham
- Yared Haile

