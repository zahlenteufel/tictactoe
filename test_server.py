import pytest
from server import app


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_match_endpoint(client):
    response = client.get("/match")

    assert response.status_code == 200
    assert response.headers["Content-Type"] == "application/json"
    data = response.json
    assert "game_id" in data


def test_match_endpoint_with_missing_id(client):
    response = client.get("/match")

    assert response.status_code == 400
