from __future__ import annotations

from functools import lru_cache
from typing import Literal

import pandas as pd

from ..utils.paths import data_csv_paths

MonthMode = Literal["number", "abbrev"]


MONTH_ABBREV: dict[int, str] = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
}


@lru_cache(maxsize=1)
def load_processed() -> pd.DataFrame:
    paths = data_csv_paths()
    df = pd.read_csv(paths["processed"])
    # Keep column names aligned with the notebooks.
    df = df[["state", "incidentType", "year", "month"]].dropna()
    df["year"] = df["year"].astype(int)
    df["month"] = df["month"].astype(int)
    df["state"] = df["state"].astype(str)
    df["incidentType"] = df["incidentType"].astype(str)
    return df


@lru_cache(maxsize=1)
def load_raw_programs() -> pd.DataFrame:
    paths = data_csv_paths()
    df = pd.read_csv(paths["raw"])
    df = df[["state", "incident_type", "ih_program_declared", "pa_program_declared"]].copy()
    df = df.rename(columns={"incident_type": "incidentType"})
    df["state"] = df["state"].astype(str)
    df["incidentType"] = df["incidentType"].astype(str)
    return df


def _to_year_count_records(series: pd.Series) -> list[dict[str, int]]:
    series = series.sort_index()
    return [{"year": int(year), "count": int(count)} for year, count in series.items()]


def _to_month_count_records(series: pd.Series, mode: MonthMode) -> list[dict[str, int | str]]:
    series = series.sort_index()
    if mode == "abbrev":
        return [
            {"month": MONTH_ABBREV[int(month)], "count": int(count)}
            for month, count in series.items()
        ]
    return [{"month": int(month), "count": int(count)} for month, count in series.items()]


#
# Milestone 2: Temporal analytics (reimplemented from the processed CSV)
#
def temporal_yearly_counts() -> list[dict[str, int]]:
    df = load_processed()
    yearly = df.groupby("year").size()
    return _to_year_count_records(yearly)


def temporal_monthly_counts(month_mode: MonthMode = "number") -> list[dict[str, int | str]]:
    df = load_processed()
    monthly = df.groupby("month").size()
    return _to_month_count_records(monthly, month_mode)


def temporal_rolling(window: int = 3) -> dict[str, list[dict[str, int]]]:
    df = load_processed()
    yearly = df.groupby("year").size().sort_index()
    rolling_avg = yearly.rolling(window=window).mean()

    actual = _to_year_count_records(yearly)
    rolling = [{"year": int(year), "count": int(count)} for year, count in rolling_avg.items() if pd.notna(count)]
    return {"actual": actual, "rolling": rolling}


def temporal_top_incident_types_trend(top_n: int = 6) -> dict[str, object]:
    df = load_processed()
    top_types = df["incidentType"].value_counts().head(top_n).index.tolist()
    filtered = df[df["incidentType"].isin(top_types)]

    # year x incidentType matrix
    incident_trend = (
        filtered.groupby(["year", "incidentType"])
        .size()
        .unstack(fill_value=0)
        .sort_index()
    )

    years = [int(y) for y in incident_trend.index.tolist()]
    incident_types = incident_trend.columns.tolist()
    series = []
    for t in incident_types:
        series.append({"name": t, "data": [int(v) for v in incident_trend[t].tolist()]})

    return {"years": years, "series": series}


#
# Milestone 3: Geospatial analytics (reimplemented from the processed CSV)
#
def geospatial_state_counts() -> list[dict[str, int]]:
    df = load_processed()
    state_counts = df.groupby("state").size().reset_index(name="disaster_count")
    state_counts = state_counts.sort_values("disaster_count", ascending=False)
    return [
        {"state": str(row["state"]), "count": int(row["disaster_count"])}
        for _, row in state_counts.iterrows()
    ]


