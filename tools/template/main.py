from jinja2 import Environment, FileSystemLoader, StrictUndefined
import sys
import json
import os
import distutils


def _create_value_boolean_method(value):
    @property
    def value_method(self):
        return bool(distutils.util.strtobool(value))

    return value_method


def _create_value_file_method(value):
    @property
    def value_method(self):
        with open(value) as f:
            return f.read()

    return value_method


def _create_value_string_method(value):
    @property
    def value_method(self):
        return str(value)

    return value_method


value_method_options = {
    "string": _create_value_string_method,
    "boolean": _create_value_boolean_method,
    "file": _create_value_file_method,
}


def _create_value_method(key, config):
    value_method = value_method_options[config["type"]](config["value"])
    return value_method


if __name__ == "__main__":
    _, target_file_path, json_data, output_file_path = sys.argv

    template_objects = json.loads(json_data)
    template_data = {}

    for index, template_object in enumerate(template_objects):
        methods = {}

        for key, value in template_object["values"].items():
            methods[key] = _create_value_method(key, value)

        value_class = type(f"TemplateObject{index}", (object,), methods)
        value_instance = value_class()

        for key in template_object["keys"]:
            template_data[key] = value_instance

    searchpath = os.path.dirname(os.path.abspath(target_file_path))
    target_file_name = os.path.basename(target_file_path)
    loader = FileSystemLoader(searchpath=searchpath)
    template_env = Environment(loader=loader, undefined=StrictUndefined)
    template_file = target_file_name
    template = template_env.get_template(template_file)
    template_data["data"] = template_data
    output = template.render(template_data)

    with open(output_file_path, "w") as output_file:
        output_file.write(output)
