import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Local JSON Database Setup
const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Ensure data folder and db.json exist
function initDb() {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const defaults = {
      rateSettings: {
        mode: 'auto',
        customRate: 235.00
      },
      inquiries: [],
      loginLogs: [],
      customers: [],
      customerLogins: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(defaults, null, 2));
  }
}

initDb();

// Helper functions to read and write database
function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const data = JSON.parse(raw);
    if (!data.loginLogs) data.loginLogs = [];
    if (!data.customers) data.customers = [];
    if (!data.customerLogins) data.customerLogins = [];
    if (!data.settings) {
      data.settings = {
        announcement: "PURE SILVER GUARANTEE • 100% HALLMARKED CERTIFICATE WITH EVERY PURCHASE",
        storeHours: "Monday - Saturday: 10:30 AM - 8:30 PM",
        telephone: "+91 94406 35761",
        address: "Governorpet, Vijayawada, Andhra Pradesh 520002"
      };
    }
    if (!data.appointments) data.appointments = [];
    return data;
  } catch (err) {
    console.error('Failed to read db file, recreating...', err);
    initDb();
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write to db file', err);
  }
}

/* --- API ROUTERS --- */

// Admin Authentication (Simple and secure session validation token mock)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'saivedha123') {
    const db = readDb();
    
    // Log the successful login attempt
    const newLog = {
      username: username,
      ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    
    db.loginLogs = db.loginLogs || [];
    db.loginLogs.unshift(newLog); // Push to the top of the feed
    writeDb(db);
    
    res.json({ success: true, token: 'saivedha-session-token-9440635761' });
  } else {
    res.status(401).json({ success: false, error: 'Incorrect username or password' });
  }
});

/* --- CUSTOMER ACCOUNT & LOGS API --- */

// POST to register a new customer account
app.post('/api/customer/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Required fields (name, email, password) missing' });
  }
  
  const db = readDb();
  
  // Check if email already registered
  const exists = db.customers.find(c => c.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ success: false, error: 'An account is already registered with this email address' });
  }
  
  const newCustomer = {
    id: 'cust_' + Date.now(),
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    password, // Stored directly for showroom sandbox
    joined: new Date().toLocaleDateString('en-IN')
  };
  
  db.customers.push(newCustomer);
  writeDb(db);
  
  res.json({ success: true, message: 'Your account has been registered successfully!' });
});

// POST to authenticate a customer and log the access session
app.post('/api/customer/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }
  
  const db = readDb();
  const customer = db.customers.find(c => c.email.toLowerCase() === email.toLowerCase() && c.password === password);
  if (!customer) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }
  
  // Create customer audit log entry
  const loginLog = {
    name: customer.name,
    email: customer.email,
    ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
    date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };
  
  db.customerLogins.unshift(loginLog); // Add to beginning
  writeDb(db);
  
  res.json({
    success: true,
    token: 'cust-session-' + customer.id,
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      joined: customer.joined
    }
  });
});

// GET all customer login logs (authorized with admin token)
app.get('/api/admin/customer-logins', (req, res) => {
  const token = req.headers.authorization;
  if (token !== 'saivedha-session-token-9440635761') {
    return res.status(403).json({ success: false, error: 'Unauthorized administrative action' });
  }
  
  const db = readDb();
  res.json(db.customerLogins || []);
});

// GET all login logs (requires authorization)
app.get('/api/logins', (req, res) => {
  const token = req.headers.authorization;
  if (token !== 'saivedha-session-token-9440635761') {
    return res.status(403).json({ success: false, error: 'Unauthorized administrative action' });
  }
  
  const db = readDb();
  res.json(db.loginLogs || []);
});

