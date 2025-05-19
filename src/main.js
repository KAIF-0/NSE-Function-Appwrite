import { Client, Users } from 'node-appwrite';
import { urlData } from './function/getUrlData.js';
import { fetchData } from './function/fetchData.js';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  const users = new Users(client);

  try {
    const response = await users.list();
    log(`Total users: ${response.total}`);
  } catch (err) {
    error('Could not list users: ' + err.message);
  }

  if (req.path === '/fetch') {
    const day = new Date().toLocaleString('en-US', { weekday: 'long' });
    const urls = await urlData(day);
    log(urls);
    await fetchData(urls).catch((err) => {
      log(err.message);
      // process.exit(1);
    });
    return res.json({
      success: true,
      message: 'Data successfully scraped and saved to data.txt!',
    });
  }

  return res.json({
    success: true,
    message: 'Hello! from NSE Automation Function!',
  });
};
