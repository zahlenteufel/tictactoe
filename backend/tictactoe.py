class InvalidMoveError(Exception):
    pass


class TicTacToeBoard:

    def __init__(self):
        self.board = [[" "] * 3 for _ in range(3)]
        self.current_player = " "
        self.finished = False

    def get(self):
        return {
            "board": self.board,
            "current_player": self.current_player,
            "is_finished": self.finished,
        }

    def is_finished(self):
        return self.finished

    def get_board_pretty(self):
        return "\n-+-+-\n".join("|".join(row) for row in self.board)

    def make_move(self, row, column, player):
        if self.finished:
            raise InvalidMoveError("can't play once it's finished")
        if player not in ("X", "O"):
            raise InvalidMoveError("invalid player")
        if not (1 <= row <= 3 and 1 <= column <= 3):
            raise InvalidMoveError("coordinates out of range")
        if self.board[row - 1][column - 1] != " ":
            raise InvalidMoveError("can't overwrite")
        if self.current_player == player:
            raise InvalidMoveError("can't play twice")
        self.board[row - 1][column - 1] = player
        self.current_player = player
        self.finished = self._check_finished()

    def _check_finished(self):
        for r in range(3):
            if self.board[r][0] == " ":
                continue
            if self.board[r][0] == self.board[r][1] == self.board[r][2]:
                return True
        for c in range(3):
            if self.board[0][c] == " ":
                continue
            if self.board[0][c] == self.board[1][c] == self.board[2][c]:
                return True
        if (
            self.board[0][0] != " "
            and self.board[0][0] == self.board[1][1] == self.board[2][2]
        ):
            return True
        if (
            self.board[2][0] != " "
            and self.board[2][0] == self.board[1][1] == self.board[0][2]
        ):
            return True
        # If no more moves possible.
        if all(" " not in row for row in self.board):
            return True
        return False
