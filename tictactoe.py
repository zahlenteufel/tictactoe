import json


class TicTacToeBoard:

    def __init__(self):
        self.board = [[" "] * 3 for _ in range(3)]
        self.current_player = " "

    def get(self):
        return json.dumps({"board": self.board, "current_player": self.current_player})

    def get_board_pretty(self):
        return "\n-+-+-\n".join("|".join(row) for row in self.board)

    def make_move(self, row, column, player):
        if player not in ("X", "O"):
            raise ValueError("invalid player")
        if not (1 <= row <= 3 and 1 <= column <= 3):
            raise ValueError("coordinates out of range")
        if self.board[row - 1][column - 1] != " ":
            raise ValueError("can't overwrite")
        if self.current_player == player:
            raise ValueError("cant play twice")
        self.board[row - 1][column - 1] = player
        self.current_player = player
        return self.get()
