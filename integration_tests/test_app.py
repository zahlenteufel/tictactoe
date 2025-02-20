import pytest
import subprocess
import time
from playwright.sync_api import sync_playwright

FRONTEND_URL = "http://localhost:5173"


@pytest.fixture(scope="module", autouse=True)
def start_servers():
    backend = subprocess.Popen(["python3", "backend/server.py"])
    frontend = subprocess.Popen(["npm", "run", "dev"], cwd="frontend")

    time.sleep(3)  # Give time for servers to start

    yield  # Run tests

    backend.terminate()
    frontend.terminate()
    frontend.wait()


def assertBoard(page, board):
    for i in range(9):
        r, c = divmod(i, 3)
        expected = board[r][c].replace("-", "")
        assert page.locator(".board > div").nth(i).inner_text() == expected


# Playwright test to check if frontend connects to backend
def test_integration():
    with sync_playwright() as p:
        browser1 = p.chromium.launch()
        browser2 = p.chromium.launch()
        page1 = browser1.new_page()
        page1.goto(FRONTEND_URL)
        page2 = browser2.new_page()
        page2.goto(FRONTEND_URL)

        page1.click("text=Connect")  # player1 will be X (first one to connect).
        page2.click("text=Connect")

        page1.wait_for_selector("text=TicTacToe")
        page2.wait_for_selector("text=TicTacToe")

        page1.locator(".board > div").nth(0).click()
        page2.locator(".board > div").nth(1).click()

        time.sleep(1)

        assertBoard(page1, ["OX-", "---", "---"])

        browser1.close()
        browser2.close()
