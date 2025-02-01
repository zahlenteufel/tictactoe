from flask import Flask, request, render_template
from werkzeug.exceptions import BadRequest
from tictactoe import TicTacToeBoard
import jsonschema

app = Flask(__name__)

b = TicTacToeBoard()


@app.errorhandler(404)
def page_not_found(e):
    return render_template("not_found.html"), 404


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
def put_board():
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
    except ValueError as e:
        raise BadRequest(e.args)
