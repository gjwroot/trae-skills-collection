import React, { useState } from 'react';
import './SettingsPage.css';

const mockData = {
  user: {
    name: 'li heng',
    dayCount: 159,
    badges: ['Guru', 'Single-Model BFF', 'Midday Maven']
  },
  activeDays: generateActiveDaysData()
};

function generateActiveDaysData() {
  const weeks = 24;
  const daysPerWeek = 7;
  const data = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < daysPerWeek; d++) {
      const random = Math.random();
      let level = 0;
      if (random > 0.7) level = 1;
      if (random > 0.85) level = 2;
      if (random > 0.95) level = 3;
      data.push({ week: w, day: d, level });
    }
  }
  return data;
}

function SettingsPage() {
  const [activeNav, setActiveNav] = useState('profile');

  const navItems = {
    account: [
      { id: 'profile', label: 'Profile' },
      { id: 'settings', label: 'Settings' },
      { id: 'subscriptions', label: 'Subscriptions' }
    ],
    subscription: [
      { id: 'plan-billings', label: 'Plan & Billings' },
      { id: 'usage', label: 'Usage' }
    ]
  };

  return (
    <div className="settings-container">
      <aside className="settings-sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-title">ACCOUNT</h3>
          <nav className="sidebar-nav">
            {navItems.account.map(item => (
              <button
                key={item.id}
                className={`sidebar-link ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="sidebar-section">
          <h3 className="sidebar-title">SUBSCRIPTION</h3>
          <nav className="sidebar-nav">
            {navItems.subscription.map(item => (
              <button
                key={item.id}
                className={`sidebar-link ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="settings-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Hello! {mockData.user.name}</h1>
          <p className="welcome-subtitle">
            This is your day {mockData.user.dayCount} of using TRAE IDE.
          </p>
          <div className="badges">
            {mockData.user.badges.map((badge, index) => (
              <span key={index} className="badge">#{badge}</span>
            ))}
          </div>
        </div>

        <div className="active-days-card">
          <h2 className="card-title">Active Days</h2>
          <div className="heatmap-container">
            <div className="heatmap-header">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
            <div className="heatmap-grid">
              {mockData.activeDays.map((day, index) => (
                <div
                  key={index}
                  className={`heatmap-cell level-${day.level}`}
                  title={`Week ${day.week + 1}, Day ${day.day + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
