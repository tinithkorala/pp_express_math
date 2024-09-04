// Third-party imports
const dotenv = require('dotenv').config();

// Custom imports
const {connectDb} = require('./config/database');
const app = require('./app');
const { colorLog } = require('./utils/log_helper');
const migrate = require('./config/migrations');

// Define the port number for the server
const port = process.env.PORT || 3000;

// Start the server and listen for incoming requests
app.listen(port, () => {
  colorLog(`🤖 >>> Application is running on port: ${port}`, 'green');
  colorLog(`🤖 >>> Application mode is : ${process.env.NODE_ENV}`, 'green');
  // Connect to database
  connectDb();
  migrate();
});
