import json
import os
from typing import TypedDict
from urllib.parse import urlparse

import clickhouse_connect
import wmill


# Define the clickhouse resource type
class clickhouse(TypedDict):
    host: str
    password: str
    username: str


def table_exists(client, table_name):
    table_exists = client.query(f"EXISTS {table_name}")
    return table_exists.first_item["result"] == 1


def validate_columns(client, table_name, columns):
    table_description = client.query(f"DESCRIBE TABLE {table_name}")
    current_columns = []

    for row in table_description.result_rows:
        column_name = row[0]
        current_columns.append(column_name)

    # Check if the columns in the JSON data match the current columns in the table
    if set(columns) != set(current_columns):
        raise ValueError(
            f"The columns in the JSON data {columns} do not match the current columns in the table {current_columns}"
        )


def validate_primary_key(columns):
    if "id" not in columns:
        raise ValueError(f"Expect id inside the columns passed {columns}")


def create_table(client, table_name, columns):
    column_sql = ", ".join([f"{column} String" for column in columns])
    table_sql = (
        f"CREATE TABLE {table_name} ({column_sql}) ENGINE MergeTree PRIMARY KEY id"
    )
    print(table_sql)
    client.command(table_sql)


def main(
    clickhouse: clickhouse,  # Specify the type for the clickhouse parameter
    json_data: str,  # Specify the type for the json_data parameter
    table_name: str,  # Specify the type for the table_name parameter
):
    # Parse the host URL to extract protocol, hostname, and port
    parsed_url = urlparse(clickhouse["host"])
    protocol = parsed_url.scheme
    hostname = parsed_url.hostname
    port = parsed_url.port

    # Create a client to connect to ClickHouse
    client = clickhouse_connect.get_client(
        host=hostname,
        port=port,
        username=clickhouse["username"],
        password=clickhouse["password"],
    )

    # Load the JSON data
    data = json.loads(json_data)

    # Extract columns and rows from the JSON data
    columns = data["columns"]
    rows = data["data"]

    validate_primary_key(columns)

    if table_exists(client, table_name):
        validate_columns(client, table_name, columns)
    else:
        create_table(client, table_name, columns)

    # Insert the rows into the table
    client.insert(table_name, rows, column_names=columns)
