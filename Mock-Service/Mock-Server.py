# Server Imports
from flask import Flask, request, jsonify
# Generic Imports
import json


# Loading Flask
app = Flask(__name__)


@app.route("/annotate", methods=['POST'])
def post_annotate():

    print "Incoming request: "+request.data

    if request.method == "POST":

        json_dict = request.get_json()

        stripe_key = json_dict['id']
        stripe_hash = json_dict['hash']
        stripe_user = json_dict['user']
        stripe_name = json_dict['name']
        stripe_lang = json_dict['lang']
        stripe_file = json_dict['file']
        annotations = [{'name': 'Hardcoded Value', 'line': 25, 'line_content': 'print(Hello, World!)', 'vote': '1',
                        'description': '"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."'}]

        data = {'id':  stripe_key, 'hash': stripe_hash, 'user': stripe_user, 'annotations': annotations}

        return jsonify(data)

    else:
        return "{'error':'annotate'}"


# Starting Server
if __name__ == "__main__":
    app.run(host="127.0.0.1", port="8080")
