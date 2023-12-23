import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, text,MetaData, Table, Column, Integer, Numeric, String, select,distinct

from flask import Flask, jsonify
from flask import render_template

#################################################
# Database Setup
#################################################


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

@app.route("/import_data")
def import_data():
    # reflect an existing database into a new model
    engine = create_engine(
        "postgresql://bichjennings:ciL8Vd5SjUMY@ep-white-night-07545349.ap-southeast-1.aws.neon.tech/P3G2?sslmode=require")
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
    engine = create_engine(
        "postgresql://bichjennings:ciL8Vd5SjUMY@ep-white-night-07545349.ap-southeast-1.aws.neon.tech/P3G2?sslmode=require")

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

@app.route("/api/population")
def population():
    engine = create_engine(
        "postgresql://bichjennings:ciL8Vd5SjUMY@ep-white-night-07545349.ap-southeast-1.aws.neon.tech/P3G2?sslmode=require")
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

@app.route("/api/region/<region>")
def region_data(region=None):
    # reflect an existing database into a new model
    engine = create_engine(
        "postgresql://bichjennings:ciL8Vd5SjUMY@ep-white-night-07545349.ap-southeast-1.aws.neon.tech/P3G2?sslmode=require")

    Base = automap_base()
    # reflect the tables
    Base.prepare(autoload_with=engine)
    session = Session(engine)
    conn = engine.connect()
    table_name="region_population"
    query = f"SELECT country, year, totpopjan_thousands, popdensity_personssqkm, medage_years, popannualdoublingtime_years FROM {table_name} where country='{region}'"
    results = session.execute(text(query))
    results_data=[{ 'country':result.country,
                    'year':result.year,
                    'totpopjan_thousands':result.totpopjan_thousands,
                    'popdensity_personssqkm':result.popdensity_personssqkm,
                    'medage_years':result.medage_years,
                    'popannualdoublingtime_years':result.popannualdoublingtime_years,
                    } for result in results]
    session.close()
    return jsonify(results_data), 200

@app.route("/api/population/<population_attribute>/<country1>&<country2>")
def population_attribute(population_attribute, country1, country2):
    # reflect an existing database into a new model
    engine = create_engine(
        "postgresql://bichjennings:ciL8Vd5SjUMY@ep-white-night-07545349.ap-southeast-1.aws.neon.tech/P3G2?sslmode=require")
    country1 = country1.replace("+"," ")
    country2 = country2.replace("+"," ")
    # Table name
    table_name = "population_vs_gdp"
    #Set parameters
    params = {"country1": country1, "country2": country2}
    # Create a select query using SQLAlchemy's select function
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

if __name__ == '__main__':
    app.run(debug=True)
