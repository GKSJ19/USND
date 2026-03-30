import streamlit as st
import matplotlib.pyplot as plt
from utils import load_data, apply_filters

df = load_data()
df = apply_filters(df)

st.title("📈 Temporal Analysis")

yearly = df.groupby('year').size()

fig1, ax1 = plt.subplots()
yearly.plot(ax=ax1)
ax1.set_title("Yearly Disaster Trend")
st.pyplot(fig1)

trend = df.groupby(['year','incidentType']).size().unstack()

fig2, ax2 = plt.subplots()
trend.plot(ax=ax2)
st.pyplot(fig2)