// GET active silver rate details
app.get('/api/rate', async (req, res) => {
  const db = readDb();
  
  if (db.rateSettings.mode === 'manual') {
    return res.json(db.rateSettings);
  }
  
  // If auto, fetch live data from server-side to prevent client CORS blocks
  try {
    const silverRes = await fetch('https://api.gold-api.com/price/XAG');
    const silverData = await silverRes.json();
    const xagUsd = parseFloat(silverData.price);
    
    const fxRes = await fetch('https://open.er-api.com/v6/latest/USD');
    const fxData = await fxRes.json();
    const usdInr = parseFloat(fxData.rates.INR);
    
    if (!isNaN(xagUsd) && !isNaN(usdInr)) {
      const globalRatePerGramInr = (xagUsd * usdInr) / 31.1034768;
      const indiaRetailRate = parseFloat((globalRatePerGramInr * 1.31395).toFixed(2));
      
      return res.json({
        mode: 'auto',
        rate: indiaRetailRate
      });
    }
  } catch (err) {
    console.error('Server-side live price fetch failed:', err);
  }
  
  // Fallback if APIs are offline
  res.json({
    mode: 'auto',
    rate: db.rateSettings.customRate
  });
});

// POST to update silver rate details (requires authorization)
app.post('/api/rate', (req, res) => {
  const token = req.headers.authorization;
  if (token !== 'saivedha-session-token-9440635761') {
    return res.status(403).json({ success: false, error: 'Unauthorized administrative action' });
  }
  
  const { mode, customRate } = req.body;
  const db = readDb();
  
  if (mode) db.rateSettings.mode = mode;
  if (typeof customRate === 'number') db.rateSettings.customRate = customRate;
  
  writeDb(db);
  res.json({ success: true, rateSettings: db.rateSettings });
});

// POST to submit a showroom inquiry from contact form
app.post('/api/inquiry', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Required fields missing' });
  }
  
  const db = readDb();
  const newInquiry = {
    id: 'inq_' + Date.now(),
    name,
    email,
    subject: subject || 'Showroom Inquiry',
    message,
    date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };
  
  db.inquiries.unshift(newInquiry); // Add to the top
  writeDb(db);
  res.json({ success: true, inquiry: newInquiry });
});

// GET all submitted inquiries (requires authorization)
app.get('/api/inquiries', (req, res) => {
  const token = req.headers.authorization;
  if (token !== 'saivedha-session-token-9440635761') {
    return res.status(403).json({ success: false, error: 'Unauthorized administrative action' });
  }
  
  const db = readDb();
  res.json(db.inquiries);
});

// GET CMS settings details
app.get('/api/settings', (req, res) => {
  const db = readDb();
  res.json(db.settings);
});

