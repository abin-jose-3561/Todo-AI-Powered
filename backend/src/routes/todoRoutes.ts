import { Router } from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController';
import { validateTodo } from '../middleware/validationMiddleware';

const router = Router();

router.get('/', getTodos);
router.post('/', validateTodo, createTodo);
router.put('/:id', validateTodo, updateTodo);
router.delete('/:id', deleteTodo);

export default router;
