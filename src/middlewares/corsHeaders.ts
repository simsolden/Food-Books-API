// Add headers
export const setHeaders = (req: any, res: any, next: any) => {
  const acceptedOrigins = [process.env.WEBSITE_URL, process.env.MY_OTHER_IP_ADDRESS, process.env.MY_LOCAL_IP_ADDRESS];

  // Website you wish to allow to connect
  acceptedOrigins.includes(req.headers.origin) && res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
};
