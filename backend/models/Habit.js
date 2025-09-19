const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly'],
    default: 'daily'
  },
  category: {
    type: String,
    trim: true,
    maxlength: 30
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completions: [{
    date: {
      type: Date,
      default: Date.now
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  streak: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Prevent duplicate habits for the same user
habitSchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Habit', habitSchema);