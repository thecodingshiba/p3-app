# Project 3 – Group 2: Interactive dashboard ECO-POP to explore and analyse Census and GDP data
The aim of our project is to explore the relationship between a country's economic prosperity and the population's health and wellbeing indicators. We will examime the relationships between GPD, population, 
health of population and fertility dates around the world. Out hypothesis is there is a positive correlation between economic prosperity and health and wellbring.
The project team has created and interactive dashboard to allow users to explore census and GPD data.

## How to run the interactive site
- BICH TO WRITE AFTER WE MERGE THE TWO REPOSITORIES 
- Launch a virtual environement
- Run app-solutions.py

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

## Contributors & Support
- Abhidnya Thakur
- Bich Jennings
- Duc Trieu Pham
- Yared Haile

##TO BE DELETED PRIOR TO SUBMISSION

## Project Steps:
- Project brief [done]
- Find Data (include scraping) and clean using Jupyter Notebook [done]
- Create Database [done]
- Create Python Flask API - used by JS [done]
- Visualise data [done]
- Create prsentation [draft - done]
- Rehearse presetnation

## Data
- Global census data
- Global GDP data

## Project Schedule (suggested key dates)
### Date - Milestone / Activity
- Thu 14 Dec 23 - Submit the project propsal, confirm analysis steps & dates
- Mon 18 Dec 23 - Upload data (Yared) cleaned data (Abhi & Duc) + pulled into Cloud Database (Bich) + Confirm detailed analysis (each visual + story) + Python Flask with Hamim
- Tue 19 Dec 23 - 6:30pm-9:30pm confirm data source and troubleshooting + database + Create Python Flask API 
- Thu 21 Dec 23 - 6pm cleaned data and initial graphs
- Sat 23 Dec 23 - 10am visual analysis 80-90%
- Thu 28 Dec 23 - 6pm completed visual analysis + start presentation 
- Sun 31 Dec 23 - 10am first rehearsal 
- Tue 02 Jan 24 - First day - Meet at 5:30pm (1 hour practice) + Project group presentation


## Task Distribution
- Abhi: jupyter notebook / CSS styling 
- Bich: ReadMe / re-import of DB dropping decimal / vis graph
- Duc: vis graph + drop down menus
- Yared: vis map

## Ideas for Plots/Tables
- GDP(nominal) Vs Infant mortality rate
- GDP(nominal) per capita Vs Infant mortality rate

## Dashboard stucture
- Headline
- Country info table - 1) Name 2) Sub-region 3) Continent 4) Current population 5) Current GDP(nominal) 6) Current GDP(nominal) per capita
- Dropdown menu 1) Continent 2) Sub-region 3) Country
- Population Vs Year

## Notes:
- Recall our Prokect 1 Ststistical Analysis included a null and alternative hypothesis, outlier analysis, t-test discussions
