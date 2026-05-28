import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [urlWarning, setUrlWarning] = useState("");
  const [emailWarning, setEmailWarning] = useState("");
  const [loading, setLoading] = useState(false);

  const [riskScore, setRiskScore] = useState("0");
  const [threatLevel, setThreatLevel] = useState("UNKNOWN");
  const [threatCategory, setThreatCategory] = useState("UNKNOWN");

  const [totalScans, setTotalScans] = useState(0);
  const [threatsDetected, setThreatsDetected] = useState(0);
  const [highRiskAlerts, setHighRiskAlerts] = useState(0);

  const analyzeMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResult("");
    setUrlWarning("");
    setEmailWarning("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
  setResult(data.analysis);
  setUrlWarning(data.url_warning || "");
  setEmailWarning(data.email_warning || "");

  const riskMatch = data.analysis.match(/Risk Score:\s*(\d+)/i);

  const threatMatch = data.analysis.match(
    /Threat Level:\s*(LOW|MEDIUM|HIGH)/i
  );

  const categoryMatch = data.analysis.match(
    /Threat Category:\s*([A-Za-z]+)/i
  );

  setRiskScore(riskMatch ? riskMatch[1] : "0");
  setThreatLevel(threatMatch ? threatMatch[1] : "UNKNOWN");
  setThreatCategory(categoryMatch ? categoryMatch[1] : "UNKNOWN");
  setTotalScans(prev => prev + 1);

if (
  threatMatch &&
  threatMatch[1].toUpperCase() !== "LOW"
) {
  setThreatsDetected(prev => prev + 1);
}

if (
  threatMatch &&
  threatMatch[1].toUpperCase() === "HIGH"
) {
  setHighRiskAlerts(prev => prev + 1);
}
} else {
        setResult("Error: " + data.error);
      }
    } catch (err) {
      setResult("Connection Error");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
  "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)",
        color: "white",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1
  style={{
    fontSize: "72px",
    marginBottom: "40px",
    fontWeight: "900",
    letterSpacing: "2px",
    textShadow: "0 0 25px rgba(59,130,246,0.8)",
  }}
>
  🛡️ SentinelAI
</h1>
        <h2
  style={{
    color: "#94a3b8",
    marginBottom: "20px",
    fontWeight: "400",
  }}
>
          AI-Powered Threat Intelligence Platform
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "rgba(15,23,42,0.75)",
backdropFilter: "blur(10px)",
boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
            padding: "20px",
            borderRadius: "15px",
            border: "1px solid #334155",
            textAlign: "center",
          }}
        >
          <h3>Total Scans</h3>
          <h1>{totalScans}</h1>
        </div>

        <div
          style={{
            background: "rgba(15,23,42,0.75)",
backdropFilter: "blur(10px)",
boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
            padding: "20px",
            borderRadius: "15px",
            border: "1px solid #334155",
            textAlign: "center",
          }}
        >
          <h3>Threats Detected</h3>
          <h1>{threatsDetected}</h1>
        </div>

        <div
          style={{
            background: "rgba(15,23,42,0.75)",
backdropFilter: "blur(10px)",
boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
            padding: "20px",
            borderRadius: "15px",
            border: "1px solid #334155",
            textAlign: "center",
          }}
        >
          <h3>High Risk Alerts</h3>
          <h1>{highRiskAlerts}</h1>
        </div>

        <div
          style={{
            background: "rgba(15,23,42,0.75)",
backdropFilter: "blur(10px)",
boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
            padding: "20px",
            borderRadius: "15px",
            border: "1px solid #334155",
            textAlign: "center",
          }}
        >
          <h3>System Status</h3>
          <h1 style={{ color: "#22c55e" }}>ONLINE</h1>
        </div>
      </div>

      <div
        style={{
          background: "rgba(15,23,42,0.75)",
backdropFilter: "blur(10px)",
boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
          padding: "25px",
          borderRadius: "15px",
          border: "1px solid #334155",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          🔍 Threat Analyzer
        </h2>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste suspicious SMS, Email or URL here..."
          style={{
            width: "100%",
            height: "220px",
            padding: "15px",
            fontSize: "18px",
            marginTop: "15px",
            borderRadius: "10px",
          }}
        />

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={analyzeMessage}
            style={{
              padding: "15px 35px",
              fontSize: "18px",
              cursor: "pointer",
              borderRadius: "10px",
              background:
  "linear-gradient(90deg,#2563eb,#06b6d4)",
boxShadow: "0 0 20px rgba(37,99,235,0.5)",
fontWeight: "bold",
              color: "white",
              border: "none",
            }}
          >
            Analyze Threat
          </button>
        </div>
      </div>

      {loading && (
        <h2
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          Analyzing Threat...
        </h2>
      )}

      {emailWarning && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#1e40af",
            color: "white",
            borderRadius: "10px",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "18px",
          }}
        >
          {emailWarning}
        </div>
      )}

      {urlWarning && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#7f1d1d",
            color: "white",
            borderRadius: "10px",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "18px",
          }}
        >
          {urlWarning}
        </div>
      )}

      {result && (
        <div style={{ marginTop: "30px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "rgba(15,23,42,0.75)",
backdropFilter: "blur(10px)",
boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
                padding: "20px",
                borderRadius: "15px",
                border: "1px solid #334155",
                textAlign: "center",
              }}
            >
              <h3>Threat Assessment</h3>

<h1
  style={{
    color:
      threatLevel === "HIGH"
        ? "#ef4444"
        : threatLevel === "MEDIUM"
        ? "#f59e0b"
        : "#22c55e",
  }}
>
  {threatLevel}
</h1>
            </div>

            <div
              style={{
                background: "rgba(15,23,42,0.75)",
backdropFilter: "blur(10px)",
boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
                padding: "20px",
                borderRadius: "15px",
                border: "1px solid #334155",
                textAlign: "center",
              }}
            >
              <h3>Risk Score</h3>

<h1 style={{ color: "#f59e0b" }}>
  {riskScore}
</h1>
<div
  style={{
    width: "80%",
    margin: "15px auto",
    height: "12px",
    background: "#1e293b",
    borderRadius: "10px",
    overflow: "hidden",
  }}
>
  <div
    style={{
      width: `${riskScore}%`,
      height: "100%",
      background:
        riskScore >= 80
          ? "#ef4444"
          : riskScore >= 50
          ? "#f59e0b"
          : "#22c55e",
    }}
  />
</div>
            </div>
          </div>

          <div
            style={{
              marginTop: "20px",
              background: "rgba(15,23,42,0.75)",
backdropFilter: "blur(10px)",
boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
              padding: "25px",
              borderRadius: "15px",
              border: "1px solid #334155",
            }}
          >
            <h2>🧠 AI Threat Analysis</h2>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                color: "#00ff99",
                fontSize: "18px",
                lineHeight: "1.8",
              }}
            >
              {result}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;