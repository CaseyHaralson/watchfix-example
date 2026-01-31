import { useState } from 'react';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching dashboard stats
    setTimeout(() => {
      setStats({
        totalUsers: 150,
        activeToday: 42,
        newSignups: 7,
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="dashboard">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h3>Dashboard</h3>
      <div className="stats">
        <div className="stat">
          <span className="stat-value">{stats.totalUsers}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.activeToday}</span>
          <span className="stat-label">Active Today</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.newSignups}</span>
          <span className="stat-label">New Signups</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
