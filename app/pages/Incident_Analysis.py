import streamlit as st
import matplotlib.pyplot as plt
from utils import load_data, apply_filters

df = load_data()
df = apply_filters(df)

st.title("🔥 Incident Analysis")

incident_counts = df['incidentType'].value_counts()

fig1, ax1 = plt.subplots()
incident_counts.plot(kind='bar', ax=ax1)
st.pyplot(fig1)

st.subheader("Assistance Programs")

assist = df.groupby('incidentType')[['ihProgramDeclared','paProgramDeclared']].sum()

fig2, ax2 = plt.subplots()
assist.plot(kind='bar', ax=ax2)
st.pyplot(fig2)