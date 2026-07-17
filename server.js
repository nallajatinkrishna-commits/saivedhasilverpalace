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
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

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
    if (!data.products) data.products = [];
    if (data.products.length === 0) {
      data.products = [
        {
          id: "ant-1",
          title: "Pure Silver Bottle & Glass Set",
          category: "antique",
          price: "Net Wt: 1.4 kg",
          images: ["assets/images/silver_bottleset.png"],
          description: "An exquisite royal beverage set featuring a heavy, floral-engraved pure silver bottle accompanied by four matching silver stemmed chalice glasses. Ideal for luxury hosting.",
          detail: "This limited heritage beverage set is created from heavy-gauge certified pure silver. Features intricate hand-engraved floral designs. Includes a 1-litre silver bottle and four matching stemmed chalice glasses. Weighs approximately 1.4 kg, hallmarked, and delivered in a velvet lined presentation chest."
        },
        {
          id: "ant-2",
          title: "Pure Silver Lakshmi Deepams (Pair)",
          category: "antique",
          price: "Net Wt: 280g",
          images: ["assets/images/silver_deepams.png"],
          description: "A divine pair of oil lamps featuring detailed engravings of Goddess Lakshmi. Handcrafted to bring prosperity and auspicious glow to your pooja mandir.",
          detail: "Certified pure silver lamps, weighing approximately 280g for the pair. Highly detailed repoussé work of Goddess Lakshmi sitting on a lotus base. Ideal for daily prayers, wedding gifts, and festive occasions."
        },
        {
          id: "ant-3",
          title: "Antique Nakshi Pure Silver Electric Bedside Lamp",
          category: "antique",
          price: "Net Wt: 620g",
          images: ["assets/images/silver_electric_lamp.jpg"],
          description: "A stunning combination of vintage aesthetics and modern utility, featuring detailed Nakshi relief panels of peacocks and creepers, pre-wired for soft lighting.",
          detail: "Crafted in 92.5 Sterling Silver, weighing approximately 620g (silver content only). Features hand-crafted Nakshi artwork panels depicting traditional forest scenes. Wired with high-quality LED fittings, standard socket, and toggle switch. Includes certificate of purity."
        },
        {
          id: "ant-4",
          title: "Antique Nakshi Pure Silver Peacock Standing Lamps (Pair)",
          category: "antique",
          price: "Net Wt: 1450g",
          images: ["assets/images/silver_peacock_diya.jpg"],
          description: "A majestic set of two tall standing lamps, topped with highly detailed peacock finials, standing as a testament to royal temple craftsmanship.",
          detail: "Crafted in premium pure silver, standing 12 inches tall, weighing 1.45 kg for the pair. Features highly intricate hand-carved peacock accents, tiered oil wells, and a solid circular base with floral Nakshi designs."
        },
        {
          id: "ant-5",
          title: "Antique Pure Silver Geometric Cutout Ice Bucket & Tongs Set",
          category: "antique",
          price: "Net Wt: 310g",
          images: ["assets/images/silver_ice_bucket.jpg"],
          description: "A modern luxury item featuring intricate geometric cutouts on a heavy pure silver frame, complete with matching silver ice tongs.",
          detail: "Pure silver construction, weighing 310g. Sleek, contemporary geometric patterns, with a removable glass liner for easy cleaning. The matching silver tongs feature a clean modern design. Certified pure silver with BIS hallmark."
        },
        {
          id: "ant-6",
          title: "Pure Silver Ludo Board Set",
          category: "antique",
          price: "Net Wt: 1.95 kg",
          images: ["assets/images/silver_ludo.png"],
          description: "A luxurious handcrafted Ludo board game featuring a heavy solid silver frame with elaborate floral carvings and colorful playing grids.",
          detail: "Weighing approximately 1.95 kg. The frame features traditional Indian repoussé artwork depicting leaves and flowers. The board itself is decorated with premium high-gloss colors over a pure silver structure. Includes silver coins and dice."
        },
        {
          id: "ant-7",
          title: "Antique Silver Tea Set",
          category: "antique",
          price: "Net Wt: 2.2 kg",
          images: ["assets/images/antique_tea_set.jpg"],
          description: "A royal five-piece antique silver tea service set with hand-chased floral scrollwork and elegant ebony handles.",
          detail: "This luxury heritage tea set is crafted from heavy-gauge certified pure silver. Includes a teapot, sugar bowl, milk jug, and a matching serving tray. Features intricate hand-engraved royal floral patterns. Weighs approximately 2.2 kg, hallmarked, and delivered in a velvet lined presentation chest."
        },
        {
          id: "ant-8",
          title: "Antique Silver Urli Bowl",
          category: "antique",
          price: "Net Wt: 1.5 kg",
          images: ["assets/images/antique_urli.png"],
          description: "A traditional footed urli bowl featuring ornate Nakshi carvings, ideal for floating flowers and candles.",
          detail: "A majestic traditional pure silver urli bowl, hand-carved with detailed peacock patterns along the rim and supported by three elegant lion-head feet. Stand out as an exquisite heritage ornament. Weighs approximately 1.5 kg, hallmarked, and polished to a rich antique patina."
        },
        {
          id: "ant-9",
          title: "Antique Silver Lamp",
          category: "antique",
          price: "Net Wt: 980g",
          images: ["assets/images/antique_lamp.jpg"],
          description: "A grand traditional standing silver lamp featuring a detailed peacock finial and ornate tiered oil wells.",
          detail: "Standing 1.5 feet tall, this pure silver lamp represents divinity and fine craftsmanship. Handcrafted by master silversmiths with intricate floral carvings on the base and stem, topped with a majestic five-wick oil container. Weighs approximately 980g, hallmarked."
        },
        {
          id: "ant-10",
          title: "Silver Filigree Box",
          category: "antique",
          price: "Net Wt: 480g",
          images: ["assets/images/filigree_box.png"],
          description: "A delicate hand-crafted silver box in fine filigree wire work, perfect for storing precious heirlooms.",
          detail: "Crafted from pure sterling silver (92.5) by master filigree artisans from Karimnagar. Every detail is created using microscopic silver wire scrolls soldered onto a solid silver frame. Features a velvet interior and clasp. Weighs approximately 480g."
        },
        {
          id: "sil-1",
          title: "Handcrafted Nakshi Kalash",
          category: "silver",
          price: "Net Wt: 480g",
          images: ["assets/images/silver_kalash.png"],
          description: "A heavy-gauge pure silver Kalash pot featuring detailed hand-engraved Nakshi figures of dancers and traditional floral bands.",
          detail: "Crafted by senior master artisans, this traditional pooja Kalash features elaborate repoussé carvings of dancer motifs and floral borders. Hallmarked pure silver. Weight: 480g."
        },
        {
          id: "sil-2",
          title: "Pure Silver Ram Sita Darbar",
          category: "silver",
          price: "Net Wt: 550g",
          images: ["assets/images/silver_ramdarbar.png"],
          description: "Elegantly carved pure silver Sri Ram Darbar set featuring Rama, Sita, Lakshmana, and Hanuman under a divine Prabhavali arch.",
          detail: "This spiritual Ram Darbar idol features detailed carvings of Lord Rama, Goddess Sita, Lakshmana, and Lord Hanuman seated under a divine Prabhavali archway. Hallmarked pure silver. Weight: 550g."
        },
        {
          id: "sil-3",
          title: "Royal Nakshi Dessert Set",
          category: "silver",
          price: "Net Wt: 1.8 kg",
          images: ["assets/images/silver_dinnerset.png"],
          description: "A luxurious 13-piece silver serving set featuring 6 intricately carved octagonal dessert bowls, 6 matching spoons, and a hand-engraved serving tray.",
          detail: "This premium serving set includes 6 octagonal dessert bowls, 6 matching spoons, and a large rectangular serving tray. Features heavy floral Nakshi borders and high-polish finish. Hallmarked pure silver. Weight: 1.8 kg."
        },
        {
          id: "sil-4",
          title: "Antique Silver Long Kundulu",
          category: "silver",
          price: "Net Wt: 1.1 kg",
          images: ["assets/images/silver_kundulu.png"],
          description: "A majestic pair of traditional tall Samai temple lamps featuring detailed floral carvings on the stem and royal peacock crown finials.",
          detail: "Standing 1.5 feet tall, this pair of traditional Samai temple lamps features detailed floral carvings on the pedestal stem and a royal peacock finial. Hallmarked pure silver. Weight: 1.1 kg the pair."
        },
        {
          id: "sil-5",
          title: "Pure Silver Ram Mandir Replica",
          category: "silver",
          price: "Net Wt: 2.1 kg",
          images: ["assets/images/silver_rammandir.png"],
          description: "A detailed architectural model of the historic Ram Mandir temple, handcrafted in certified pure silver on an engraved pedestal with elephant legs.",
          detail: "This magnificent heritage replica is handcrafted from premium certified pure silver. Every dome, pillar, carving, and flag of the historic Ram Mandir temple is meticulously detailed. Seated on a heavy, hand-engraved silver pedestal base with royal elephant support legs. An auspicious masterpiece for prestigious home showrooms and pooja rooms. Weight: 2.1 kg."
        },
        {
          id: "sil-6",
          title: "Pure Silver Gomukhi Abhisheka Set",
          category: "silver",
          price: "Net Wt: 950g",
          images: ["assets/images/silver_gomukhi_slide1.jpg", "assets/images/silver_gomukhi_slide2.jpg"],
          description: "A traditional pure silver Abhishekam set featuring a Gomukhi lota (spouted pot) on a pedestal inside a footed Nakshi urli bowl.",
          detail: "This sacred Abhishekam set features a spouted Gomukhi lota pot placed on a central pillar pedestal, seated inside a matching three-footed Urli bowl. Every surface is hand-embossed with intricate floral patterns. Perfect for pouring holy water/milk over deities in daily pooja or festive rituals, where the water flows continuously from the spout. Hallmarked pure silver. Weight: 950g."
        },
        {
          id: "sil-7",
          title: "Pure Silver Nakshi Serving Box",
          category: "silver",
          price: "Net Wt: 680g",
          images: ["assets/images/silver_box_slide1.jpg", "assets/images/silver_box_slide2.jpg"],
          description: "A royal serving and dry fruit box handcrafted in pure silver with fine Nakshi carvings, a scalloped rim, and matching lid.",
          detail: "This premium serving set features a rectangular serving box with four inner compartments. Intricate hand-carvings of peacocks and creepers, with a lid that has a peacock-shaped pull knob. Hallmarked pure silver. Weight: 680g."
        },
        {
          id: "men-1",
          title: "Chased Royal Silver Kada",
          category: "mens",
          price: "Net Wt: 80g",
          images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop"],
          description: "Thick solid pure silver kada bracelet with hand-engraved line texture. Weighs over 80g.",
          detail: "A classic heavy solid kada for men, crafted in certified pure silver with hand-chased concentric lines and rounded terminals. Comfortable design for regular wear. Hallmarked pure silver."
        },
        {
          id: "men-2",
          title: "Interlocked Silver Chain",
          category: "mens",
          price: "Net Wt: 75g",
          images: ["assets/images/plain_silver_chain.png"],
          description: "Classic link-interlocking curb style silver chain with heavy lobster claw clasp.",
          detail: "Traditional heavy curb chain in sterling silver. Smooth flat links with diamond-cut bevels for maximum brilliance and high strength. BIS certified 92.5 hallmark."
        },
        {
          id: "men-3",
          title: "Classic Signet Silver Ring",
          category: "mens",
          price: "Net Wt: 12g",
          images: ["assets/images/plain_silver_ring.png"],
          description: "Engraved signet-style silver ring with textured border details. Sleek and manly.",
          detail: "Polished rectangular flat signet face with oxidised scrollwork on the shoulders. Smooth comfort fit inner shank. Certified sterling silver."
        },
        {
          id: "men-4",
          title: "Heavy Curb Silver Bracelet",
          category: "mens",
          price: "Net Wt: 55g",
          images: ["assets/images/silver_bracelet.png"],
          description: "Thick solid sterling silver curb-link bracelet, highly polished with secure clasp. Strong design.",
          detail: "A classic link statement bracelet for men. Made from solid sterling silver with custom heavy box-locking mechanism and safety latch. Hallmarked."
        },
        {
          id: "wom-1",
          title: "Royal Ghungroo Ankle Strap",
          category: "womens",
          price: "Net Wt: 180g",
          images: ["assets/images/silver_ankle_strap_1.png"],
          description: "Heavy bridal silver ankle straps with sweet chiming ghungroos and traditional clasps. 100% pure silver, no gold coating.",
          detail: "Weighs approximately 180 grams. Made of pure 92.5 hallmarked sterling silver, features custom locking clasp and sturdy silver rings connection. 100% plain silver with no gold coating."
        },
        {
          id: "wom-2",
          title: "Heritage Carved Ankle Strap",
          category: "womens",
          price: "Net Wt: 95g",
          images: ["assets/images/silver_ankle_strap_2.png"],
          description: "A sleek, semi-oxidized silver ankle strap with detailed heritage motifs. Combines retro charm with premium design. Plain silver only.",
          detail: "A lighter, contemporary piece weighing 95 grams. Crafted with high quality plain silver and delicate carvings that match both ethnic and fusion wear. Absolutely no gold coating."
        },
        {
          id: "wom-3",
          title: "Traditional Silver Bichiya Pair",
          category: "womens",
          price: "Net Wt: 10g",
          images: ["assets/images/plain_silver_ring.png"],
          description: "Adjustable dual-ring toe ring (bichiya) set featuring floral motifs and a bright silver finish. An essential bride ornament.",
          detail: "Premium 99% pure silver toe rings designed for regular wear. Hand-engraved using timeless die patterns, nickel-free and skin friendly."
        },
        {
          id: "wom-4",
          title: "Royal Nakshi Gilt Purse",
          category: "womens",
          price: "Net Wt: 740g",
          images: ["assets/images/silver_purse_slide1.png", "assets/images/silver_purse_slide2.jpg"],
          description: "An ornate pure silver bridal clutch, hand-gilded in 24K gold with intricate Nakshi carvings and premium settings.",
          detail: "This heirloom-grade bridal bag is crafted from pure silver, heavily gilded in 24K gold. Features elaborate hand-chased Nakshi artwork showing mythological figures, framed with rubies and emeralds, and a matching gold-gilded handle. Weight: 740g."
        },
        {
          id: "wom-5",
          title: "Premium Floral Nakshi Round Silver Purse",
          category: "womens",
          price: "Net Wt: 520g",
          images: ["assets/images/silver_round_purse.jpg"],
          description: "A luxurious round bridal clutch handcrafted in pure silver with fine floral Nakshi carvings and a sleek gold-tone ring handle.",
          detail: "This modern round bridal purse is handcrafted from premium certified pure silver. It features detailed hand-carved floral Nakshi engravings on both sides, a checkered pattern running down the middle with a central rose motif, and a polished gold-tone circular ring handle. Perfect for weddings and festive occasions. Hallmarked pure silver. Weight: 520g."
        },
        {
          id: "wom-6",
          title: "Antique Nakshi Silver Bridal Clutch with Gemstones",
          category: "womens",
          price: "Net Wt: 680g",
          images: ["assets/images/silver_gemstone_clutch.jpg"],
          description: "A luxurious oval bridal clutch handcrafted in antique pure silver with leaf Nakshi engravings, top crystal clasp, and red gemstones.",
          detail: "This magnificent oval bridal clutch is handcrafted from premium certified pure silver with an antique oxidized finish. It features detailed leaf and floral Nakshi carvings fanning out across both sides, contrasted against a textured dotted background. Complete with a polished gold-tone arched handle, a top gold-tone clasp set with a brilliant crystal, and two small red drop-shaped gemstones set in silver frames on both sides of the leaf patterns. Perfect for weddings and festive styling. Hallmarked pure silver. Weight: 680g."
        }
      ];
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    }
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

