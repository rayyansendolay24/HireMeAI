import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  const [activeWindow, setActiveWindow] = useState(null);
  const [startMenu, setStartMenu] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const openWindow = (windowName) => {
    setStartMenu(false);
    setActiveWindow(windowName);
  };

  return (
    <div className="desktop">
      {/* PERSONAL BRANDING */}

<div className="personal-branding">

    <div className="brand-name">
        RAYYAN SENDOLAY
    </div>

    <div className="brand-domain">
        AI-ML Engineer
    </div>

    <div className="brand-line"></div>

    <div className="brand-role">
        AI • ML • Web-Dev
    </div>

</div>

      {/* Desktop Icons */}
      <div className="desktop-icons">

        <DesktopIcon
          icon="👤"
          title="My Resume"
          onDoubleClick={() => openWindow("resume")}
        />

        <DesktopIcon
          icon="📊"
          title="Job Matcher"
          onDoubleClick={() => openWindow("matcher")}
        />

        <DesktopIcon
          icon="🤖"
          title="AI Recruiter"
          onDoubleClick={() => openWindow("chat")}
        />

        <DesktopIcon
          icon="ℹ️"
          title="About HireMeAI"
          onDoubleClick={() => openWindow("about")}
        />

      </div>

      {/* Welcome message */}
      <div className="desktop-welcome">
        <div className="welcome-title">HireMeAI</div>

        <div className="welcome-subtitle">
          AI-powered candidate screening system
        </div>

        <div className="welcome-hint">
          Double-click an application to open it
        </div>
      </div>

      {/* Application Windows */}

      {activeWindow === "resume" && (
        <Window
          title="My Resume"
          icon="👤"
          onClose={() => setActiveWindow(null)}
        >
          <ResumeWindow />
        </Window>
      )}

      {activeWindow === "matcher" && (
        <Window
          title="HireMeAI - Job Matcher"
          icon="📊"
          onClose={() => setActiveWindow(null)}
        >
          <MatcherWindow />
        </Window>
      )}

      {activeWindow === "chat" && (
        <Window
          title="HireMeAI AI Recruiter"
          icon="🤖"
          onClose={() => setActiveWindow(null)}
        >
          <ChatWindow />
        </Window>
      )}

      {activeWindow === "about" && (
        <Window
          title="About HireMeAI"
          icon="ℹ️"
          onClose={() => setActiveWindow(null)}
        >
          <AboutWindow />
        </Window>
      )}

      {/* Start Menu */}

      {startMenu && (
        <div className="start-menu">

          <div className="start-profile">
            <div className="profile-avatar">H</div>

            <div>
              <div className="profile-name">
                HireMeAI
              </div>

              <div className="profile-role">
                AI Recruitment System
              </div>
            </div>
          </div>

          <div className="start-section">
            <div className="start-heading">
              Applications
            </div>

            <StartItem
              icon="👤"
              title="My Resume"
              onClick={() => openWindow("resume")}
            />

            <StartItem
              icon="📊"
              title="Job Matcher"
              onClick={() => openWindow("matcher")}
            />

            <StartItem
              icon="🤖"
              title="AI Recruiter"
              onClick={() => openWindow("chat")}
            />

            <StartItem
              icon="ℹ️"
              title="About HireMeAI"
              onClick={() => openWindow("about")}
            />
          </div>

        </div>
      )}

      {/* Taskbar */}

      <div className="taskbar">

        <button
          className="start-button"
          onClick={() => setStartMenu(!startMenu)}
        >
          <span className="windows-logo">⊞</span>
        </button>

        <div className="taskbar-search">
          🔎
          <span>Search HireMeAI</span>
        </div>

        <button
          className={`taskbar-app ${
            activeWindow === "resume" ? "active" : ""
          }`}
          onClick={() => openWindow("resume")}
        >
          👤
        </button>

        <button
          className={`taskbar-app ${
            activeWindow === "matcher" ? "active" : ""
          }`}
          onClick={() => openWindow("matcher")}
        >
          📊
        </button>

        <button
          className={`taskbar-app ${
            activeWindow === "chat" ? "active" : ""
          }`}
          onClick={() => openWindow("chat")}
        >
          🤖
        </button>

        <div className="taskbar-spacer" />

        <div className="system-tray">
          <span>⌃</span>
          <span>⌁</span>
          <span>🔊</span>

          <div className="clock">
            <div>
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>

            <div>
              {time.toLocaleDateString()}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}


