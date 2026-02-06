const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const driveRoutes = require('./routes/drive.routes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/drive', driveRoutes);


app.get('/', (req, res) => {
  res.send('Placement Portal API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
