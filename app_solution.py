import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, text,MetaData, Table, Column, Integer, Numeric, String, select,distinct

from flask import Flask, jsonify
from flask import render_template
import psycopg2
from flask import request

from secret_key import secret_key
#################################################
# Database Setup
#################################################
engine_text=f"postgresql://bichjennings:{secret_key}@ep-white-night-07545349.ap-southeast-1.aws.neon.tech/P3G2?sslmode=require"

# #################################################
# # Flask Setup
# #################################################
app = Flask(__name__)


# #################################################
# # Flask Routes
# #################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return render_template("index.html")

@app.route("/map")
def render_map():
    """Population map"""
    return render_template("map.html")

@app.route("/import_data")
def import_data():
    # reflect an existing database into a new model
    engine = create_engine(engine_text)
    metadata = MetaData()

    df = pd.read_csv("Combined00.csv")
    # Table name
    table_name = 'Population_vs_GDP'

    # Columns and their data types
    columns_and_types = [
        ("Country", String),
        ("Code", String),
        ("Year", Integer),
        ("GDP", Numeric),
        ("Pop01", Numeric),
        ("Pop07", Numeric),
        ("M_Pop07", Numeric),
        ("F_Pop07", Numeric),
        ("Density", Numeric),
        ("SexRatio", Numeric),
        ("MedianAge", Numeric),
        ("GrowthRate", Numeric),
        ("DoublingTime", Numeric),
        ("Births", Numeric),
        ("Births15_19Y", Numeric),
        ("CrudeBirthRate", Numeric),
        ("FertilityRate", Numeric),
        ("ReproductionRate", Numeric),
        ("ChildbearingMeanAge", Numeric),
        ("SexRatio_Birth", Numeric),
        ("TotalDeaths", Numeric),
        ("M_Deaths", Numeric),
        ("F_Deaths", Numeric),
        ("CrudeDeathRate", Numeric),
        ("LifeExp_Birth", Numeric),
        ("M_LifeExp_Birth", Numeric),
        ("F_LifeExp_Birth", Numeric),
        ("LifeExp_15Y", Numeric),
        ("M_LifeExp_15Y", Numeric),
        ("F_LifeExp_15Y", Numeric),
        ("LifeExp_65Y", Numeric),
        ("M_LifeExp_65Y", Numeric),
        ("F_LifeExp_65Y", Numeric),
        ("LifeExp_80Y", Numeric),
        ("M_LifeExp_80Y", Numeric),
        ("F_LifeExp_80Y", Numeric),
        ("InfantDeaths", Numeric),
        ("InfantMortalityRate", Numeric),
        ("LiveBirthsSurvivingtoAge1", Numeric),
        ("Under5Deaths", Numeric),
        ("Under5Mortality", Numeric),
        ("Mortality_b40", Numeric),
        ("M_Mortality_b40", Numeric),
        ("F_Mortality_b40", Numeric),
        ("Mortality_b60", Numeric),
        ("M_Mortality_b60", Numeric),
        ("F_Mortality_b60", Numeric),
        ("Mortality_15_50", Numeric),
        ("M_Mortality_15_50", Numeric),
        ("F_Mortality_15_50", Numeric),
        ("Mortality_15_60", Numeric),
        ("M_Mortality_15_60", Numeric),
        ("F_Mortality_15_60", Numeric),
        ("NetMigrants", Numeric),
        ("NetMigrationRate", Numeric),
        ("latitude", Numeric),
        ("longitude", Numeric),
    ]

    # Define the table
    Table(
        table_name,
        metadata,
        *[
            Column(column, data_type) for column, data_type in columns_and_types
        ]
    )

    # Create the table
    metadata.create_all(bind=engine)

    # Insert data into the PostgreSQL table
    df.to_sql(table_name, engine, if_exists='replace', index=False)

    # Close the database connection
    engine.dispose()

    return jsonify({"results:":"Imported sucessfully!!!"}),201

@app.route("/api/gdp")
def gdp_data():
    # reflect an existing database into a new model
    engine = create_engine(engine_text)

    Base = automap_base()
    # reflect the tables
    Base.prepare(autoload_with=engine)
    session = Session(engine)
    table_name="gpd_data"
    query = f"SELECT * FROM {table_name};"
    results = session.execute(text(query))
    results_data=[
        {'country_name':result.country_name,'country_code':result.country_code,
         'year':result.year,'gdp':result.gdp} for result in results
    ]
    session.close()
    return jsonify({table_name+'_data': results_data}), 200


