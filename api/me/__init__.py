import json
import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:

    # Azure passes auth info in headers
    principal = req.headers.get("x-ms-client-principal")

    if not principal:
        return func.HttpResponse(
            json.dumps({"error": "Not authenticated"}),
            status_code=401,
            mimetype="application/json"
        )

    # Decode principal (base64 JSON)
    import base64
    decoded = base64.b64decode(principal).decode("utf-8")
    user = json.loads(decoded)

    email = user.get("userDetails")

    return func.HttpResponse(
        json.dumps({
            "email": email,
            "provider": user.get("identityProvider"),
            "roles": user.get("userRoles")
        }),
        status_code=200,
        mimetype="application/json"
    )
