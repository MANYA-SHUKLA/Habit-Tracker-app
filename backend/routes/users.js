const express = require('express');
const User = require('../models/User');
const Habit = require('../models/Habit');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Search users
router.get('/search', protect, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await User.find({
      $and: [
        { 
          $or: [
            { username: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        },
        { _id: { $ne: req.user._id } } // Exclude current user
      ]
    }).select('username email');

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow a user
router.post('/:id/follow', protect, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userToFollow._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    // Check if already following
    if (req.user.following.includes(userToFollow._id)) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Add to current user's following list
    req.user.following.push(userToFollow._id);
    await req.user.save();

    // Add to target user's followers list
    userToFollow.followers.push(req.user._id);
    await userToFollow.save();

    res.status(200).json({
      status: 'success',
      message: `You are now following ${userToFollow.username}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unfollow a user
router.post('/:id/unfollow', protect, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    
    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if actually following
    if (!req.user.following.includes(userToUnfollow._id)) {
      return res.status(400).json({ error: 'Not following this user' });
    }

    // Remove from current user's following list
    req.user.following = req.user.following.filter(
      id => id.toString() !== userToUnfollow._id.toString()
    );
    await req.user.save();

    // Remove from target user's followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user._id.toString()
    );
    await userToUnfollow.save();

    res.status(200).json({
      status: 'success',
      message: `You have unfollowed ${userToUnfollow.username}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get friends activity
router.get('/activity', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('following');
    
    // Get habits of followed users with recent completions
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const habits = await Habit.find({
      user: { $in: user.following },
      updatedAt: { $gte: sevenDaysAgo }
    })
    .populate('user', 'username')
    .sort({ updatedAt: -1 })
    .limit(20);

    // Get completion data for each habit
    const activities = await Promise.all(
      habits.map(async (habit) => {
        const completedToday = habit.completions.some(completion => {
          const compDate = new Date(completion.date);
          const today = new Date();
          return (
            compDate.getDate() === today.getDate() &&
            compDate.getMonth() === today.getMonth() &&
            compDate.getFullYear() === today.getFullYear() &&
            completion.completed
          );
        });
        
        return {
          _id: habit._id,
          name: habit.name,
          user: habit.user,
          streak: habit.streak,
          completedToday,
          updatedAt: habit.updatedAt
        };
      })
    );

    res.status(200).json({
      status: 'success',
      results: activities.length,
      data: {
        activities
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;