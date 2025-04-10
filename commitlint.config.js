module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [
        2,
        'always',
        [
          'feat',     // New feature
          'fix',      // Bug fix
          'docs',     // Documentation changes
          'style',    // Code style changes (formatting, etc)
          'refactor', // Code changes that neither fix a bug nor add a feature
          'perf',     // Performance improvements
          'test',     // Adding or updating tests
          'build',    // Build system or external dependency changes
          'ci',       // CI configuration changes
          'chore',    // Other changes that don't modify src or test files
          'revert',   // Reverts a previous commit
        ],
      ],
      'scope-enum': [
        2,
        'always',
        [
          'frontend',  // Frontend changes
          'backend',   // Backend changes
          'database',  // Database changes
          'api',       // API changes
          'auth',      // Authentication related
          'charts',    // Chart components
          'ui',        // UI components
          'deps',      // Dependencies
          'docker',    // Docker configuration
          'config',    // Configuration
          'docs',      // Documentation
        ],
      ],
      'subject-case': [0], // Disable case checking for subject
    },
  };