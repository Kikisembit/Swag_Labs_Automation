require('dotenv').config();

const USERS = {
  standard: {
    username: process.env.STANDARD_USER,
    password: process.env.PASSWORD,
  },
  locked_out: {
    username: process.env.LOCKED_OUT_USER,
    password: process.env.PASSWORD,
  },
  problem: {
    username: process.env.PROBLEM_USER,
    password: process.env.PASSWORD,
  },
  performance_glitch: {
    username: process.env.PERFORMANCE_GLITCH_USER,
    password: process.env.PASSWORD,
  },
  error: {
    username: process.env.ERROR_USER,
    password: process.env.PASSWORD,
  },
  visual: {
    username: process.env.VISUAL_USER,
    password: process.env.PASSWORD,
  },
};

module.exports = { USERS };
