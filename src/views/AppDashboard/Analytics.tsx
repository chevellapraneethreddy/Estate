import React from 'react';
import { useApp } from '../../context/AppContext';

export const Analytics: React.FC = () => {
  const { leads } = useApp();

  // Metrics seed
  const totalVisitors = 3842;
  const totalLeads = leads.length + 242; // base + mock context leads
  const conversionRate = ((totalLeads / totalVisitors) * 100).toFixed(1);
  const avgDuration = '4m 32s';

  // SVG Line Chart coordinates calculations (Traffic trends over 7 days)
  // Days: Mon, Tue, Wed, Thu, Fri, Sat, Sun
  // Visitors: [320, 480, 420, 550, 680, 720, 672]
  // Leads:    [24,  45,  38,  58,  72,  88,  78]
  const linePoints = "50,220 100,160 150,180 200,130 250,80 300,60 350,80";
  const linePointsLeads = "50,270 100,240 150,250 200,220 250,200 300,180 350,190";

  // SVG Bar Chart dimensions (Room Popularity views)
  const barData = [
    { label: 'Living Salon', value: 890, pct: 95, color: 'var(--color-primary)' },
    { label: 'Master Suite', value: 720, pct: 78, color: 'var(--color-accent)' },
    { label: 'Kitchen & Dining', value: 540, pct: 58, color: 'var(--color-warning)' },
    { label: 'Private Deck', value: 430, pct: 46, color: 'var(--color-info)' },
    { label: 'Ensuite Bath', value: 290, pct: 30, color: 'var(--color-primary-hover)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>SaaS Sales Analytics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Real-time tracking of traffic, walkthrough engagement, and buyer interest scores.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {[
          { title: 'Total Walkthrough Visitors', value: totalVisitors.toLocaleString(), change: '+14% MoM', desc: 'Unique IP views on public links' },
          { title: 'Leads Generated', value: totalLeads.toLocaleString(), change: '+22% MoM', desc: 'Captured contact details' },
          { title: 'Conversion Probability Rate', value: `${conversionRate}%`, change: 'Healthy', desc: 'Ratio of visitors to qualified leads' },
          { title: 'Avg. Walkthrough Duration', value: avgDuration, change: '+18s vs last week', desc: 'Average time spent in 3D views' }
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              padding: '20px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {kpi.title}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-1px' }}>
                {kpi.value}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {kpi.change}
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {kpi.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {/* Line Chart */}
        <div className="card" style={{ padding: '24px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Traffic & Lead Trend</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Daily visitors compared to qualified lead form inquiries</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="100%" height="220" viewBox="0 0 400 300" style={{ overflow: 'visible' }}>
              {/* Background grids */}
              <line x1="50" y1="50" x2="350" y2="50" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="50" y1="100" x2="350" y2="100" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="50" y1="150" x2="350" y2="150" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="50" y1="200" x2="350" y2="200" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="50" y1="250" x2="350" y2="250" stroke="var(--border-color)" strokeWidth="1" />

              {/* X Axis Labels */}
              <text x="50" y="270" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Mon</text>
              <text x="100" y="270" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Tue</text>
              <text x="150" y="270" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Wed</text>
              <text x="200" y="270" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Thu</text>
              <text x="250" y="270" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Fri</text>
              <text x="300" y="270" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Sat</text>
              <text x="350" y="270" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Sun</text>

              {/* Y Axis Labels */}
              <text x="35" y="254" fill="var(--text-muted)" fontSize="9" textAnchor="end">0</text>
              <text x="35" y="204" fill="var(--text-muted)" fontSize="9" textAnchor="end">200</text>
              <text x="35" y="154" fill="var(--text-muted)" fontSize="9" textAnchor="end">400</text>
              <text x="35" y="104" fill="var(--text-muted)" fontSize="9" textAnchor="end">600</text>
              <text x="35" y="54" fill="var(--text-muted)" fontSize="9" textAnchor="end">800</text>

              {/* Line 1: Visitors (Teal) */}
              <polyline
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePoints}
              />
              
              {/* Line 2: Leads (Green) */}
              <polyline
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePointsLeads}
              />

              {/* Data points dots */}
              {[[50,220],[100,160],[150,180],[200,130],[250,80],[300,60],[350,80]].map((pt, i) => (
                <circle key={i} cx={pt[0]} cy={pt[1]} r="4.5" fill="#ffffff" stroke="var(--color-accent)" strokeWidth="3" />
              ))}
              
              {[[50,270],[100,240],[150,250],[200,220],[250,200],[300,180],[350,190]].map((pt, i) => (
                <circle key={i} cx={pt[0]} cy={pt[1]} r="4.5" fill="#ffffff" stroke="var(--color-primary)" strokeWidth="3" />
              ))}
            </svg>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--color-accent)', borderRadius: '2px' }} />
              <span>Unique Visitors</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--color-primary)', borderRadius: '2px' }} />
              <span>Qualified Leads</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card" style={{ padding: '24px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Room Popularity index</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Based on hotspot click counts and room walkthrough duration</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center', height: '220px' }}>
            {barData.map((bar, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                  <span style={{ color: 'var(--text-primary)' }}>{bar.label}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{bar.value} views</span>
                </div>
                <div style={{ width: '100%', background: 'var(--bg-tertiary)', height: '10px', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${bar.pct}%`, 
                      background: bar.color, 
                      height: '100%', 
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            * Living Room and Master Suite continue to attract the longest walkthrough dwell times.
          </p>
        </div>
      </div>

      {/* Campaign Efficiency */}
      <div className="card" style={{ padding: '24px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Performance By Decor Theme</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Preference breakdown of active design styles toggled by landing page visitors.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {[
            { name: 'Minimalist Theme', percent: '32%', desc: 'High appeal in urban areas' },
            { name: 'Luxury Theme', percent: '24%', desc: 'Strong correlation with premium budgets' },
            { name: 'Traditional Indian', percent: '18%', desc: 'Popular in villas / families' },
            { name: 'Scandinavian Style', percent: '14%', desc: 'Favored in rental layouts' },
            { name: 'Modern Style', percent: '12%', desc: 'Balanced audience' }
          ].map((theme, i) => (
            <div
              key={i}
              style={{
                flex: '1 0 160px',
                padding: '12px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>{theme.percent}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, margin: '2px 0' }}>{theme.name}</div>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{theme.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
