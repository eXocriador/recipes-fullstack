import os from 'os';
import { getEnvVar } from './getEnvVar.js';
import mongoose from 'mongoose';

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

export const startLogs = () => {
  const port = getEnvVar('PORT', '3000');
  const mode = getEnvVar('NODE_ENV', 'development');
  const db = getEnvVar('MONGODB_DB', 'fullstack_recipes');
  const localIP = getLocalIP();

  const mongoStatus =
    mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected';

  if (process.env.NODE_ENV === 'development') {
    // Use chalk and boxen only in development
    import('chalk').then(({ default: chalk }) => {
      import('boxen').then(({ default: boxen }) => {
        const message = `
${chalk.bold.greenBright('🚀 FULLSTACK RECIPES BACKEND')}
${chalk.green('🌐 Local:')}      ${chalk.blue.underline(`http://localhost:${port}`)}
${chalk.green('📡 Network:')}    ${chalk.blue.underline(`http://${localIP}:${port}`)}
${chalk.green('🔧 Mode:')}       ${chalk.yellowBright(mode)}
${chalk.green('📟 MongoDB:')}    ${chalk.greenBright(mongoStatus)} (${db})
${chalk.green('🕒 Started at:')} ${chalk.greenBright(new Date().toLocaleString())}
`;

        console.log(
          boxen(message.trim(), {
            padding: 1,
            margin: 1,
            borderColor: 'cyan',
            borderStyle: 'round',
            title: '🍳 Team 2 Fullstack Recipes',
            titleAlignment: 'center',
          }),
        );
      });
    });
  } else {
    // Simple logging for production
    console.log('🚀 FULLSTACK RECIPES BACKEND');
    console.log(`🌐 Server running on port ${port}`);
    console.log(`🔧 Mode: ${mode}`);
    console.log(`📟 MongoDB: ${mongoStatus} (${db})`);
    console.log(`🕒 Started at: ${new Date().toLocaleString()}`);
  }
};
