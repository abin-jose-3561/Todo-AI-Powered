import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes';
import chatRoutes from './routes/chatRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
