from fastapi import FastAPI, Depends, HTTPException, status
from database import get_db
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import pandas as pd
import numpy as np
import os
import models
import schemas
import auth
import json
import math

from auth import get_current_user

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:3000",
        "http://127.0.0.1:5500",
        "http://127.0.0.1:8000",
        "null",  # for file:// sometimes
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_user_csv(email: str):

    # TEMP mapping (PoC)
    if email == "user1@test.com":
        return "data1.csv"

    if email == "user2@test.com":
        return "data2.csv"

    return "default.csv"

@app.get("/")
def read_root():
    return {"status": "Backend is running"}

@app.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):

    existing = auth.get_user_by_email(db, user.email)

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    try:
        hashed = auth.hash_password(user.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    new_user = models.User(
        email=user.email,
        hashed_password=hashed
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = auth.create_access_token(
        data={"sub": new_user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):

    authenticated = auth.authenticate_user(
        db,
        user.email,
        user.password
    )

    if not authenticated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    token = auth.create_access_token(
        data={"sub": authenticated.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get("/me")
def read_me(current_user=Depends(auth.get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "dataset": current_user.dataset
    }


@app.post("/data", response_model=schemas.ClientDataOut)
def create_data(
    data: schemas.ClientDataCreate,
    db: Session = Depends(get_db),
    current_user=Depends(auth.get_current_user)
):

    record = models.ClientData(
        user_id=current_user.id,
        name=data.name,
        value=data.value
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record

@app.get("/data")
def get_data(user=Depends(get_current_user)):

    email = user.email

    print("DATA REQUEST from:", email)

    csv_file = get_user_csv(email)

    df = pd.read_csv(f"data/{csv_file}")

    # ---------------- HARD CLEAN ----------------

    # Replace common bad strings
    df = df.replace(
        ["NaN", "nan", "INF", "inf", "-inf", "Infinity", "-Infinity"],
        None
    )

    # Replace numpy inf
    df = df.replace([np.inf, -np.inf], None)

    # Replace pandas NaN
    df = df.where(pd.notnull(df), None)

    # --------------------------------------------

    records = df.to_dict(orient="records")

    # ---------------- DEEP CLEAN ----------------

    def clean_value(v):
        if v is None:
            return None

        if isinstance(v, float):
            if math.isnan(v) or math.isinf(v):
                return None

        return v


    cleaned = []

    for row in records:
        cleaned_row = {}

        for k, v in row.items():
            cleaned_row[k] = clean_value(v)

        cleaned.append(cleaned_row)

    # --------------------------------------------

    # Validate JSON
    json.dumps(cleaned, allow_nan=False)

    return JSONResponse(content=cleaned)