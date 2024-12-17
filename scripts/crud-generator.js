/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const resource = process.argv[2];
if (!resource) {
  console.error('Please provide a resource name. Usage: node crud-generator.js <resource>');
  process.exit(1);
}

// Template and destination paths
const templatesDir = path.join(__dirname, '../templates');
const apiDir = path.join(__dirname, `../app/api/${resource}`);
const idDir = path.join(apiDir, '[id]');

// Create directories
if (!fs.existsSync(apiDir)) fs.mkdirSync(apiDir, { recursive: true });
if (!fs.existsSync(idDir)) fs.mkdirSync(idDir, { recursive: true });

// Helper to replace placeholders
const replacePlaceholders = (content, resource) =>
  content.replace(/<%= resource %>/g, resource);

// Generate route.js for index
const indexTemplate = fs.readFileSync(path.join(templatesDir, 'app-api-index-template.js'), 'utf8');
fs.writeFileSync(path.join(apiDir, 'route.js'), replacePlaceholders(indexTemplate, resource));

// Generate route.js for [id]
const idTemplate = fs.readFileSync(path.join(templatesDir, 'app-api-id-template.js'), 'utf8');
fs.writeFileSync(path.join(idDir, 'route.js'), replacePlaceholders(idTemplate, resource));

console.log(`CRUD API for '${resource}' generated successfully in /app/api/${resource}`);