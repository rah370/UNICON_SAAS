# School Branding System Documentation

## Overview

The school branding system allows each school (tenant) to customize their UNICON platform instance with their own logo, colors, typography, and theme settings. Branding is automatically applied across all pages and components.

## Database Schema

### Tables

1. **school_branding** - Main branding table (1 row per school)

   - Stores: logo, colors, typography, theme settings
   - Version tracking for rollback capability
   - Active/inactive flag

2. **school_branding_versions** - Version history

   - Stores full branding snapshots as JSON
   - Enables rollback to previous versions
   - Tracks who made changes

3. **schools** - Updated with branding metadata
   - `branding_enabled` - Toggle branding on/off
   - `branding_updated_at` - Last update timestamp

## API Endpoints

### 1. Get Branding

**GET** `/api/branding` or `/api/schools/{schoolId}/branding`

- **Auth**: Required (any user can read their school's branding)
- **Response**:

```json
{
  "success": true,
  "branding": {
    "colors": {
      "primary": "#1D4E89",
      "secondary": "#3B82F6",
      "background": "#FFFFFF",
      "text": "#1F2937",
      "accent": "#10B981"
    },
    "typography": {
      "font_family": "Inter",
      "heading_font_weight": "700",
      "body_font_weight": "400",
      "base_font_size": "16px"
    },
    "assets": {
      "logo_url": "/uploads/logos/logo.png",
      "favicon_url": null,
      "login_background_url": null,
      "header_background_url": null
    },
    "theme": {
      "mode": "light"
    },
    "version": 1
  }
}
```

### 2. Update Branding

**PUT** `/api/branding` or `/api/schools/{schoolId}/branding`

- **Auth**: Required (admin only)
- **Body**:

```json
{
  "primary_color": "#1D4E89",
  "secondary_color": "#3B82F6",
  "font_family": "Inter",
  "theme_mode": "light"
}
```

- **Response**: Updated branding object

### 3. Upload Logo

**POST** `/api/schools/{schoolId}/branding/logo`

- **Auth**: Required (admin only)
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `logo` file field
- **File Requirements**:
  - Types: PNG, JPG, SVG
  - Max size: 2MB
- **Response**:

```json
{
  "success": true,
  "logo_url": "/uploads/logos/abc123_logo.png",
  "message": "Logo uploaded successfully"
}
```

### 4. Get Approved Fonts

**GET** `/api/branding/fonts`

- **Auth**: Not required
- **Response**:

```json
{
  "success": true,
  "fonts": ["Inter", "Roboto", "Open Sans", ...]
}
```

## Validation Rules

### Colors

- Must be valid hex format: `#RRGGBB` (e.g., `#1D4E89`)
- All color fields validated: primary, secondary, background, text, accent

### Fonts

- Must be from approved list:
  - Inter, Roboto, Open Sans, Lato, Montserrat, Poppins, Raleway, Nunito, Source Sans Pro, Ubuntu
  - Playfair Display, Merriweather, Crimson Text, Lora

### Font Weights

- Valid values: `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`

### Font Size

- Format: `{number}{unit}` where unit is `px`, `rem`, or `em`
- Examples: `16px`, `1rem`, `1.2em`

### Theme Mode

- Valid values: `light`, `dark`, `auto`

### Logo Upload

- File types: PNG, JPG, SVG
- Max size: 2MB
- Stored in: `/uploads/logos/`

## Access Control

- **Read branding**: All authenticated users can read their school's branding
- **Update branding**: Only `admin` or `super_admin` roles
- **Upload logo**: Only `admin` or `super_admin` roles
- **Cross-school access**: Only `super_admin` can access other schools' branding

## Auto-Creation on Registration

When a new school registers:

1. School record is created
2. Default branding is automatically created with:
   - Primary color from registration form (or default `#1D4E89`)
   - Secondary color: `#3B82F6`
   - Background: `#FFFFFF`
   - Text: `#1F2937`
   - Accent: `#10B981`
   - Font: `Inter`
   - Theme: `light`
   - Logo URL from registration (if provided)

## Caching

- In-memory cache per school
- Cache key: `branding_{schoolId}`
- Cache cleared on update
- Cache populated on first read

## Version History

- Each branding update increments version number
- Previous version saved to `school_branding_versions` table
- Full branding snapshot stored as JSON
- Creator tracked for audit trail

## Frontend Integration

### On Login

The login response includes branding:

```json
{
  "success": true,
  "user": {...},
  "token": "...",
  "branding": {...}
}
```

### On App Start

1. Call `GET /api/branding` (uses current user's school)
2. Apply branding to CSS variables or theme config
3. Update all components with new colors/fonts

### CSS Variables Example

```css
:root {
  --brand-primary: #1d4e89;
  --brand-secondary: #3b82f6;
  --brand-background: #ffffff;
  --brand-text: #1f2937;
  --brand-accent: #10b981;
  --brand-font: "Inter", sans-serif;
}
```

## Usage Examples

### Update Primary Color

```javascript
await brandingApi.updateBranding({
  primary_color: "#FF5733",
});
```

### Upload Logo

```javascript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const result = await brandingApi.uploadLogo(schoolId, file);
```

### Get Branding

```javascript
const result = await brandingApi.getBranding();
const colors = result.branding.colors;
document.documentElement.style.setProperty("--brand-primary", colors.primary);
```

## Migration

Run the migration SQL:

```bash
mysql -u root unicon_saas < migration_school_branding.sql
```

This will:

- Create `school_branding` table
- Create `school_branding_versions` table
- Add branding columns to `schools` table
- Create default branding for existing schools

## Testing Checklist

- [ ] New school registration creates default branding
- [ ] Login response includes branding
- [ ] GET /api/branding returns correct branding
- [ ] PUT /api/branding updates branding (admin only)
- [ ] POST /api/schools/{id}/branding/logo uploads logo
- [ ] Color validation rejects invalid hex codes
- [ ] Font validation rejects unapproved fonts
- [ ] Logo upload validates file type and size
- [ ] Branding cache works correctly
- [ ] Version history is saved
- [ ] Non-admins cannot update branding
- [ ] Users can only read their own school's branding
