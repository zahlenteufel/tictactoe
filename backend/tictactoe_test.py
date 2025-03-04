import pytest
from tictactoe import InvalidMoveError, TicTacToeBoard


class TestClass:

    def test_get_board(self):
        b = TicTacToeBoard()
        b.make_move(1, 1, "X")
        b.make_move(1, 2, "O")
        assert b.get() == {
            "board": [["X", "O", " "], [" ", " ", " "], [" ", " ", " "]],
            "current_player": "O",
            "is_finished": False,
        }

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
            with pytest.raises(InvalidMoveError, match=err):
                b.make_move(r, c, p)

    def test_invalid_move_cant_overwrite(self):
        b = TicTacToeBoard()
        b.make_move(1, 1, "X")

        with pytest.raises(InvalidMoveError, match="can't overwrite"):
            b.make_move(1, 1, "O")

    def test_invalid_move_cant_play_twice(self):
        b = TicTacToeBoard()
        b.make_move(1, 1, "X")

        with pytest.raises(InvalidMoveError, match="can't play twice"):
            b.make_move(2, 2, "X")

    def test_finished(self):
        b = TicTacToeBoard()

        moves = [
            (1, 1, "X"),
            (2, 1, "O"),
            (1, 2, "X"),
            (2, 2, "O"),
            (1, 3, "X"),
        ]

        for r, c, p in moves:
            assert not b.is_finished()
            b.make_move(r, c, p)

        assert b.is_finished()

    def test_no_more_moved_is_finished(self):
        b = TicTacToeBoard()
        #  XOX
        #  XOX
        #  OXO
        moves = [
            (1, 1, "X"),
            (1, 2, "O"),
            (1, 3, "X"),
            (2, 2, "O"),
            (2, 1, "X"),
            (3, 1, "O"),
            (2, 3, "X"),
            (3, 3, "O"),
            (3, 2, "X"),
        ]

        for r, c, p in moves:
            assert not b.is_finished()
            b.make_move(r, c, p)

        assert b.is_finished()

    def test_cant_play_after_finished(self):
        b = TicTacToeBoard()

        moves = [
            (1, 1, "X"),
            (2, 1, "O"),
            (1, 2, "X"),
            (2, 2, "O"),
            (1, 3, "X"),
        ]

        for r, c, p in moves:
            assert not b.is_finished()
            b.make_move(r, c, p)

        with pytest.raises(InvalidMoveError, match="finished"):
            b.make_move(2, 3, "O")
