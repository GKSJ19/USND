from __future__ import annotations

from typing import Literal, Optional

from fastapi import APIRouter, Query

from ..services.usnd_service import (
    geospatial_hotspot_by_incident_type,
    geospatial_incident_state_matrix,
    geospatial_state_counts,
    geospatial_stacked_top_states,
    geospatial_top_states,
)

router = APIRouter(prefix="/api/geospatial", tags=["Geospatial"])

@router.get("/state-counts")
def get_state_counts() -> dict[str, object]:
    return {"data": geospatial_state_counts()}


@router.get("/top-states")
def get_top_states(top_n: int = Query(10, ge=1, le=50)) -> dict[str, object]:
    return {"data": geospatial_top_states(top_n=top_n)}


@router.get("/heatmap")
def get_heatmap(limit_states: Optional[int] = Query(None, ge=1, le=60)) -> dict[str, object]:
    return {"data": geospatial_incident_state_matrix(limit_states=limit_states)}


@router.get("/stacked-top-states")
def get_stacked_top_states(top_n: int = Query(10, ge=1, le=60)) -> dict[str, object]:
    return {"data": geospatial_stacked_top_states(top_n=top_n)}


@router.get("/hotspot")
def get_hotspot(incident_type: str = Query("Hurricane")) -> dict[str, object]:
    return {"data": geospatial_hotspot_by_incident_type(incident_type=incident_type)}
