from jinja2 import Environment, FileSystemLoader
import sys
import json
import os


def create_value_method(value):
    def _value():
        print(f"VALUE BEING CALLED WITH {value}")
        return value

    return _value


def create_file_content_method(file):
    def _value():
        with open(file) as f:
            return f.read()

    return _value


if __name__ == "__main__":
    _, target_file_path, json_data, output_file_path = sys.argv

    data = json.loads(json_data)

    for k, v in data.items():
        if v["is_build_label"] == True:
            v["value"] = create_file_content_method(v["location"])
        else:
            v["value"] = create_value_method(v["value"])

    print(data)

    searchpath = os.path.dirname(os.path.abspath(target_file_path))
    target_file_name = os.path.basename(target_file_path)
    loader = FileSystemLoader(searchpath=searchpath)
    template_env = Environment(loader=loader)
    template_file = target_file_name
    template = template_env.get_template(template_file)

    output = template.render(data)

    with open(output_file_path, "w") as output_file:
        output_file.write(output)
