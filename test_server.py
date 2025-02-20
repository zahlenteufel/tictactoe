import datetime
import pytest
from server import app
import freezegun


@pytest.fixture(scope="function")
def client():
    with app.test_client() as client:
        yield client
    from server import matched, last_update

    matched.clear()
    last_update.clear()


def test_match_with_missing_id_fails(client):
    response = client.get("/match")

    assert response.status_code == 400


def test_match_success(client):
    client.get("/match?id=user1")
    client.get("/match?id=user2")

    response = client.get("/match?id=user1")

    assert response.status_code == 200
    assert response.headers["Content-Type"] == "application/json"
    data = response.json
    assert "game_id" in data
    assert data["game_id"] is not None


def test_cant_match_expired_user(client):
    client.get("/match?id=user1")

    with freezegun.freeze_time(
        datetime.datetime.now() + datetime.timedelta(seconds=11)
    ) as frozen_time:
        response = client.get("/match?id=user2").json

        assert response["game_id"] is None


def test_user_cannot_match_themselves(client):
    client.get("/match?id=user1")

    response = client.get("/match?id=user1").json

    assert response["game_id"] is None
