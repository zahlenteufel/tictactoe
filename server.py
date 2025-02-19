from flask import Flask, jsonify, request
from tictactoe import TicTacToeBoard, InvalidMoveError
from werkzeug.exceptions import BadRequest
import datetime
import jsonschema
import random
import string
from flask_cors import CORS
from typing import Dict

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], methods=["GET", "POST", "PUT", "DELETE"])


class Game:

    def __init__(self, username1, username2):
        self.playerX = username1
        self.playerO = username2
        self.board = TicTacToeBoard()


games: Dict[str, Game] = {}


@app.errorhandler(BadRequest)
def bad_request(error):
    return jsonify({"error": str(error)}), 400


@app.get("/game/<game_id>")
def get_board(game_id):
    if game_id not in games:
        raise BadRequest("Game not found")
    return games[game_id].board.get()


move_request_schema = {
    "type": "object",
    "properties": {
        "row": {"type": "integer", "minimum": 1, "maximum": 3},
        "column": {"type": "integer", "minimum": 1, "maximum": 3},
        "username": {"type": "string", "minLength": 4},
    },
    "required": ["row", "column", "username"],
}


@app.post("/game/<game_id>/board")
def make_move(game_id):
    if game_id not in games:
        raise BadRequest("Game not found")
    b = games[game_id].board
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
    username = d["username"]
    if username not in (games[game_id].playerX, games[game_id].playerO):
        raise BadRequest("invalid username")
    player = "X" if username == games[game_id].playerX else "O"
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
    for user_id, t in last_update.items():
        if now - t > TTL:
            keys_to_remove.append(user_id)
    for k in keys_to_remove:
        del last_update[k]


@app.get("/match")
def get_match():
    user_id = parse_match_request()
    if user_id in matched:
        return matched[user_id]
    last_update[user_id] = datetime.datetime.now()
    evict_outdated()
    if len(last_update) >= 2:
        game_id = random_str(5)
        k1, _ = last_update.popitem()
        k2, _ = last_update.popitem()
        matched[k1] = {"game_id": game_id, "play_as": "X"}
        matched[k2] = {"game_id": game_id, "play_as": "O"}
        games[game_id] = Game(k1, k2)
        if user_id in matched:
            return matched[user_id]
    return {"game_id": None}
