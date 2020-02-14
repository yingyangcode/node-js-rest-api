/**
 * Create and export configuration variables
 */

// Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging',
    'hashingSecret' : 'thisIsASecret',
    'maxChecks' : 5,
    'twilio' : {
        'accountSid' : 'AC4b68a5092fe2584275e69fd2bec8ad0b',
        'authToken' : 'fccf5f068aace3c42903041e7ad9fd89',
        'fromPhone' : '+15014437363'
    }
};

// Production environemnt
environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret' : 'thisIsAlsoASecret',
    'maxChecks' : 5,
    'twilio' : {
        'accountSid' : 'ACf8649837297f1efd2a6a200c03a86b11',
        'authToken' : '45e12e1e27d2b22966246d6dd6078e75',
        'fromPhone' : ''
    }
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check if the current environment is one of the environments above, if not, default to staging
const environemntToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environemntToExport;