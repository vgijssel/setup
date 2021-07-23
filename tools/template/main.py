from jinja2 import Environment, FileSystemLoader
import sys
import json
import os

if __name__ == "__main__":
    _, target_file_path, json_data, output_file_path = sys.argv

    data = json.loads(json_data)

    for k, v in data.items():
        if v["is_build_label"] == True:
            with open(v["location"]) as f:
                v["value"] = f.read()

    searchpath = os.path.dirname(os.path.abspath(target_file_path))
    target_file_name = os.path.basename(target_file_path)
    loader = FileSystemLoader(searchpath=searchpath)
    template_env = Environment(loader=loader)
    template_file = target_file_name
    template = template_env.get_template(template_file)

    output = template.render(data)

    with open(output_file_path, "w") as output_file:
        output_file.write(output)
