'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { buildApiUrl } from '@/utils/config';

// Function to fetch charity dashboard data
async function fetchDashboardData() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(buildApiUrl('charities/stats'), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return mock data if fetch fails
    return {
      stats: {
        availablePickups: 8,
        totalCollections: 95,
        foodCollected: 423,
        peopleHelped: 1240
      },
      recentActivity: [
        {
          id: 1,
          type: 'pickup_completed',
          message: 'Completed pickup from Fresh Bites Restaurant',
          foodSaved: '15kg',
          peopleHelped: 35,
          timestamp: '2024-03-15T14:30:00Z'
        },
        {
          id: 2,
          type: 'pickup_scheduled',
          message: 'New pickup scheduled with Green Kitchen',
          scheduledFor: '2024-03-17T15:00:00Z',
          timestamp: '2024-03-15T13:45:00Z'
        },
        {
          id: 3,
          type: 'impact_milestone',
          message: 'Milestone: Helped feed 1000+ people this month!',
          timestamp: '2024-03-15T12:00:00Z'
        }
      ],
      availablePickups: [
        {
          id: 1,
          restaurantName: 'Fresh Bites Restaurant',
          restaurantAddress: '123 Main St, City',
          items: 'Bread (3kg), Vegetables (5kg)',
          availableDate: '2024-03-16',
          availableTime: '14:00',
          preferredPickupTime: '2:00 PM - 4:00 PM'
        },
        {
          id: 2,
          restaurantName: 'Green Kitchen',
          restaurantAddress: '456 Oak Ave, City',
          items: 'Prepared Meals (8 portions), Fruits (4kg)',
          availableDate: '2024-03-16',
          availableTime: '15:30',
          preferredPickupTime: '3:00 PM - 5:00 PM'
        }
      ]
    };
  }
}

export default function CharityDashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      availablePickups: 0,
      totalCollections: 0,
      foodCollected: 0,
      peopleHelped: 0
    },
    recentActivity: [],
    availablePickups: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setIsLoading(true);
      const data = await fetchDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>Error: {error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => loadDashboardData()}
        >
          Retry
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Charity Dashboard</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Available Pickups</h3>
          <p className={styles.statNumber}>
            {isLoading ? '...' : dashboardData.stats.availablePickups}
          </p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Collections</h3>
          <p className={styles.statNumber}>
            {isLoading ? '...' : dashboardData.stats.totalCollections}
          </p>
        </div>
        <div className={styles.statCard}>
          <h3>Food Collected (kg)</h3>
          <p className={styles.statNumber}>
            {isLoading ? '...' : dashboardData.stats.foodCollected}
          </p>
        </div>
        <div className={styles.statCard}>
          <h3>People Helped</h3>
          <p className={styles.statNumber}>
            {isLoading ? '...' : dashboardData.stats.peopleHelped}
          </p>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.recentActivity}>
          <h2>Recent Activity</h2>
          <div className={styles.activityList}>
            {isLoading ? (
              <div className={styles.loading}>Loading activity...</div>
            ) : dashboardData.recentActivity.length === 0 ? (
              <p className={styles.emptyMessage}>No recent activity to display</p>
            ) : (
              dashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityContent}>
                    <p className={styles.activityMessage}>{activity.message}</p>
                    {activity.foodSaved && (
                      <p className={styles.activityDetail}>Food saved: {activity.foodSaved}</p>
                    )}
                    {activity.peopleHelped && (
                      <p className={styles.activityDetail}>People helped: {activity.peopleHelped}</p>
                    )}
                    {activity.scheduledFor && (
                      <p className={styles.activityDetail}>
                        Scheduled for: {formatDate(activity.scheduledFor)}
                      </p>
                    )}
                  </div>
                  <span className={styles.activityTime}>
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.availablePickups}>
          <h2>Available Pickups</h2>
          <div className={styles.pickupsList}>
            {isLoading ? (
              <div className={styles.loading}>Loading available pickups...</div>
            ) : dashboardData.availablePickups.length === 0 ? (
              <p className={styles.emptyMessage}>No available pickups at the moment</p>
            ) : (
              dashboardData.availablePickups.map((pickup) => (
                <div key={pickup.id} className={styles.pickupCard}>
                  <div className={styles.pickupHeader}>
                    <h3>{pickup.restaurantName}</h3>
                  </div>
                  <div className={styles.pickupDetails}>
                    <p className={styles.address}>{pickup.restaurantAddress}</p>
                    <p className={styles.items}>{pickup.items}</p>
                    <p className={styles.pickupTime}>
                      Available: {pickup.availableDate} at {pickup.availableTime}
                    </p>
                    <p className={styles.preferredTime}>
                      Preferred pickup window: {pickup.preferredPickupTime}
                    </p>
                  </div>
                  <button className={styles.claimButton}>
                    Claim Pickup
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
