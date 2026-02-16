import json
import os
import base64
import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:

    client_principal = req.headers.get("x-ms-client-principal")

    if not client_principal:
        return func.HttpResponse(
            json.dumps({"error": "Not authenticated"}),
            status_code=401,
            mimetype="application/json"
        )

    # Decode Azure identity
    decoded = base64.b64decode(client_principal)
    user = json.loads(decoded)

    email = user.get("userDetails")

    # Load access config
    base_path = os.path.dirname(__file__)
    config_path = os.path.abspath(
        os.path.join(base_path, "..", "config", "user_access.json")
    )

    with open(config_path) as f:
        access = json.load(f)

    datasets = []

    # User-level override
    if email in access.get("users", {}):
        datasets = access["users"][email]["datasets"]

    return func.HttpResponse(
        json.dumps({
            "email": email,
            "datasets": datasets
        }),
        mimetype="application/json"
    )
