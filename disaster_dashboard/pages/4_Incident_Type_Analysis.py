import streamlit as st
import pandas as pd
import plotly.express as px
from utils.data_loader import load_data

# ================= CONFIG =================
st.set_page_config(page_title="Incident Analysis", layout="wide")

# ================= LOAD =================
df = load_data()
df["date"] = pd.to_datetime(df["date"])
df["year"] = df["date"].dt.year

# ================= FILTER =================
st.sidebar.header("📆 Filter")

year_range = st.sidebar.slider(
    "Select Year Range",
    int(df["year"].min()),
    int(df["year"].max()),
    (int(df["year"].min()), int(df["year"].max()))
)

df = df[df["year"].between(year_range[0], year_range[1])]

# ================= HEADER =================
st.markdown("<h1 style='text-align:center;'>📦 Incident Type Analysis</h1>", unsafe_allow_html=True)



# ================= DATA =================
incident_counts = df["incidentType"].value_counts().reset_index()
incident_counts.columns = ["Incident Type", "Count"]


# ================= ROW 1 =================
st.markdown("---")
st.markdown("## 🔥 Distribution Analysis")

col1, col2 = st.columns(2)

# BAR
with col1:
    st.markdown("### Incident Frequency")

    fig1 = px.bar(
        incident_counts,
        x="Count",
        y="Incident Type",
        orientation="h",
        color="Count"
    )
    fig1.update_layout(yaxis=dict(autorange="reversed"))

    st.plotly_chart(fig1, use_container_width=True)

# PIE
with col2:
    st.markdown("### Major Proportion")

    top5 = incident_counts.head(5)
    others = pd.DataFrame({
        "Incident Type": ["Others"],
        "Count": [incident_counts["Count"][5:].sum()]
    })

    pie_data = pd.concat([top5, others])

    fig2 = px.pie(
        pie_data,
        names="Incident Type",
        values="Count",
        hole=0.4
    )

    st.plotly_chart(fig2, use_container_width=True)

# ================= ROW 2 =================
st.markdown("---")
st.markdown("## 📊 Type Contribution Analysis")

col3, col4 = st.columns(2, gap="large")

with col3:
    st.markdown("### Pareto Analysis")

    pareto = incident_counts.copy().sort_values(by="Count", ascending=False)

    pareto["Cumulative %"] = (
        pareto["Count"].cumsum() / pareto["Count"].sum()
    ) * 100

    fig_pareto = px.bar(
        pareto.head(8),
        x="Incident Type",
        y="Count",
        color="Count"
    )

    # Add cumulative % line
    fig_pareto.add_scatter(
        x=pareto.head(8)["Incident Type"],
        y=pareto.head(8)["Cumulative %"],
        mode="lines+markers",
        name="Cumulative %",
        yaxis="y2"
    )

    # CLEAN AXIS SETTINGS
    fig_pareto.update_layout(
        yaxis=dict(title="Count"),
        yaxis2=dict(
            title="Cumulative %",
            overlaying="y",
            side="right",
            range=[0, 100],   # 🔥 IMPORTANT FIX
            showgrid=False
        ),
        legend=dict(
            orientation="h",
            y=1.1,
            x=0.3
        ),
        margin=dict(t=30, b=30)
    )

    st.plotly_chart(fig_pareto, use_container_width=True)
# ================= PERCENTAGE =================
with col4:
    st.markdown("### Percentage Distribution")

    percent_df = incident_counts.copy()
    percent_df["Percentage"] = (
        percent_df["Count"] / percent_df["Count"].sum()
    ) * 100

    fig4 = px.bar(
        percent_df.head(7),
        x="Incident Type",
        y="Percentage",
        color="Percentage"
    )

    fig4.update_layout(margin=dict(t=30, b=30))

    st.plotly_chart(fig4, use_container_width=True)
# ================= ROW 3 =================
st.markdown("---")
st.markdown("## 🔥 Incident Intensity")

col5, col6 = st.columns(2)

# HEATMAP
with col5:
    st.markdown("### Heatmap (Type vs Year)")

    top_types = incident_counts.head(8)["Incident Type"]

    heat_data = df[df["incidentType"].isin(top_types)]

    heatmap = (
        heat_data.groupby(["incidentType", "year"])
        .size()
        .reset_index(name="Count")
    )

    pivot = heatmap.pivot(index="incidentType", columns="year", values="Count")

    fig5 = px.imshow(
        pivot,
        aspect="auto",
        color_continuous_scale="Viridis"
    )

    st.plotly_chart(fig5, use_container_width=True)

# INSIGHT CARD
with col6:
    st.markdown("### Key Insight")

    top_type = incident_counts.iloc[0]["Incident Type"]
    second_type = incident_counts.iloc[1]["Incident Type"]

    st.success(f"🔥 {top_type} is the most dominant disaster type.")

    st.info(f"📊 {second_type} follows as the second most frequent.")

    st.warning("⚠️ Disaster distribution is highly skewed towards a few types.")