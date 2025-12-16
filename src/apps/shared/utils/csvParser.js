// CSV parsing utility for bulk imports

/**
 * Parse CSV file content
 * @param {string} csvText - CSV file content as string
 * @returns {Array} Array of objects with column names as keys
 */
export function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Parse header
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue; // Skip empty lines
    
    const row = {};
    headers.forEach((header, index) => {
      // Normalize header names (lowercase, replace spaces with underscores)
      const normalizedHeader = header.trim().toLowerCase().replace(/\s+/g, '_');
      row[normalizedHeader] = values[index]?.trim() || '';
    });
    data.push(row);
  }

  return data;
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  values.push(current);
  
  return values;
}

/**
 * Read CSV file and parse it
 * @param {File} file - CSV file
 * @returns {Promise<Array>} Parsed CSV data
 */
export function readCSVFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const data = parseCSV(csvText);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Validate user import data
 * @param {Array} users - Array of user objects from CSV
 * @returns {Object} { valid: boolean, errors: Array, validUsers: Array }
 */
export function validateUserImport(users) {
  const errors = [];
  const validUsers = [];
  const requiredFields = ['email', 'first_name', 'last_name'];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  users.forEach((user, index) => {
    const rowErrors = [];
    const rowNumber = index + 2; // +2 because row 1 is header

    // Check required fields
    requiredFields.forEach(field => {
      if (!user[field] || !user[field].trim()) {
        rowErrors.push(`Missing required field: ${field}`);
      }
    });

    // Validate email format
    if (user.email && !emailRegex.test(user.email.trim())) {
      rowErrors.push(`Invalid email format: ${user.email}`);
    }

    // Validate role if provided
    const validRoles = ['student', 'teacher', 'staff', 'admin'];
    if (user.role && !validRoles.includes(user.role.toLowerCase())) {
      rowErrors.push(`Invalid role: ${user.role}. Must be one of: ${validRoles.join(', ')}`);
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: rowNumber,
        email: user.email || 'N/A',
        errors: rowErrors
      });
    } else {
      // Normalize user data
      validUsers.push({
        email: user.email.trim().toLowerCase(),
        first_name: user.first_name.trim(),
        last_name: user.last_name.trim(),
        role: (user.role || 'student').toLowerCase(),
        year_level: user.year_level?.trim() || null,
        major: user.major?.trim() || null,
        password: user.password?.trim() || 'password123', // Default password
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    validUsers
  };
}

