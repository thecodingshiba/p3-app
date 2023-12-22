import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, text,MetaData, Table, Column, Integer, Numeric, String, select

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
    conn = engine.connect()
    table_name="gpd_data"
    query = f"SELECT * FROM {table_name};"
    results = session.execute(text(query))
    results_data=[
        {'country_name':result.country_name,'country_code':result.country_code,
         'year':result.year,'gdp':result.gdp} for result in results
    ]
    session.close()
    return jsonify({table_name+'_data': results_data}), 200

@app.route("/api/region")
def region_data():
    # reflect an existing database into a new model
    engine = create_engine(
        "postgresql://bichjennings:ciL8Vd5SjUMY@ep-white-night-07545349.ap-southeast-1.aws.neon.tech/P3G2?sslmode=require")

    Base = automap_base()
    # reflect the tables
    Base.prepare(autoload_with=engine)
    session = Session(engine)
    conn = engine.connect()
    table_name="region_population"
    query = f"SELECT country, year, totpopjan_thousands, popdensity_personssqkm, medage_years, popannualdoublingtime_years FROM {table_name};"
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

@app.route("/api/population")
def passengers():
    engine = create_engine(
        "postgresql://bichjennings:ciL8Vd5SjUMY@ep-white-night-07545349.ap-southeast-1.aws.neon.tech/P3G2?sslmode=require")
    # Create a MetaData object
    metadata = MetaData()

    # Table name
    table_name = 'Population_vs_GDP'

    # Reflect the existing table
    newTable = Table(table_name, metadata, autoload_with=engine)

    # Create a select query
    select_query = select(newTable)

    # Establish a connection and execute the query
    with engine.connect() as connection:
        result = connection.execute(select_query)
        # Fetch all rows from the result
        rows = result.fetchall()
        # Fetch the unique countries from the result
        unique_countries= []
        for row in rows:
            if row.Country not in unique_countries:
                unique_countries.append(row.Country)

        unique_years=[]
        for row in rows:
            if row.Year not in unique_years:
                unique_years.append(row.Year)

        population_attributes = [key for key in result.keys() if key not in ["Code", "Country", "Year",
                                                                             "longitude",
                                                                             "latitude"]]

    # Convert rows to a list of dictionaries
    data = [dict(zip(result.keys(), row)) for row in rows]


    # Close the database connection
    engine.dispose()

    return jsonify({"year":unique_years,
                    "country":unique_countries,
                    "population_attribute":population_attributes,
                    "data":data}),201


if __name__ == '__main__':
    app.run(debug=True)