// Image Upload Endpoint
app.post('/api/products/upload-image', (req, res) => {
  const { fileName, fileData } = req.body;
  if (!fileName || !fileData) {
    return res.status(400).json({ success: false, error: 'Missing file name or data' });
  }

  try {
    const base64Data = fileData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    const ext = path.extname(fileName) || '.jpg';
    const uniqueName = `uploaded_${Date.now()}${ext}`;

    const srcPath = path.join(__dirname, 'assets', 'images', uniqueName);
    const distPath = path.join(__dirname, 'dist', 'assets', 'images', uniqueName);

    // Save to source folder
    fs.mkdirSync(path.dirname(srcPath), { recursive: true });
    fs.writeFileSync(srcPath, buffer);

    // Save to dist folder if dist exists
    const distImgDir = path.dirname(distPath);
    if (fs.existsSync(distImgDir) || fs.existsSync(path.join(__dirname, 'dist'))) {
      fs.mkdirSync(distImgDir, { recursive: true });
      fs.writeFileSync(distPath, buffer);
    }

    res.json({ success: true, imagePath: `assets/images/${uniqueName}` });
  } catch (err) {
    console.error('Image upload failed:', err);
    res.status(500).json({ success: false, error: 'Failed to save image on server.' });
  }
});

// Product Catalog Manager Endpoints
app.get('/api/products', (req, res) => {
  const db = readDb();
  res.json(db.products || []);
});

