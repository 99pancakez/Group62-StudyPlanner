const express = require('express');
const cors = require('cors');
const db = require('./src/database');
const courseRoutes = require('./src/routes/courseRoutes');
const historyRoutes = require('./src/routes/historyRoutes');
const qnaRoutes = require('./src/routes/qnaRoutes');
const programPlanRoutes = require('./src/routes/programPlanRoutes');
const combinationRoutes = require('./src/routes/combinationRoutes');

const argon2 = require('argon2');

// Initialize Express app 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/courses', courseRoutes);
app.use('/history', historyRoutes);
app.use('/qna', qnaRoutes);
app.use('/explorer', programPlanRoutes);
app.use('/combinations', combinationRoutes);

// Seed admin data
const seedAdminData = async () => {
  try {
    const { Admin } = db;
    const email = 'sonhoang.dau@rmit.edu.au';
    const password = 'son_admin_cs_2025';
    const adminName = 'Son Hoang Dau';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { admin_email: email } });
    if (!existingAdmin) {
      // Hash password
      const hashedPassword = await argon2.hash(password);
      
      // Create admin
      await Admin.create({
        admin_name: adminName,
        admin_email: email,
        password: hashedPassword
      });
      console.log('Admin seed data created successfully');
    } else {
      console.log('Admin already exists, skipping seeding');
    }
  } catch (error) {
    console.error('Error seeding admin data:', error);
  }
};

// Sync database and seed data
db.sync()
  .then(async () => {
    console.log('Database synced successfully');
    await seedAdminData();
  })
  .catch((error) => {
    console.error('Failed to sync database:', error);
    process.exit(1);
  });

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});