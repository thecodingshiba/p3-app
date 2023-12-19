import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, text

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

@app.route("/population")
def welcome1():
    df = pd.read_sql("SELECT * FROM world_population",conn)
    results = df.head(2).to_json()
    """List all available api routes."""
    return results

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

    return jsonify({table_name+'_data': results_data}), 200


# @app.route("/api/v1.0/passengers")
# def passengers():
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     """Return a list of passenger data including the name, age, and sex of each passenger"""
#     # Query all passengers
#     results = session.query(Passenger.name, Passenger.age, Passenger.sex).all()

#     session.close()

#     # Create a dictionary from the row data and append to a list of all_passengers
#     all_passengers = []
#     for name, age, sex in results:
#         passenger_dict = {}
#         passenger_dict["name"] = name
#         passenger_dict["age"] = age
#         passenger_dict["sex"] = sex
#         all_passengers.append(passenger_dict)

#     return jsonify(all_passengers)


if __name__ == '__main__':
    app.run(debug=True)
