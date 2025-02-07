from flask import Flask, jsonify, request, render_template
from tictactoe import TicTacToeBoard, InvalidMoveError
from werkzeug.exceptions import BadRequest
import datetime
import jsonschema
import random
import string
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

b = TicTacToeBoard()


@app.errorhandler(BadRequest)
def bad_request(error):
    return jsonify({"error": str(error)}), 400


@app.get("/")
def hello_world():
    return app.redirect("/board")


@app.get("/board")
def get_board():
    return b.get()


move_request_schema = {
    "type": "object",
    "properties": {
        "row": {"type": "integer", "minimum": 1, "maximum": 3},
        "column": {"type": "integer", "minimum": 1, "maximum": 3},
        "player": {"type": "string", "enum": ["X", "O"]},
    },
    "required": ["row", "column", "player"],
}


@app.post("/board")
def make_move():
    try:
        d = request.json
    except:
        raise BadRequest("malformed JSON")
    try:
        jsonschema.validate(instance=d, schema=move_request_schema)
    except jsonschema.exceptions.ValidationError as ee:
        raise BadRequest("invalid parameters:" + str(ee))
    row = d["row"]
    column = d["column"]
    player = d["player"]
    try:
        b.make_move(row, column, player)
        return b.get()
    except InvalidMoveError as e:
        raise BadRequest(e.args)


TTL = datetime.timedelta(seconds=10)
last_update = dict()
matched = dict()


def random_str(length: int) -> str:
    return "".join(
        random.choice(string.ascii_uppercase + string.digits) for _ in range(length)
    )


def parse_match_request():
    try:
        return request.args.get("id")
    except ValueError:
        raise BadRequest("no id queryparam")


def evict_outdated():
    now = datetime.datetime.now()
    keys_to_remove = []
    for id, t in last_update.items():
        if now - t > TTL:
            keys_to_remove.append(id)
    for k in keys_to_remove:
        del last_update[k]


@app.get("/match")
def get_match():
    id = parse_match_request()
    if id in matched:
        return {"game_id": matched[id]}
    last_update[id] = datetime.datetime.now()
    evict_outdated()
    if len(last_update) >= 2:
        game_id = random_str(5)
        k1, _ = last_update.popitem()
        k2, _ = last_update.popitem()
        matched[k1] = {"game_id": game_id, "play_as": "X"}
        matched[k2] = {"game_id": game_id, "play_as": "O"}
        if id in matched:
            return matched[id]
    return {"game_id": None}
