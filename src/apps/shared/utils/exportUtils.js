// Utility functions for exporting data to CSV/PDF

/**
 * Export data to CSV
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name of the file (without extension)
 * @param {Array} columns - Array of column definitions [{key: 'field', label: 'Display Name'}]
 */
export function exportToCSV(data, filename = 'export', columns = null) {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // If columns not provided, use all keys from first object
  if (!columns) {
    const keys = Object.keys(data[0]);
    columns = keys.map(key => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ') }));
  }

  // Create CSV header
  const header = columns.map(col => col.label).join(',');

  // Create CSV rows
  const rows = data.map(item => {
    return columns.map(col => {
      const value = item[col.key];
      // Handle null/undefined
      if (value === null || value === undefined) return '';
      // Escape commas and quotes in values
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });

  // Combine header and rows
  const csv = [header, ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Export announcements to CSV
 */
export function exportAnnouncements(announcements) {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'content', label: 'Content' },
    { key: 'audience', label: 'Audience' },
    { key: 'status', label: 'Status' },
    { key: 'reach', label: 'Reach' },
    { key: 'createdAt', label: 'Created At' },
  ];
  exportToCSV(announcements, 'announcements', columns);
}

/**
 * Export events to CSV
 */
export function exportEvents(events) {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'date', label: 'Date' },
    { key: 'venue', label: 'Venue' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'rsvp', label: 'RSVP Count' },
    { key: 'moderated', label: 'Moderated' },
  ];
  exportToCSV(events, 'events', columns);
}

/**
 * Export marketplace listings to CSV
 */
export function exportMarketplace(listings) {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'seller', label: 'Seller' },
    { key: 'price', label: 'Price' },
    { key: 'status', label: 'Status' },
    { key: 'flagged', label: 'Flagged' },
    { key: 'category', label: 'Category' },
  ];
  exportToCSV(listings, 'marketplace_listings', columns);
}

/**
 * Export users to CSV
 */
export function exportUsers(users) {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'lastLogin', label: 'Last Login' },
  ];
  exportToCSV(users, 'users', columns);
}

/**
 * Export activity logs to CSV
 */
export function exportActivityLogs(logs) {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'action', label: 'Action' },
    { key: 'first_name', label: 'User First Name' },
    { key: 'last_name', label: 'User Last Name' },
    { key: 'email', label: 'User Email' },
    { key: 'role', label: 'User Role' },
    { key: 'created_at', label: 'Created At' },
  ];
  exportToCSV(logs, 'activity_logs', columns);
}

