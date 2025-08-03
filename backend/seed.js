// seed.js
import mongoose from 'mongoose';
import Problem from './models/Problems.js';
import TestCase from './models/TestCase.js';
import dotenv from 'dotenv';

dotenv.config()

const MONGO_URL = process.env.MONGODB_URL; // Update accordingly

async function seedDatabase() {
 
    try{
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
    }catch(err){
      console.log('Error connecting database');
      console.error(err);
    }
    /*
    Problem.deleteMany({  })
  .then(result => {
    console.log(`Deleted ${result.deletedCount} documents.`);
  })
  .catch(err => {
    console.error("Error deleting documents:", err);
  });
   TestCase.deleteMany({  })
  .then(result => {
    console.log(`Deleted ${result.deletedCount} documents.`);
  })
  .catch(err => {
    console.error("Error deleting documents:", err);
  });

  */
    const problem = new Problem({
      title: 'Two Sum',
      description: 'Find indices of the two numbers such that they add up to a specific target.',
      statement :'You have been given a array of size N and a target K find two numbers from array that add to that target. If multiple such answer exists return any two. If no such answers exist return -1',
      example : ['input : 5 10\n1 3 4 6 7\noutput : 3 7\nexplanantion : 3 + 7 = 10'], 
      difficulty: 'Easy',
      tags: ['array', 'hashmap']
    });
    await problem.save();

    // Create test cases for this problem
    const testCases = [
      {
        problemId: problem._id,
        input: '4 9\n2 7 11 15',
        output: '2 7',
      },
      {
        problemId: problem._id,
        input: '3 6\n3 2 4',
        output: '2 4'
      }
    ];
  try{
    await TestCase.insertMany(testCases);
    console.log('Seed data inserted!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();
