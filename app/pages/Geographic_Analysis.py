import streamlit as st
import seaborn as sns
import matplotlib.pyplot as plt
import plotly.express as px
from utils import load_data, apply_filters

df = load_data()
df = apply_filters(df)

st.title("🌍 Geographic Analysis")

# Top states
top_states = df['state'].value_counts().head(10)

fig1, ax1 = plt.subplots()
top_states.plot(kind='bar', ax=ax1)
st.pyplot(fig1)

# Choropleth map
st.subheader("🗺️ Disaster Map")

state_counts = df['state'].value_counts().reset_index()
state_counts.columns = ['state','count']

fig_map = px.choropleth(
    state_counts,
    locations='state',
    locationmode="USA-states",
    color='count',
    scope="usa",
    color_continuous_scale="Viridis"
)

st.plotly_chart(fig_map, use_container_width=True)

# Heatmap
st.subheader("Heatmap")

state_incident = df.groupby(['state','incidentType']).size().unstack().fillna(0)

fig2, ax2 = plt.subplots(figsize=(10,5))
sns.heatmap(state_incident, ax=ax2)
st.pyplot(fig2)