def geospatial_top_states(top_n: int = 10) -> list[dict[str, int]]:
    df = load_processed()
    state_counts = df.groupby("state").size().sort_values(ascending=False).head(top_n)
    return [{"state": str(state), "count": int(count)} for state, count in state_counts.items()]


def geospatial_incident_state_matrix(limit_states: int | None = None) -> dict[str, object]:
    """
    Returns a matrix suitable for heatmaps:
    - rows: states
    - columns: incident types
    - values: declaration counts
    """
    df = load_processed()
    incident_state = df.groupby(["state", "incidentType"]).size().reset_index(name="count")
    pivot = incident_state.pivot(index="state", columns="incidentType", values="count").fillna(0)

    # Optionally keep only the busiest states.
    if limit_states is not None and limit_states > 0:
        top_states = pivot.sum(axis=1).sort_values(ascending=False).head(limit_states).index
        pivot = pivot.loc[top_states]

    states = pivot.index.tolist()
    incident_types = pivot.columns.tolist()
    values = [[int(v) for v in pivot.loc[s].tolist()] for s in states]

    return {"states": states, "incidentTypes": incident_types, "values": values}


def geospatial_stacked_top_states(top_n: int = 10) -> dict[str, object]:
    """
    Stacked bar chart data:
    - pick top N states by total
    - return per-incidentType series
    """
    matrix = geospatial_incident_state_matrix(limit_states=top_n)
    states = matrix["states"]
    incident_types = matrix["incidentTypes"]
    values = matrix["values"]  # rows=states, cols=incidentTypes

    # Build row objects for easy rendering:
    # [{ state: "CA", "Flood": 12, "Hurricane": 5, ... }, ...]
    rows: list[dict[str, int | str]] = []
    for i, state in enumerate(states):
        row: dict[str, int | str] = {"state": str(state)}
        for j, itype in enumerate(incident_types):
            row[str(itype)] = int(values[i][j])
        rows.append(row)

    return {"states": states, "incidentTypes": incident_types, "rows": rows}


def geospatial_hotspot_by_incident_type(incident_type: str) -> list[dict[str, int]]:
    df = load_processed()
    filtered = df[df["incidentType"] == incident_type]
    state_counts = filtered.groupby("state").size().sort_values(ascending=False)
    return [{"state": str(state), "count": int(count)} for state, count in state_counts.items()]


#
# Milestone 4: Incident analysis
#
M4MergeMode = Literal["correct", "notebook"]


@lru_cache(maxsize=1)
def _m4_key_counts() -> pd.DataFrame:
    df = load_processed()
    # c = number of rows per (state, incidentType)
    return df.groupby(["state", "incidentType"]).size().reset_index(name="c")


def m4_monthly_distribution(month_mode: MonthMode = "abbrev", merge_mode: M4MergeMode = "correct") -> list[dict[str, int | str]]:
    df = load_processed()
    if merge_mode == "correct":
        monthly = df.groupby("month").size()
        return _to_month_count_records(monthly, month_mode)

    # Notebook behavior: each (state, incidentType) row gets duplicated by c (cartesian product),
    # so each processed row should be weighted by c.
    key_counts = _m4_key_counts()  # c per (state, incidentType)
    weighted = df.merge(key_counts, on=["state", "incidentType"], how="left")
    monthly = weighted.groupby("month")["c"].sum()
    return _to_month_count_records(monthly, month_mode)


def m4_top_incident_types(top_n: int = 10, merge_mode: M4MergeMode = "correct") -> list[dict[str, int]]:
    df = load_processed()
    if merge_mode == "correct":
        counts = df["incidentType"].value_counts().head(top_n)
        return [{"incidentType": str(t), "count": int(c)} for t, c in counts.items()]

    key_counts = _m4_key_counts()
    weighted = df.merge(key_counts, on=["state", "incidentType"], how="left")
    counts = weighted.groupby("incidentType")["c"].sum().sort_values(ascending=False).head(top_n)
    return [{"incidentType": str(t), "count": int(c)} for t, c in counts.items()]


