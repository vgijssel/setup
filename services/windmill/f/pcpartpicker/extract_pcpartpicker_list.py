import hashlib
import os
from datetime import datetime

import pandas as pd
import requests
import wmill
from bs4 import BeautifulSoup


def get_name(part):
    td_node = part.find("td", class_="td__name")

    if td_node is None:
        return None

    anchor_node = td_node.find("a")

    return anchor_node.get_text(strip=True)


def get_price(part):
    td_node = part.find("td", class_="td__price")

    if td_node is None:
        return None

    # Make sure we remove the text of the h6 so we get clean price data!
    return td_node.get_text(strip=True).replace(
        td_node.find("h6").get_text(strip=True), ""
    )


def generate_md5(value):
    return hashlib.md5(value.encode("utf-8")).hexdigest()


def get_parts_data(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    }

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")
    partlist_div = soup.find("div", class_="partlist")

    if not partlist_div:
        print("Unable to find partlist div!")
        exit(1)

    parts = partlist_div.find_all("tr", class_="tr__product")
    parts_data = []

    for part in parts:
        parts_data.append(
            {
                "name": get_name(part),
                "price": get_price(part),
            }
        )

    return parts_data


def main():
    url = "https://nl.pcpartpicker.com/user/kerkshine/saved/md6DJx"
    parts_data = get_parts_data(url)
    df = pd.DataFrame(parts_data)
    df["date"] = datetime.now().strftime("%Y-%m-%d")
    df["id"] = df.apply(lambda row: generate_md5(f"{row['name']}{row['date']}"), axis=1)

    print(df.to_string())

    return []
