import pandas as pd
import streamlit as st
import os

@st.cache_data
def load_data():
    processed_path = "data/processed/usnd_cleaned.csv"
    raw_csv_path = "data/DisasterDeclarations.csv"

    # Load processed file if exists
    if os.path.exists(processed_path):
        df = pd.read_csv(processed_path)

    else:
        # Load CSV file
        if not os.path.exists(raw_csv_path):
            st.error("❌ CSV file not found in data folder")
            st.stop()

        df = pd.read_csv(raw_csv_path)

        # Data processing
        df['declarationDate'] = pd.to_datetime(df['declarationDate'], errors='coerce')
        df['year'] = df['declarationDate'].dt.year
        df['month'] = df['declarationDate'].dt.month

        # Create processed folder
        os.makedirs("data/processed", exist_ok=True)

        # Save processed file
        df.to_csv(processed_path, index=False)

    return df


# -----------------------------
# FILTERS (UNCHANGED BUT CLEAN)
# -----------------------------
def apply_filters(df):
    st.sidebar.title("📊 Filters Panel")

    states = st.sidebar.multiselect(
        "Select State",
        df['state'].dropna().unique(),
        default=df['state'].dropna().unique()[:5]
    )

    incidents = st.sidebar.multiselect(
        "Select Incident Type",
        df['incidentType'].dropna().unique(),
        default=df['incidentType'].dropna().unique()
    )

    year_range = st.sidebar.slider(
        "Select Year Range",
        int(df['year'].min()),
        int(df['year'].max()),
        (int(df['year'].min()), int(df['year'].max()))
    )

    filtered_df = df[
        (df['state'].isin(states)) &
        (df['incidentType'].isin(incidents)) &
        (df['year'].between(year_range[0], year_range[1]))
    ]

    st.sidebar.markdown("---")

    st.sidebar.download_button(
        "📥 Download Filtered Data",
        filtered_df.to_csv(index=False),
        file_name="filtered_data.csv",
        mime="text/csv"
    )

    return filtered_df