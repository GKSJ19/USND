from __future__ import annotations

from pathlib import Path

def repo_root() -> Path:
    # backend/app/utils/paths.py -> utils -> app -> backend -> repo
    return Path(__file__).resolve().parents[3]

def data_csv_paths() -> dict[str, Path]:
    root = repo_root()
    return {
        "raw": root / "data" / "us_disaster_declarations.csv",
        "processed": root / "data" / "processed" / "usnd_cleaned.csv",
    }