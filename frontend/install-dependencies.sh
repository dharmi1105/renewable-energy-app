#!/bin/bash

# Remove node_modules if it exists
rm -rf node_modules

# Remove package-lock.json if it exists
rm -f package-lock.json

# Install base dependencies
npm install

# Install Tailwind CSS and its dependencies
npm install --save-dev tailwindcss@3.3.3 postcss@8.4.29 autoprefixer@10.4.15

# Initialize Tailwind if not already initialized
npx tailwindcss init -p

echo "Dependencies installed successfully!"
echo "Now you can run 'npm start' to start the application."