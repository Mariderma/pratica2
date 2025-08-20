import requests
from fastapi import Request
from typing import Union
from fastapi import FastAPI

app = FastAPI()

@app.post("/signup")
async def signup(request: Request):
    data = await request.json()
    recaptcha_token = data.get("recaptcha")
    secret_key = "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"
    recaptcha_url = "https://www.google.com/recaptcha/enterprise.js"
    response = requests.post(recaptcha_url, data={
        "secret": secret_key,
        "response": recaptcha_token
    })
    result = response.json()
    if not result.get("success"):
        return {"error": "reCAPTCHA inválido"}
    # ...continúa con tu lógica de validación existente...