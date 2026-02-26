// frontend/src/services/analyticsService.js
class AnalyticsService {
  constructor() {
    this.events = [];
  }

  trackEvent(eventName, properties = {}) {
    const event = {
      name: eventName,
      properties,
      timestamp: new Date().toISOString()
    };
    
    this.events.push(event);
    
    // In a real implementation, you would send this to an analytics service
    console.log('Analytics event tracked:', event);
    
    // Save to localStorage for persistence
    try {
      const existingEvents = JSON.parse(localStorage.getItem('analytics-events') || '[]');
      existingEvents.push(event);
      localStorage.setItem('analytics-events', JSON.stringify(existingEvents.slice(-100))); // Keep last 100 events
    } catch (e) {
      console.error('Failed to save analytics event:', e);
    }
  }

  trackPageView(pageName, properties = {}) {
    this.trackEvent('page_view', {
      page: pageName,
      ...properties
    });
  }

  trackButtonClick(buttonName, properties = {}) {
    this.trackEvent('button_click', {
      button: buttonName,
      ...properties
    });
  }

  trackFeatureUsage(featureName, properties = {}) {
    this.trackEvent('feature_used', {
      feature: featureName,
      ...properties
    });
  }

  trackError(errorName, properties = {}) {
    this.trackEvent('error_occurred', {
      error: errorName,
      ...properties
    });
  }

  getEvents() {
    try {
      return JSON.parse(localStorage.getItem('analytics-events') || '[]');
    } catch (e) {
      return [];
    }
  }

  clearEvents() {
    localStorage.removeItem('analytics-events');
    this.events = [];
  }

  getFeatureUsageStats() {
    const events = this.getEvents();
    const featureEvents = events.filter(e => e.name === 'feature_used');
    
    const stats = {};
    featureEvents.forEach(event => {
      const feature = event.properties.feature;
      stats[feature] = (stats[feature] || 0) + 1;
    });
    
    return stats;
  }

  getSessionDuration() {
    const events = this.getEvents();
    if (events.length === 0) return 0;
    
    const firstEvent = new Date(events[0].timestamp);
    const lastEvent = new Date(events[events.length - 1].timestamp);
    
    return (lastEvent - firstEvent) / 1000; // Duration in seconds
  }

  getMostUsedFeature() {
    const stats = this.getFeatureUsageStats();
    let mostUsed = null;
    let maxCount = 0;
    
    for (const [feature, count] of Object.entries(stats)) {
      if (count > maxCount) {
        maxCount = count;
        mostUsed = feature;
      }
    }
    
    return mostUsed;
  }
}

export default new AnalyticsService();
