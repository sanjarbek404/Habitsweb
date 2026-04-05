
// --- SERVER CODE (Run this with Node.js) ---
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Faqat frontendga ruxsat
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Xavfsizlik sarlavhalari
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json({ limit: '10mb' }));

// Logging Middleware (Sanitized)
// Faqat URL yo'lini chiqaradi, query parametrlarni (tokenlar bo'lishi mumkin) yashiradi
app.use((req, res, next) => {
  const safeUrl = req.url.split('?')[0];
  console.log(`[${new Date().toISOString()}] ${req.method} ${safeUrl}`);
  next();
});

// --- MODELS ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  badges: [{ type: String }],
  bio: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  hasSeenOnboarding: { type: Boolean, default: false }
}, { timestamps: true });

const habitschema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, default: 'Shaxsiy' },
  frequency: { type: String, default: 'Har kuni' },
  completedDates: [{ type: String }],
  streak: { type: Number, default: 0 }
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, default: 'O\'rta' },
  dueDate: Date,
  category: { type: String, default: 'Ish' }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true, maxlength: 500 },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Habit = mongoose.model('Habit', habitschema);
const Task = mongoose.model('Task', taskSchema);
const Message = mongoose.model('Message', messageSchema);

// --- HELPER FUNCTIONS ---
const formatData = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  delete obj.password; // Parol hech qachon qaytmasligi kerak
  return obj;
};

// --- ROUTES ---

app.get('/', (req, res) => {
  res.send('habits.uz API is running secure & fast!');
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Barcha maydonlarni to'ldiring" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Parol kamida 6 belgidan iborat bo'lishi kerak" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email allaqachon ro'yxatdan o'tgan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await user.save();
    // Logda user ma'lumotlarini chiqarmaslik uchun console.log o'chirildi

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.status(201).json({ token, user: formatData(user) });
  } catch (err) {
    // Faqat xato xabarini chiqaramiz, to'liq ob'ektni emas (chunki unda query bo'lishi mumkin)
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email va parolni kiriting" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "Email yoki parol noto'g'ri" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Email yoki parol noto'g'ri" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.json({ token, user: formatData(user) });
  } catch (err) {
    // Xavfsizlik uchun logni o'chiramiz yoki faqat umumiy xabar qoldiramiz
    // console.error("Login Error:", err.message); 
    res.status(500).json({ message: "Server xatosi" });
  }
});

// Middleware
const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: "Token yo'q" });

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Foydalanuvchi topilmadi" });

    req.user = { id: user._id.toString(), ...formatData(user) };
    next();
  } catch (err) {
    // Token xatoligini konsolga chiqarmaymiz, shunchaki 401 qaytaramiz
    res.status(401).json({ message: "Token yaroqsiz" });
  }
};

// Protected Routes
app.get('/api/data', auth, async (req, res) => {
  try {
    const [user, habits, tasks] = await Promise.all([
      User.findById(req.user.id),
      Habit.find({ userId: req.user.id }),
      Task.find({ userId: req.user.id }).sort({ createdAt: -1 })
    ]);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      user: formatData(user),
      habits: habits.map(formatData),
      tasks: tasks.map(formatData)
    });
  } catch (err) {
    console.error("Data Fetch Error:", err.message);
    res.status(500).json({ message: "Ma'lumotlarni yuklashda xatolik" });
  }
});

app.put('/api/users/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.json(formatData(user));
  } catch (err) {
    console.error("Profile Update Error:", err.message);
    res.status(500).json({ message: "Profilni yangilashda xatolik" });
  }
});

// habits & Tasks (Standard CRUD)
app.post('/api/habits', auth, async (req, res) => {
  try {
    const habit = new Habit({ ...req.body, userId: req.user.id });
    await habit.save();
    res.json(formatData(habit));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/habits/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    res.json(formatData(habit));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/habits/:id', auth, async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/tasks', auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, userId: req.user.id });
    await task.save();
    res.json(formatData(task));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    res.json(formatData(task));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/tasks/:id', auth, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 }).limit(20).select('username points level avatarUrl');
    res.json(users.map(u => ({
      id: u._id.toString(),
      username: u.username,
      points: u.points,
      level: u.level,
      avatarUrl: u.avatarUrl
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Chat
app.get('/api/chat', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'username avatarUrl level');

    const formatted = messages.reverse().map(msg => ({
      id: msg._id.toString(),
      text: msg.text,
      userId: msg.userId?._id.toString() || 'deleted',
      username: msg.userId?.username || 'O\'chirilgan foydalanuvchi',
      userAvatar: msg.userId?.avatarUrl,
      userLevel: msg.userId?.level || 0,
      createdAt: msg.createdAt
    }));
    res.json(formatted);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/chat', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: "Xabar bo'sh" });
    if (text.length > 500) return res.status(400).json({ message: "Xabar juda uzun" });

    const message = new Message({ userId: req.user.id, text: text.trim() });
    await message.save();
    await message.populate('userId', 'username avatarUrl level');

    res.status(201).json({
      id: message._id.toString(),
      text: message.text,
      userId: message.userId._id.toString(),
      username: message.userId.username,
      userAvatar: message.userId.avatarUrl,
      userLevel: message.userId.level,
      createdAt: message.createdAt
    });
  } catch (err) {
    console.error("Chat Error:", err.message);
    res.status(500).json({ message: "Xabar yuborishda xatolik" });
  }
});

// DB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/habitsuz';

mongoose.connect(MONGO_URI)
  .then(() => {
    // Faqat muvaffaqiyatli ulanish haqida xabar, URI ni chiqarmaymiz
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    // Xatolik bo'lsa faqat umumiy xabar, ulanish stringini yashiramiz
    console.error('❌ MongoDB Connection Error');
    process.exit(1);
  });
