import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import roomRoutes from './routes/roomRoutes';
import answerRoutes from './routes/answerRoutes';
import commentRoutes from './routes/commentRoutes';
import questionRoutes from './routes/questionRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/rooms', roomRoutes);
app.use('/answers', answerRoutes);
app.use('/comments', commentRoutes);
app.use('/questions', questionRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API Running');
});

const PORT = process.env.PORT || 5000;
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('DB Connected');
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  })
  .catch((error) => {
    console.log('Failed DB Connection', error);
  });
