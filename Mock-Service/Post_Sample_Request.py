import requests
input={"id": "1234567", 'hash': '35345ergdt43534534', 'user': 'Max', 'name': 'helloWorld.java', 'lang': 'java',
        'file': 'pufddsbfdsjkfbdsjkfbjdskbfjkds'}
r = requests.post('http://127.0.0.1:8080/annotate', json=input, headers={'Content-Type' : 'application/json'})
print r.status_code
print r.content