import streamlit as st
import pandas as pd
import plotly.express as px
from utils.data_loader import load_data

# ================= CONFIG =================
st.set_page_config(page_title="Geographical Analysis", layout="wide")

# ================= LOAD =================
df = load_data()

# ================= HEADER =================
st.markdown("<h1 style='text-align:center;'>🌍 Geographical Analysis</h1>", unsafe_allow_html=True)

# ================= FILTER =================
st.sidebar.header("📆 Filter")

year_range = st.sidebar.slider(
    "Select Year Range",
    int(df["year"].min()),
    int(df["year"].max()),
    (int(df["year"].min()), int(df["year"].max()))
)

df = df[df["year"].between(year_range[0], year_range[1])]

# ================= STATE COUNTS =================
state_counts = df["state"].value_counts().reset_index()
state_counts.columns = ["state", "count"]

# ================= REGION MAP =================
region_map = {
    "CA":"West","WA":"West","OR":"West","NV":"West","AZ":"West","UT":"West","CO":"West","ID":"West","MT":"West","WY":"West","AK":"West","HI":"West",
    "TX":"South","FL":"South","GA":"South","AL":"South","MS":"South","LA":"South","SC":"South","NC":"South","VA":"South","TN":"South","KY":"South","AR":"South","OK":"South","WV":"South","DE":"South","MD":"South","DC":"South",
    "IL":"Midwest","IN":"Midwest","OH":"Midwest","MI":"Midwest","WI":"Midwest","MN":"Midwest","IA":"Midwest","MO":"Midwest","KS":"Midwest","NE":"Midwest","SD":"Midwest","ND":"Midwest",
    "NY":"Northeast","NJ":"Northeast","PA":"Northeast","CT":"Northeast","RI":"Northeast","MA":"Northeast","VT":"Northeast","NH":"Northeast","ME":"Northeast"
}

df["region"] = df["state"].map(region_map)
df = df.dropna(subset=["region"])

region_counts = df["region"].value_counts().reset_index()
region_counts.columns = ["Region", "Count"]

# ================= KPI =================
top_state = state_counts.iloc[0]["state"]
top_state_count = state_counts.iloc[0]["count"]
top_region = region_counts.iloc[0]["Region"]

# ================= KPI SECTION =================
st.markdown("## 🌍 Geographic Highlights")

c1, c2 = st.columns(2)

c1.metric("🏆 Most Affected State", top_state, f"{top_state_count} disasters")
c2.metric("🔥 Most Affected Region", top_region)

# ================= MAP =================
fig_map = px.choropleth(
    state_counts,
    locations="state",
    locationmode="USA-states",
    color="count",
    scope="usa",
    color_continuous_scale="Reds"
)

# ================= TOP STATES =================
top_states = state_counts.nlargest(10, "count")

fig1 = px.bar(
    top_states,
    x="state",
    y="count",
    color="count"
)

# ================= REGION =================
fig2 = px.bar(
    region_counts,
    x="Region",
    y="Count",
    color="Count"
)

# ================= INCIDENT TYPE =================
filtered = df[df["state"].isin(top_states["state"])]

stacked = (
    filtered.groupby(["state", "incidentType"])
    .size()
    .reset_index(name="count")
)

fig3 = px.bar(
    stacked,
    x="state",
    y="count",
    color="incidentType"
)

# ================= HURRICANE =================
hurricane_df = df[df["incidentType"].str.contains("Hurricane", case=False, na=False)]

if not hurricane_df.empty:
    hurricane_counts = hurricane_df["state"].value_counts().reset_index()
    hurricane_counts.columns = ["state", "count"]

    fig4 = px.choropleth(
        hurricane_counts,
        locations="state",
        locationmode="USA-states",
        color="count",
        scope="usa",
        color_continuous_scale="Blues"
    )

# ================= MAP + TOP STATES =================
st.markdown("---")
st.markdown("## 🗺️ Disaster Distribution")

col1, col2 = st.columns(2)

with col1:
    st.markdown("### Map View")
    st.plotly_chart(fig_map, use_container_width=True)

with col2:
    st.markdown("### Top 10 States")
    st.plotly_chart(fig1, use_container_width=True)

# ================= REGION + INCIDENT =================
st.markdown("---")
st.markdown("## 📊 Regional & Type Analysis")

col3, col4 = st.columns(2)

with col3:
    st.markdown("### Regional Comparison")
    st.plotly_chart(fig2, use_container_width=True)

with col4:
    st.markdown("### Incident Types by State")
    st.plotly_chart(fig3, use_container_width=True)

# ================= HURRICANE =================
st.markdown("---")
st.markdown("## 🌪 Hurricane Hotspots")

if hurricane_df.empty:
    st.info("No hurricane data available in selected range")
else:
    st.plotly_chart(fig4, use_container_width=True)