const express = require('express');
const { body, validationResult } = require('express-validator');
const Todo = require('../models/Todo');
const { auth } = require('../middleware/auth');

const router = express.Router();


router.use(auth);


router.get('/', async (req, res) => {
  try {
    let todos;
    if (req.user.role === 'admin') {
      todos = await Todo.find().populate('user', 'username email');
    } else {
      todos = await Todo.find({ user: req.user.userId });
    }
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/', [
  body('title').isLength({ min: 1, max: 100 }),
  body('category').isIn(['Urgent', 'Non-Urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, dueDate, category } = req.body;

    const todo = new Todo({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      category,
      user: req.user.userId
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.put('/:id', [
  body('title').optional().isLength({ min: 1, max: 100 }),
  body('category').optional().isIn(['Urgent', 'Non-Urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    
    if (req.user.role !== 'admin' && todo.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates = req.body;
    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }

    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    
    if (req.user.role !== 'admin' && todo.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;