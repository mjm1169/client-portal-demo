import json
import os
import base64
import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:

    # -----------------------------
    # Get requested report
    # -----------------------------
    client = req.params.get("client")

    if not client:
        return func.HttpResponse(
            "Missing client parameter",
            status_code=400
        )


    # -----------------------------
    # Get logged-in user
    # -----------------------------
    principal = req.headers.get("x-ms-client-principal")

    if not principal:
        return func.HttpResponse(
            "Not authenticated",
            status_code=401
        )

    user = json.loads(base64.b64decode(principal))
    email = user.get("userDetails")


    # -----------------------------
    # Load access config
    # -----------------------------
    base = os.path.dirname(__file__)

    access_path = os.path.abspath(
        os.path.join(base, "..", "config", "user_access.json")
    )

    with open(access_path) as f:
        access = json.load(f)


    # -----------------------------
    # Check report permissions
    # -----------------------------
    allowed = []

    if email in access.get("users", {}):
        allowed = access["users"][email].get("reports", [])

    if client not in allowed:
        return func.HttpResponse(
            "Forbidden",
            status_code=403
        )


    # -----------------------------
    # Load report file
    # -----------------------------
    report_path = os.path.abspath(
        os.path.join(
            base,
            "..",
            "datafiles",
            #"reports",
            f"{client}.json"
        )
    )

    if not os.path.exists(report_path):
        return func.HttpResponse(
            "Report not found",
            status_code=404
        )


    with open(report_path) as f:
        report = json.load(f)


    # -----------------------------
    # Return report
    # -----------------------------
    return func.HttpResponse(
        json.dumps(report),
        mimetype="application/json"
    )


