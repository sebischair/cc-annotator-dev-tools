# Server Imports
from flask import Flask, request, jsonify
# Generic Imports
import json


# Loading Flask
app = Flask(__name__)


'''@app.route("/annotate", methods=['POST'])
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

        if stripe_name == "File_2.go":
            annotations = [
                            {
                              "name": "Bad What Ever",
                              "line": 27,
                              "vote": "not yet",
                              "line_content": "tuple = tuple[:len(tuple)-1] + \")\"",
                              "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
                            },
                            {
                              "name": "Very Bad Code",
                              "line": 45,
                              "vote": "bad",
                              "line_content": "connChannel := make(chan Edge)",
                              "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
                            }
                          ]

        data = {'id':  stripe_key, 'hash': stripe_hash, 'user': stripe_user, 'annotations': annotations}
        print "Response: " + str(data)

        return jsonify(data)

    else:
        return "{'error':'annotate'}"
'''

@app.route("/annotate", methods=['POST'])
def post_annotate():
    request
    if request.method == "POST":
        json_dict = request.get_json()
        stripe_lang = json_dict['lang']
        stripe_content = json_dict['file_content']
        commet_blockes = parse_comment_blocks(stripe_lang, stripe_content)
        #stripe_lang = request.data
        return stripe_lang
    else:
        return "No Post"


def parse_comment_blocks(stripe_lang, stripe_content):
    comments = []
    simple_comment = False
    block_comment = False
    comment = ""
    i = 1
    line_start = 0
    for line in stripe_content.split("\n"):
        if "//" in line:
            line = line[line.find("//")+2:].strip()
            comments.append((line, i))
        elif "\*/" in line:
            comment += line[line.find("//") + 2:].strip()
            block_comment = False
            comments.append((block_comment, line_start, i))
        elif block_comment:
            comment += " "+line.strip()
        elif "/\*" in line:
            comment = line[line.find("/\*")+2:].strip()
            line_start = i
            block_comment = True
        i += 1
    for comment in comments:
        print comment

    return comments


def request_analysis(comments):
    url = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment"
    

# Starting Server
if __name__ == "__main__":
    app.run(host="127.0.0.1", port="8080")
