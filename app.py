import streamlit as st

st.set_page_config(
    page_title="SentinelAI",
    page_icon="🛡️",
    layout="wide"
)

st.title("🛡️ SentinelAI")
st.subheader("AI-Powered Scam & Phishing Detection Platform")

st.markdown("---")

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Total Scans", "0")

with col2:
    st.metric("Threats Detected", "0")

with col3:
    st.metric("High Risk Alerts", "0")

with col4:
    st.metric("Risk Score", "0%")

st.markdown("---")

st.header("Message Analyzer")

message = st.text_area(
    "Paste suspicious message here",
    height=200
)

if st.button("Analyze Threat"):
    st.success("AI Analysis will appear here")