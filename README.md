# Wild Montana Map Application

An interactive map application for Wild Montana, built with Elebase CMS integration.

## Overview

This repository contains the standalone map application that is embedded in the Wild Montana WordPress site. It provides interactive maps for displaying hiking trails, points of interest, and other location-based data.

## Contents

- `/src` - Source code for the map application
- `/dist` - Compiled assets (generated when building the application)
- `/templates` - Template files used by the application
- `/.env` - Environment configuration (create from `.env.example`)

## Installation and Setup

### Step 1: Install the required packages

```bash
npm install
```

### Step 2: Copy the contents of the `.env.example` file to a new file named `.env`

```bash
cp .env.example .env
```

### Step 3: Update the value for each key in the `.env` file as appropriate

Note that the `.env` file should never be committed to the git repository as it can contain private
API keys and other sensitive information.

Once the `.env` file has been updated, equivalent key/value pairs should be added as 'config vars'
to the Heroku application via its Settings screen if deploying to Heroku.

## Development Process

### Development Server

Start a development server at `http://localhost:9000/hike`:

```bash
npm run dev
```

### Building for Production

Generate a production build:

```bash
npm run build:deploy
```

This command builds the assets in the `/dist` folder. After building:

1. The paths of the files in the `/dist` folder need to be updated in the `/templates` directory
2. Copy the built files to the WordPress application:
   - Copy the `/dist` folder to `/hike/dist` in the WordPress application
   - Copy the `/templates` directory to `/hike/templates` in the WordPress application

### Standalone Production Server

Start a production server at `http://localhost:9000`:

```bash
npm run start
```

## WordPress Integration

This map application is designed to be integrated with the Wild Montana WordPress site (based on the Flynt framework).

For the integration to work properly:

1. Build the application using `npm run build:deploy`
2. Update paths in the template files
3. Copy the `/dist` and `/templates` directories to their respective locations in the WordPress theme

## Troubleshooting

If you encounter issues:

1. Ensure all environment variables are properly set in the `.env` file
2. Check that paths in templates match the actual locations after integration with WordPress
3. Verify that all dependencies are installed correctly

## License

[Add appropriate license information here]
