import pytest
from tictactoe import TicTacToeBoard


class TestClass:

    def test_get_board(self):
        b = TicTacToeBoard()
        b.make_move(1, 1, "X")
        b.make_move(1, 2, "O")
        assert (
            b.get()
            == '{"board": [["X", "O", " "], [" ", " ", " "], [" ", " ", " "]], "current_player": "O"}'
        )

    def test_make_valid_move(self):
        b = TicTacToeBoard()
        b.make_move(1, 1, "X")
        b.make_move(2, 2, "O")

    def test_make_invalid_format(self):
        b = TicTacToeBoard()
        bad_cases = [
            (0, 1, "X", "out of range"),
            (1, 4, "X", "out of range"),
            (2, 1, "x", "invalid player"),
            (1, 1, "invalid", "invalid player"),
            (1, 1, "XO", "invalid player"),
        ]
        for r, c, p, err in bad_cases:
            with pytest.raises(ValueError, match=err):
                b.make_move(r, c, p)

    def test_invalid_move_cant_overwrite(self):
        b = TicTacToeBoard()
        b.make_move(1, 1, "X")

        with pytest.raises(ValueError, match="can't overwrite"):
            b.make_move(1, 1, "O")

    def test_invalid_move_cant_play_twice(self):
        b = TicTacToeBoard()
        b.make_move(1, 1, "X")

        with pytest.raises(ValueError, match="can't play twice"):
            b.make_move(2, 2, "X")
