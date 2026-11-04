UKRAGRO. Requires Node.js 18+.
  node server.js        then open http://localhost:3000
Optional environment variables:
  ADMIN_EMAIL=you@example.com          who becomes admin (default: first registered user)
  LIQPAY_PUBLIC_KEY / LIQPAY_PRIVATE_KEY   enable online card payment (LiqPay)
  BASE_URL=https://your-domain.ua      public address, needed for LiqPay callbacks
  PORT=3000
Data is stored in data/db.json. Back it up. Use HTTPS when you deploy.

EMAIL (orders go to romanbaraban509@gmail.com):
  1. Google Account > Security > turn on 2-Step Verification.
  2. Google Account > Security > App passwords > create one (16 characters).
  3. Paste it into "smtpPass" in config.json and restart the server.
ADMIN: log in at /account.html with the username and password from config.json. Change that password before publishing the site.
