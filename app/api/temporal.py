from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Query

from ..services.usnd_service import (
    temporal_monthly_counts,
    temporal_rolling,
    temporal_top_incident_types_trend,
    temporal_yearly_counts,
)

router = APIRouter(prefix="/api/temporal", tags=["Temporal"])

MonthMode = Literal["number", "abbrev"]


@router.get("/yearly")
def get_yearly() -> dict[str, object]:
    return {"data": temporal_yearly_counts()}


@router.get("/monthly")
def get_monthly(month_mode: MonthMode = Query("number")) -> dict[str, object]:
    return {"data": temporal_monthly_counts(month_mode=month_mode)}


@router.get("/rolling")
def get_rolling(window: int = Query(3, ge=1, le=20)) -> dict[str, object]:
    return {"data": temporal_rolling(window=window)}


@router.get("/top-incident-types-trend")
def get_top_incident_types_trend(top_n: int = Query(6, ge=1, le=50)) -> dict[str, object]:
    return {"data": temporal_top_incident_types_trend(top_n=top_n)}