/* =========================
   DESKTOP ICON
========================= */

function DesktopIcon({ icon, title, onDoubleClick }) {
  return (
    <div
      className="desktop-icon"
      onDoubleClick={onDoubleClick}
    >
      <div className="desktop-icon-image">
        {icon}
      </div>

      <div className="desktop-icon-title">
        {title}
      </div>
    </div>
  );
}


/* =========================
   WINDOWS
========================= */

function Window({ title, icon, children, onClose }) {
  return (
    <div className="app-window">

      <div className="window-titlebar">

        <div className="window-title">
          <span>{icon}</span>
          <span>{title}</span>
        </div>

        <div className="window-controls">

          <button>−</button>
          <button>□</button>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>

        </div>

      </div>

      <div className="window-content">
        {children}
      </div>

    </div>
  );
}


/* =========================
   START MENU
========================= */

function StartItem({ icon, title, onClick }) {
  return (
    <button
      className="start-item"
      onClick={onClick}
    >
      <span className="start-item-icon">
        {icon}
      </span>

      <span>{title}</span>
    </button>
  );
}


/* =========================
   RESUME
========================= */

function ResumeWindow() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/resume`)
      .then((response) => response.json())
      .then((data) => {
        setResume(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading">
        Loading resume...
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="error-box">
        Unable to connect to HireMeAI backend.
      </div>
    );
  }

  return (
    <div className="resume-page">

      <div className="resume-header">

        <div className="resume-avatar">
          {resume.name?.charAt(0) || "H"}
        </div>

        <div>
          <h1>
            {resume.name || "Candidate"}
          </h1>

          <p>
            AI Candidate Profile
          </p>
        </div>

      </div>

      <div className="resume-grid">

        <InfoCard
          title="Email"
          value={resume.email}
        />

        <InfoCard
          title="Phone"
          value={resume.phone}
        />

        <InfoCard
          title="Experience"
          value={
            resume.total_experience_years
              ? `${resume.total_experience_years} years`
              : "Not specified"
          }
        />

      </div>

      <Section
        title="Skills"
        content={
          resume.skills?.length
            ? resume.skills.join(" • ")
            : "No skills available"
        }
      />

      <Section
        title="Education"
        content={
          resume.education?.length
            ? resume.education.join("\n")
            : "No education information"
        }
      />

      <Section
        title="Projects"
        content={
          resume.projects?.length
            ? resume.projects.join("\n")
            : "No project information"
        }
      />

      <Section
        title="Certifications"
        content={
          resume.certifications?.length
            ? resume.certifications.join("\n")
            : "No certifications"
        }
      />

      <div className="experience-list">

        <h2>Experience</h2>

        {resume.experiences?.map((experience, index) => (
          <div
            className="experience-card"
            key={index}
          >

            <h3>
              {experience.role || "Role"}
            </h3>

            <div className="company">
              {experience.company || "Company"}
            </div>

            <div className="duration">
              {experience.duration || ""}
            </div>

            <p>
              {experience.description || ""}
            </p>

            {experience.skills_used?.length > 0 && (
              <div className="skill-tags">
                {experience.skills_used.map(
                  (skill, i) => (
                    <span key={i}>
                      {skill}
                    </span>
                  )
                )}
              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}


function InfoCard({ title, value }) {
  return (
    <div className="info-card">

      <div className="info-title">
        {title}
      </div>

      <div className="info-value">
        {value || "Not available"}
      </div>

    </div>
  );
}


function Section({ title, content }) {
  return (
    <div className="resume-section">

      <h2>{title}</h2>

      <div className="section-content">
        {content}
      </div>

    </div>
  );
}


/* =========================
   JOB MATCHER
========================= */

function MatcherWindow() {

  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const matchJob = async () => {

    if (!jobDescription.trim()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {

      const response = await fetch(
        `${API_URL}/match`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            job_description: jobDescription
          })
        }
      );

      const data = await response.json();

      setResult(data);

    } catch (error) {

      setResult({
        error: "Unable to connect to backend."
      });

    }

    setLoading(false);
  };

  return (
    <div className="matcher">

      <div className="app-heading">

        <div className="app-heading-icon">
          📊
        </div>

        <div>
          <h1>Job Matcher</h1>

          <p>
            Compare a job description against the candidate profile.
          </p>
        </div>

      </div>

      <label>
        Job Description
      </label>

      <textarea
        className="job-input"
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(e.target.value)
        }
      />

      <button
        className="primary-button"
        onClick={matchJob}
        disabled={loading}
      >
        {loading
          ? "Analyzing..."
          : "Analyze Job Match"}
      </button>

      {result && (
        <div className="match-result">

          <h2>
            Match Analysis
          </h2>

          {result.error ? (
            <div className="error-box">
              {result.error}
            </div>
          ) : (
            <ResultViewer data={result} />
          )}

        </div>
      )}

    </div>
  );
}


function ResultViewer({ data }) {

  return (
    <div className="result-viewer">

      {data.match_score !== undefined && (
        <div className="score-box">

          <div className="score-number">
            {data.match_score}%
          </div>

          <div>
            Job Match Score
          </div>

        </div>
      )}

      {Object.entries(data).map(
        ([key, value]) => {

          if (key === "match_score") {
            return null;
          }

          return (
            <div
              className="result-row"
              key={key}
            >

              <strong>
                {formatKey(key)}
              </strong>

              <div>
                {typeof value === "object"
                  ? JSON.stringify(value, null, 2)
                  : String(value)}
              </div>

            </div>
          );
        }
      )}

    </div>
  );
}


function formatKey(key) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}


/* =========================
   AI CHAT
========================= */

function ChatWindow() {

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Hello. I am the HireMeAI recruiter assistant. Ask me anything about the candidate."
    }
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    if (!question.trim() || loading) {
      return;
    }

    const userQuestion = question;

    setMessages((old) => [
      ...old,
      {
        role: "user",
        text: userQuestion
      }
    ]);

    setQuestion("");
    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            question: userQuestion
          })
        }
      );

      const data = await response.json();

      setMessages((old) => [
        ...old,
        {
          role: "assistant",
          text:
            data.answer ||
            "No answer returned."
        }
      ]);

    } catch {

      setMessages((old) => [
        ...old,
        {
          role: "assistant",
          text:
            "Unable to connect to the HireMeAI backend."
        }
      ]);

    }

    setLoading(false);
  };

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-app">

      <div className="chat-header">

        <div className="chat-avatar">
          🤖
        </div>

        <div>
          <strong>
            HireMeAI Recruiter
          </strong>

          <span>
            AI candidate assistant
          </span>
        </div>

      </div>

      <div className="chat-messages">

        {messages.map((message, index) => (

          <div
            className={`chat-message ${
              message.role
            }`}
            key={index}
          >
            {message.text}
          </div>

        ))}

        {loading && (
          <div className="chat-message assistant">
            Thinking...
          </div>
        )}

      </div>

      <div className="chat-input-area">

        <textarea
          placeholder="Ask about the candidate..."
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
        >
          ➤
        </button>

      </div>

    </div>
  );
}


/* =========================
   ABOUT
========================= */

function AboutWindow() {

  return (
    <div className="about">

      <div className="about-logo">
        ⚡
      </div>

      <h1>
        HireMeAI
      </h1>

      <p className="about-subtitle">
        AI-powered recruitment portfolio
      </p>

      <div className="about-card">

        <h2>
          What is HireMeAI?
        </h2>

        <p>
          HireMeAI represents a job candidate using
          an AI-powered interface. Recruiters can
          explore the candidate's resume, compare
          the candidate against a job description,
          and communicate with an AI assistant.
        </p>

      </div>

      <div className="architecture">

        <h2>
          System
        </h2>

        <div className="architecture-grid">

          <div>
            <strong>Frontend</strong>
            <span>React + Vite</span>
          </div>

          <div>
            <strong>Backend</strong>
            <span>FastAPI</span>
          </div>

          <div>
            <strong>AI</strong>
            <span>Groq LLM</span>
          </div>

          <div>
            <strong>Deployment</strong>
            <span>Vercel + Railway</span>
          </div>

        </div>

      </div>

    </div>
  );
}


export default App;