@app.route("/api/population_of_single_country")
def population_data_single_country():
    # reflect an existing database into a new model
    engine = create_engine(engine_text)

    Base = automap_base()
    # reflect the tables
    Base.prepare(autoload_with=engine)
    session = Session(engine)
    country = request.args.get('country')
    year = request.args.get('year')
    query = f"""
    SELECT *
    FROM population_vs_gdp
    INNER JOIN world_population ON population_vs_gdp."Country" = world_population."country"
    AND population_vs_gdp."Year" = world_population."year"
    WHERE population_vs_gdp."Country" = '{country}'
    AND population_vs_gdp."Year" = {year}
"""
    results = session.execute(text(query), {'country': country, 'year': year})
    results_data=[
        {'country':result.country,
         'year':result.year, 'latitude': result.latitude, 'longitude': result.longitude, 'totalpopjan_thousands': result.totalpopjan_thousands} for result in results
    ]
    session.close()
    return jsonify({'population_data': results_data}), 200

@app.route("/api/population")
def population():
    engine = create_engine(engine_text)
    # Create a MetaData object
    metadata = MetaData()

    # Table name
    table_name = 'population_vs_gdp'

    # Reflect the existing table
    newTable = Table(table_name, metadata, autoload_with=engine)

    # Create a distinct query using SQLAlchemy's text function
    distinct_countries_query = text(f'SELECT DISTINCT "Country" FROM {table_name}')
    distinct_years_query = text(f'SELECT DISTINCT "Year" FROM {table_name}')

    # Establish a connection and execute the queries
    with engine.connect() as connection:
        distinct_countries = set(row[0] for row in connection.execute(distinct_countries_query).fetchall())
        distinct_years = set(row[0] for row in connection.execute(distinct_years_query).fetchall())

        # Exclude specific columns from the population_attributes list
        excluded_columns = ["Code", "Country", "Year", "longitude", "latitude"]
        population_attributes = [key for key in newTable.columns.keys() if key not in excluded_columns]

    # Close the database connection
    engine.dispose()

    return jsonify({
        "year": list(distinct_years),
        "country": list(distinct_countries),
        "population_attribute": population_attributes
    }), 201

@app.route("/api/region/<region>/<type>")
def region_data(region=None,type=None):
    # reflect an existing database into a new model
    engine = create_engine(engine_text)

    Base = automap_base()
    # reflect the tables
    Base.prepare(autoload_with=engine)
    session = Session(engine)
    conn = engine.connect()
    table_name="region_population"
    query = f"SELECT country, year, {type} as raw FROM {table_name} where country='{region}'"
    results = session.execute(text(query))
    results_data=[{ 'country':result.country,
                    'year':result.year,
                    'raw':result.raw
                    } for result in results]
    session.close()
    return jsonify(results_data), 200

app.route("/api/population_vs_gdp")
def population_vs_gdp():
    engine = create_engine(engine_text)
    
    with engine.connect() as connection:
        query = text("SELECT * FROM population_vs_gdp")
        results = connection.execute(query)
        population_vs_gdp_data = [dict(row) for row in results.fetchall()]
    
    engine.dispose()
    
    return jsonify(population_vs_gdp_data), 200
@app.route("/api/population/<population_attribute>/<country1>&<country2>")
def population_attribute(population_attribute, country1, country2=""):
    # reflect an existing database into a new model
    engine = create_engine(engine_text)

    country1 = country1.replace("+"," ")
    country2 = country2.replace("+"," ")

    # Table name
    table_name = "population_vs_gdp"

    # Create a select query using SQLAlchemy's select function

    if country1.isdigit():
        # Set parameters
        params = {"country1": int(country1)}
        select_query = text(
            f'SELECT "GDP", "Country", "Year","{country2}", "{population_attribute}" FROM {table_name} WHERE "Year" = :country1 AND "{population_attribute}" > 0;'
        )
    else:
        # Set parameters
        params = {"country1": country1, "country2": country2}
        select_query = text(
            f'SELECT "GDP", "Country", "Year", "{population_attribute}" FROM {table_name} WHERE "Country" IN (:country1, :country2);'
        )

    with engine.connect() as conn:
        results = conn.execute(select_query,params)

        fetch_results=results.fetchall()

        # Use dictionary access for all columns in the result set
        results_data = [dict(zip(results.keys(), result)) for result in fetch_results]

    # Dispose of the engine to release resources
    engine.dispose()
    return jsonify({"data": results_data}), 200

@app.route('/api/population/country')
def get_countries():
    # Logic to retrieve country data in JSON format
    return jsonify({"countries": [...]})

@app.route('/api/population/year')
def get_years():
    # Logic to retrieve year data in JSON format
    return jsonify({"years": [...]})

if __name__ == '__main__':
    app.run(debug=True)