app.post('/api/products/add', (req, res) => {
  const { title, category, price, images, description, detail } = req.body;
  if (!title || !category || !price || !images || !description) {
    return res.status(400).json({ success: false, error: 'Missing required product fields.' });
  }
  
  const db = readDb();
  const newProduct = {
    id: Date.now().toString(),
    title,
    category,
    price,
    images: Array.isArray(images) ? images : [images],
    description,
    detail: detail || ''
  };
  
  db.products = db.products || [];
  db.products.push(newProduct);
  writeDb(db);
  
  res.json({ success: true, product: newProduct });
});

app.post('/api/products/delete', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, error: 'Missing product ID.' });
  }
  
  const db = readDb();
  db.products = db.products || [];
  const initialLength = db.products.length;
  db.products = db.products.filter(p => p.id !== id);
  
  if (db.products.length === initialLength) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }
  
  writeDb(db);
  res.json({ success: true });
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

// GET to list all gallery images dynamically
app.get('/api/gallery-images', (req, res) => {
  const imagesDir = path.join(__dirname, 'assets', 'images');
  if (!fs.existsSync(imagesDir)) {
    return res.json({ success: true, images: [] });
  }
  try {
    const files = fs.readdirSync(imagesDir);
    // Filter only image files (jpg, jpeg, png, gif, webp)
    const images = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
    res.json({ success: true, images });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve compiled static frontend assets in production mode
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Serve the source assets folder under /assets to resolve uncompiled data-bs-img paths in Quick View
  app.use('/assets', express.static(path.join(__dirname, 'assets')));
  
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
  app.get('/admin-products', (req, res) => {
    res.sendFile(path.join(distPath, 'admin-products.html'));
  });
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`SaiVedha Server is actively running on port ${PORT}`);
  });
}

export default app;
