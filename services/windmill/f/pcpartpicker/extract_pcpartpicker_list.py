import hashlib
from datetime import datetime
from typing import TypedDict

import pandas as pd
import requests
from b2sdk.v2 import B2Api, InMemoryAccountInfo
from bs4 import BeautifulSoup


class s3(TypedDict):
    port: float
    bucket: str
    region: str
    useSSL: bool
    endPoint: str
    accessKey: str
    pathStyle: bool
    secretKey: str


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


# name = 'am5_7900'
# url = 'https://nl.pcpartpicker.com/user/kerkshine/saved/md6DJx'
def main(s3: s3, name: str, url: str):
    parts_data = get_parts_data(url)
    df = pd.DataFrame(parts_data)

    current_time = datetime.now()
    data_time = current_time.strftime("%Y-%m-%d %H:%M:%S.%f")
    file_name_time = current_time.strftime("%Y-%m-%d_%H-%M-%S-%f")

    df["date"] = data_time
    df["id"] = df.apply(lambda row: generate_md5(f"{row['name']}{row['date']}"), axis=1)
    df["list"] = name

    json_data = df.to_json(orient="records")

    info = InMemoryAccountInfo()
    b2_api = B2Api(info)
    application_key_id = s3["accessKey"]
    application_key = s3["secretKey"]
    b2_api.authorize_account("production", application_key_id, application_key)
    bucket = b2_api.get_bucket_by_name(s3["bucket"])

    file_name = f"pcpartpicker/{name}/{file_name_time}.json"
    file_info = {"description": "pcpartpicker"}
    file_content = json_data
    file_content_binary = file_content.encode("utf-8")

    bucket.upload_bytes(file_content_binary, file_name, file_infos=file_info)