def m4_state_type_matrix(merge_mode: M4MergeMode = "correct", limit_states: int | None = None) -> dict[str, object]:
    """
    Used for both the heatmap and the stacked chart:
    - correct: counts = c
    - notebook: counts = c^2 (cartesian effect)
    """
    key_counts = _m4_key_counts()
    if merge_mode == "correct":
        key_counts["count"] = key_counts["c"]
    else:
        key_counts["count"] = key_counts["c"] * key_counts["c"]

    pivot = key_counts.pivot(index="state", columns="incidentType", values="count").fillna(0)

    if limit_states is not None and limit_states > 0:
        top_states = pivot.sum(axis=1).sort_values(ascending=False).head(limit_states).index
        pivot = pivot.loc[top_states]

    states = pivot.index.tolist()
    incident_types = pivot.columns.tolist()
    values = [[int(v) for v in pivot.loc[s].tolist()] for s in states]
    return {"states": states, "incidentTypes": incident_types, "values": values}


def m4_stacked_top_states(top_n: int = 10, merge_mode: M4MergeMode = "correct") -> dict[str, object]:
    matrix = m4_state_type_matrix(merge_mode=merge_mode, limit_states=top_n)
    states = matrix["states"]
    incident_types = matrix["incidentTypes"]
    values = matrix["values"]

    rows: list[dict[str, int | str]] = []
    for i, state in enumerate(states):
        row: dict[str, int | str] = {"state": str(state)}
        for j, itype in enumerate(incident_types):
            row[str(itype)] = int(values[i][j])
        rows.append(row)

    return {"states": states, "incidentTypes": incident_types, "rows": rows}


def m4_top_states(top_n: int = 10, merge_mode: M4MergeMode = "correct") -> list[dict[str, int]]:
    matrix = m4_state_type_matrix(merge_mode=merge_mode)
    states = matrix["states"]
    incident_types = matrix["incidentTypes"]
    values = matrix["values"]  # rows=states

    totals = []
    for i, state in enumerate(states):
        totals.append({"state": str(state), "count": int(sum(int(values[i][j]) for j in range(len(incident_types))))})
    totals.sort(key=lambda x: x["count"], reverse=True)
    return totals[:top_n]


def m4_assistance_top_types(top_n: int = 10, merge_mode: M4MergeMode = "correct") -> list[dict[str, int]]:
    """
    Assistance sums:
    - correct: sum programs directly by incidentType from the raw CSV.
    - notebook: replicate the cartesian merge on (state, incidentType) by weighting raw sums per key by c.
    """
    raw = load_raw_programs()
    if merge_mode == "correct":
        sums = raw.groupby("incidentType")[["ih_program_declared", "pa_program_declared"]].sum()
        sums = sums.sort_values("pa_program_declared", ascending=False).head(top_n)
        return [
            {
                "incidentType": str(idx),
                "ih_program_declared": int(row["ih_program_declared"]),
                "pa_program_declared": int(row["pa_program_declared"]),
            }
            for idx, row in sums.iterrows()
        ]

    key_counts = _m4_key_counts()  # c per (state, incidentType)
    raw_sum_by_key = raw.groupby(["state", "incidentType"])[["ih_program_declared", "pa_program_declared"]].sum().reset_index()
    weighted = raw_sum_by_key.merge(key_counts, on=["state", "incidentType"], how="left")
    weighted["ih_program_declared"] = weighted["ih_program_declared"] * weighted["c"]
    weighted["pa_program_declared"] = weighted["pa_program_declared"] * weighted["c"]

    sums = weighted.groupby("incidentType")[["ih_program_declared", "pa_program_declared"]].sum()
    sums = sums.sort_values("pa_program_declared", ascending=False).head(top_n)

    return [
        {
            "incidentType": str(idx),
            "ih_program_declared": int(row["ih_program_declared"]),
            "pa_program_declared": int(row["pa_program_declared"]),
        }
        for idx, row in sums.iterrows()
    ]

