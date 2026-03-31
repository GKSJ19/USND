from __future__ import annotations

from typing import Literal, Optional

from fastapi import APIRouter, Query

from ..services.usnd_service import (
    m4_assistance_top_types,
    m4_monthly_distribution,
    m4_state_type_matrix,
    m4_stacked_top_states,
    m4_top_incident_types,
    m4_top_states,
)

router = APIRouter(prefix="/api/incident", tags=["Incident Analysis"])

MonthMode = Literal["number", "abbrev"]
MergeMode = Literal["correct", "notebook"]


@router.get("/top-incident-types")
def get_top_incident_types(
    top_n: int = Query(10, ge=1, le=50),
    merge_mode: MergeMode = Query("correct"),
) -> dict[str, object]:
    return {"data": m4_top_incident_types(top_n=top_n, merge_mode=merge_mode)}


@router.get("/heatmap")
def get_heatmap(
    merge_mode: MergeMode = Query("correct"),
    limit_states: Optional[int] = Query(None, ge=1, le=60),
) -> dict[str, object]:
    return {"data": m4_state_type_matrix(merge_mode=merge_mode, limit_states=limit_states)}


@router.get("/stacked-top-states")
def get_stacked_top_states(
    top_n: int = Query(10, ge=1, le=60),
    merge_mode: MergeMode = Query("correct"),
) -> dict[str, object]:
    return {"data": m4_stacked_top_states(top_n=top_n, merge_mode=merge_mode)}


@router.get("/top-states")
def get_top_states(
    top_n: int = Query(10, ge=1, le=60),
    merge_mode: MergeMode = Query("correct"),
) -> dict[str, object]:
    return {"data": m4_top_states(top_n=top_n, merge_mode=merge_mode)}


@router.get("/monthly-distribution")
def get_monthly_distribution(
    month_mode: MonthMode = Query("abbrev"),
    merge_mode: MergeMode = Query("correct"),
) -> dict[str, object]:
    return {"data": m4_monthly_distribution(month_mode=month_mode, merge_mode=merge_mode)}


@router.get("/assistance-top-types")
def get_assistance_top_types(
    top_n: int = Query(10, ge=1, le=50),
    merge_mode: MergeMode = Query("correct"),
) -> dict[str, object]:
    return {"data": m4_assistance_top_types(top_n=top_n, merge_mode=merge_mode)}

