function App() {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1 className="logo">TRAE</h1>
          <nav className="nav">
            <a href="#" className="nav-link">Product</a>
            <a href="#" className="nav-link">Pricing</a>
            <a href="#" className="nav-link">Blog</a>
            <a href="#" className="nav-link">Docs</a>
            <a href="#" className="nav-link">Changelog</a>
            <a href="#" className="nav-link">Community ▾</a>
          </nav>
        </div>
        <div className="header-right">
          <button className="header-button">Claim Anniversary Gift</button>
          <button className="download-button">Download</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">ACCOUNT</h3>
            <a href="#" className="sidebar-link active">Profile</a>
            <a href="#" className="sidebar-link">Settings</a>
            <a href="#" className="sidebar-link">Subscriptions</a>
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-title">SUBSCRIPTION</h3>
            <a href="#" className="sidebar-link">Plan & Billings</a>
            <a href="#" className="sidebar-link">Usage</a>
          </div>
        </aside>

        {/* Main Dashboard */}
        <main className="dashboard">
          <div className="welcome-section">
            <h2 className="welcome-title">Hello! li heng</h2>
            <p className="welcome-subtitle">This is your day 159 of using TRAE IDE.</p>
            <div className="badges">
              <span className="badge"># Guru</span>
              <span className="badge"># Single-Model BFF</span>
              <span className="badge"># Midday Maven</span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-title">Active Days</h3>
              <div className="heatmap">
                <div className="heatmap-header">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
                <div className="heatmap-body">
                  {/* Heatmap cells will be generated dynamically */}
                  {Array.from({ length: 365 }).map((_, i) => (
                    <div key={i} className={`heatmap-cell ${i % 7 === 0 ? 'first-day' : ''} ${Math.random() > 0.5 ? 'active' : ''}`}></div>
                  ))}
                </div>
                <div className="heatmap-legend">
                  <span>Less</span>
                  <div className="legend-colors">
                    <div className="legend-color"></div>
                    <div className="legend-color active"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <h3 className="stat-title">AI Code Accepted</h3>
              <div className="stat-number">21</div>
              <div className="code-distribution">
                <div className="distribution-item">
                  <span className="distribution-label">TS: typescript</span>
                  <div className="distribution-bar">
                    <div className="bar-fill" style={{ width: '40%' }}></div>
                  </div>
                  <span className="distribution-value">8</span>
                </div>
                <div className="distribution-item">
                  <span className="distribution-label">typescript</span>
                  <div className="distribution-bar">
                    <div className="bar-fill" style={{ width: '35%' }}></div>
                  </div>
                  <span className="distribution-value">7</span>
                </div>
                <div className="distribution-item">
                  <span className="distribution-label">js: jsx</span>
                  <div className="distribution-bar">
                    <div className="bar-fill" style={{ width: '25%' }}></div>
                  </div>
                  <span className="distribution-value">5</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <h3 className="stat-title">Chat Count</h3>
              <div className="stat-number">12</div>
              <div className="chat-distribution">
                <div className="distribution-bar">
                  <div className="bar-fill" style={{ width: '100%' }}></div>
                </div>
                <div className="chat-legend">
                  <span className="legend-item user">User</span>
                  <span className="legend-item agent">Agent</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="builder-section">
                <div className="builder-header">
                  <div className="builder-icon">⚙️</div>
                  <span className="builder-title">@Builder with MCP</span>
                </div>
                <p className="builder-subtitle">Recently cooperated 12 / times</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="models-section">
                <div className="model-item">
                  <div className="model-header">
                    <span className="model-name">gpt-5.2-codex</span>
                    <span className="model-count">10</span>
                  </div>
                </div>
                <div className="model-item">
                  <div className="model-header">
                    <span className="model-name">gemini-3-pro</span>
                    <span className="model-count">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Chat Assistant */}
        <aside className="chat-assistant">
          <div className="chat-header">
            <h3 className="chat-title">Chat Assistant</h3>
          </div>
          <div className="chat-messages">
            <div className="message assistant">
              <div className="message-content">
                <p>Hi! I'm Trae, your AI programming assistant. I can help you write code, explain logic, or debug issues. What are we building today?</p>
              </div>
            </div>
            <div className="message user">
              <div className="message-content">
                <p>How can I create a responsive card component with Tailwind?</p>
              </div>
            </div>
            <div className="message assistant">
              <div className="message-content">
                <p>I can certainly help with that! Here's a responsive card component using Tailwind CSS: features an image cap, content area, and a hover effect for better interactivity.</p>
              </div>
            </div>
          </div>
          <div className="chat-input">
            <input type="text" placeholder="Type a message..." className="input-field" />
            <button className="send-button">➤</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