// POST to update CMS settings (requires authorization)
app.post('/api/settings', (req, res) => {
  const token = req.headers.authorization;
  if (token !== 'saivedha-session-token-9440635761') {
    return res.status(403).json({ success: false, error: 'Unauthorized administrative action' });
  }
  
  const { announcement, storeHours, telephone, address } = req.body;
  const db = readDb();
  
  db.settings = {
    announcement: announcement !== undefined ? announcement : db.settings.announcement,
    storeHours: storeHours !== undefined ? storeHours : db.settings.storeHours,
    telephone: telephone !== undefined ? telephone : db.settings.telephone,
    address: address !== undefined ? address : db.settings.address
  };
  
  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

// GET all VIP showroom visit appointments (requires authorization)
app.get('/api/appointments', (req, res) => {
  const token = req.headers.authorization;
  if (token !== 'saivedha-session-token-9440635761') {
    return res.status(403).json({ success: false, error: 'Unauthorized administrative action' });
  }
  
  const db = readDb();
  res.json(db.appointments || []);
});

// POST to submit a new VIP appointment booking
app.post('/api/appointment', (req, res) => {
  const { name, email, phone, date, timeSlot, collection } = req.body;
  if (!name || !email || !phone || !date || !timeSlot) {
    return res.status(400).json({ success: false, error: 'Required fields missing for scheduling appointment' });
  }
  
  const db = readDb();
  const newAppointment = {
    id: 'apt_' + Date.now(),
    name,
    email,
    phone,
    date,
    timeSlot,
    collection: collection || 'General Showroom Viewing',
    status: 'Pending Approved',
    createdDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };
  
  if (!db.appointments) db.appointments = [];
  db.appointments.unshift(newAppointment);
  writeDb(db);
  res.json({ success: true, appointment: newAppointment });
});

// GET to verify a certificate number
app.get('/api/verify-certificate', (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ success: false, error: 'Certificate code is required' });
  }
  const normalized = code.trim().toUpperCase();
  
  const mockCertificates = {
    'SV-999-FINE': {
      certificateNumber: 'SV-999-FINE',
      purity: '99.9% Fine Pure Silver',
      itemCategory: 'Silver Coins & Pooja Idols',
      hallmarkBadge: 'BIS 999 Hallmark Licensed',
      issueDate: 'July 12, 2026',
      status: 'Active Verified'
    },
    'SV-925-STERLING': {
      certificateNumber: 'SV-925-STERLING',
      purity: '92.5% Sterling Luxury Silver',
      itemCategory: 'Luxury Tableware & Designer Jewelry',
      hallmarkBadge: 'BIS 925 Hallmark Licensed',
      issueDate: 'July 14, 2026',
      status: 'Active Verified'
    },
    'SV-800-POOJA': {
      certificateNumber: 'SV-800-POOJA',
      purity: '80.0% Purity Pooja Ware',
      itemCategory: 'Traditional Diya & Harathi Holders',
      hallmarkBadge: 'BIS 800 Hallmark Licensed',
      issueDate: 'July 15, 2026',
      status: 'Active Verified'
    }
  };

  const cert = mockCertificates[normalized];
  if (cert) {
    res.json({ success: true, certificate: cert });
  } else {
    res.json({ success: false, error: 'Certificate code not found in hallmarking database.' });
  }
});

// Serve compiled static frontend assets in production mode
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Explicit page routing for clean URLs
  app.get('/admin', (req, res) => {
    res.sendFile(path.join(distPath, 'admin.html'));
  });
  app.get('/wishlist', (req, res) => {
    res.sendFile(path.join(distPath, 'wishlist.html'));
  });
  app.get('/cart', (req, res) => {
    res.sendFile(path.join(distPath, 'cart.html'));
  });
  app.get('/profile', (req, res) => {
    res.sendFile(path.join(distPath, 'profile.html'));
  });
  app.get('/antique', (req, res) => {
    res.sendFile(path.join(distPath, 'antique.html'));
  });
  app.get('/articles', (req, res) => {
    res.sendFile(path.join(distPath, 'articles.html'));
  });
  app.get('/womens', (req, res) => {
    res.sendFile(path.join(distPath, 'womens.html'));
  });
  app.get('/mens', (req, res) => {
    res.sendFile(path.join(distPath, 'mens.html'));
  });
  app.get('/gallery', (req, res) => {
    res.sendFile(path.join(distPath, 'gallery.html'));
  });
  app.get('/about', (req, res) => {
    res.sendFile(path.join(distPath, 'about.html'));
  });
  app.get('/contact', (req, res) => {
    res.sendFile(path.join(distPath, 'contact.html'));
  });
  app.get('/admin-price', (req, res) => {
    res.sendFile(path.join(distPath, 'admin-price.html'));
  });
  app.get('/admin-inquiries', (req, res) => {
    res.sendFile(path.join(distPath, 'admin-inquiries.html'));
  });
  app.get('/admin-customer-logins', (req, res) => {
    res.sendFile(path.join(distPath, 'admin-customer-logins.html'));
  });
  app.get('/admin-sessions', (req, res) => {
    res.sendFile(path.join(distPath, 'admin-sessions.html'));
  });
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`SaiVedha Server is actively running on port ${PORT}`);
});
