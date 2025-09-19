const express = require('express');
const { body, validationResult } = require('express-validator');
const Habit = require('../models/Habit');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all habits for a user
router.get('/', protect, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).populate('user', 'username');
    res.status(200).json({
      status: 'success',
      results: habits.length,
      data: {
        habits
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new habit
router.post('/', [
  protect,
  body('name')
    .notEmpty()
    .withMessage('Habit name is required')
    .custom(async (value, { req }) => {
      const habit = await Habit.findOne({ name: value, user: req.user._id });
      if (habit) {
        throw new Error('You already have a habit with this name');
      }
    }),
  body('frequency')
    .isIn(['daily', 'weekly'])
    .withMessage('Frequency must be either daily or weekly')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, frequency, category } = req.body;

    const habit = await Habit.create({
      name,
      description,
      frequency,
      category,
      user: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: {
        habit
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a habit
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, description, frequency, category } = req.body;
    
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, description, frequency, category },
      { new: true, runValidators: true }
    );

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        habit
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a habit
router.delete('/:id', protect, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark habit as complete
router.post('/:id/complete', protect, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if already completed based on frequency
    let alreadyCompleted = false;
    
    if (habit.frequency === 'daily') {
      // For daily habits, check if completed today
      alreadyCompleted = habit.completions.some(completion => {
        const compDate = new Date(completion.date);
        compDate.setHours(0, 0, 0, 0);
        return compDate.getTime() === today.getTime() && completion.completed;
      });
    } else if (habit.frequency === 'weekly') {
      // For weekly habits, check if completed this week
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
      
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Saturday
      
      alreadyCompleted = habit.completions.some(completion => {
        const compDate = new Date(completion.date);
        return (
          compDate >= startOfWeek &&
          compDate <= endOfWeek &&
          completion.completed
        );
      });
    }

    if (alreadyCompleted) {
      return res.status(400).json({ 
        error: habit.frequency === 'daily' 
          ? 'Habit already completed today' 
          : 'Habit already completed this week' 
      });
    }

    // Add completion
    habit.completions.push({
      date: today,
      completed: true
    });

    // Calculate streak
    let streak = 0;
    let currentDate = new Date(today);
    const sortedCompletions = [...habit.completions]
      .filter(c => c.completed)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    for (let i = 0; i < sortedCompletions.length; i++) {
      const compDate = new Date(sortedCompletions[i].date);
      compDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(currentDate);
      expectedDate.setHours(0, 0, 0, 0);
      
      if (compDate.getTime() === expectedDate.getTime()) {
        streak++;
        
        // Move to previous day/week based on frequency
        if (habit.frequency === 'daily') {
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          currentDate.setDate(currentDate.getDate() - 7);
        }
      } else {
        break;
      }
    }
    
    habit.streak = streak;
    await habit.save();

    res.status(200).json({
      status: 'success',
      data: {
        habit
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 