const express = require('express');
const cors = require('cors');
const connectDB = require('../db.js');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

app.use(cors(
    {
        origin: ["https://confess-data-tool-eu.vercel.app"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    }
))

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    totalTurnover: {
        type: Number,
        default: 0
    },
    totalCapex: {
        type: Number,
        default: 0
    },
    totalOpex: {
        type: Number,
        default: 0
    },
    totalActivity: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const Admin = mongoose.model('Admin', adminSchema);

const Assessment = mongoose.model('Assessment', new mongoose.Schema({
    examName: String,
    examCategory: String,
    language: String,
    questions: [
        {
            questionID: String,
            question: String,
            questionType: String,
            questionCategory: String,
            nextQuestions: String,
            nextQIfSkipped: String,
            requireForEvaluation: { type: Boolean, default: true },
            disclaimer: String,
            alertText: String,
            notifytext: String,
            notifynottext: String,
            options: [String]
        }
    ]
}));

const resultSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true
    },
    examCategory: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [{
        questionID: String,
        questionCategory: String,
        questionType: String,
        answer: [String],
        requireForEvaluation: Boolean,
        isCorrect: Boolean
    }],
    score: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Result = mongoose.model('Result', resultSchema);

// POST route to register a user
app.post('/api/users/register', async (req, res) => {
    const { name, email, password, companyName } = req.body;
    const role = "users"
    if (!name || !email || !password || !companyName) {
        return res.status(400).send('Name, Email, and Password are required');
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, role, email, companyName, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// POST route to login a user
app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and Password are required');
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Email is not registered');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Error during login:", error);  // Detailed error logging
        res.status(500).send('Server error');
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// PUT user
app.put('/api/users/:email', async (req, res) => {
    const email = req.params.email;
    const { name, companyName } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.name = name || user.name;
        user.companyName = companyName || user.companyName;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


app.get('/api/admin', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});



// POST route to register a Admin
app.post('/api/admin/register', async (req, res) => {
    const { name, email, password } = req.body;
    const role = "admin"
    if (!name || !email || !password) {
        return res.status(400).send('Name, Email, and Password are required');
    }
    try {
        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        // Create a new user with the plain password
        const newUser = new Admin({ name, role, email, password });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// POST route to login a Admin

app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and Password are required');
    }
    try {
        const user = await Admin.findOne({ email });
        if (!user) {
            return res.status(400).send('Email is not registered');
        }
        if (password !== user.password) {  // Directly comparing plain text passwords
            return res.status(400).send('Invalid password');
        }
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Error during login:", error);  // Detailed error logging
        res.status(500).send('Server error');
    }
});




// POST route to create an assessment
app.post('/api/assessments', async (req, res) => {
    const { examName, examCategory, language } = req.body; // Include language in the destructuring
    if (!examName || !examCategory || !language) {
        return res.status(400).send('Exam Name, Exam Category, and Language are required');
    }
    try {
        const newAssessment = new Assessment({ examName, examCategory, language }); // Include language in the new assessment
        await newAssessment.save();
        res.status(201).send('Assessment created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// GET route to fetch all assessments
app.get('/api/assessments', async (req, res) => {
    try {
        const assessments = await Assessment.find();
        res.status(200).json(assessments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// DELETE route to delete an assessment
app.delete('/api/assessments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Assessment.findByIdAndDelete(id);
        res.status(200).send('Assessment deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// GET route to fetch an assessment by ID
app.get('/api/assessments/:id', async (req, res) => {
    console.log(`Fetching assessment with ID: ${req.params.id}`);
    try {
        const assessment = await Assessment.findById(req.params.id);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        res.json(assessment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT route to update an assessment
app.put('/api/assessments/:id', async (req, res) => {
    const { examName, examCategory, language } = req.body;
    try {
        const assessment = await Assessment.findByIdAndUpdate(
            req.params.id,
            { examName, examCategory, language },
            { new: true }
        );
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        res.json(assessment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST route to add a new question to an assessment
app.post('/api/assessments/:assessmentId/questions', async (req, res) => {
    const { assessmentId } = req.params;
    const { questionID, question, questionType, questionCategory, nextQuestions, nextQIfSkipped, requireForEvaluation, disclaimer, alertText, notifytext, notifynottext, options } = req.body;

    if (!questionID || !question || !questionType || !questionCategory) {
        return res.status(400).send('Question ID, Question, Question Type, and Question Category are required');
    }

    try {
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) {
            return res.status(404).send('Assessment not found');
        }

        const newQuestion = { questionID, question, questionType, questionCategory, nextQuestions, nextQIfSkipped, requireForEvaluation, disclaimer, alertText, notifytext, notifynottext, options };
        assessment.questions.push(newQuestion);

        await assessment.save();

        res.status(201).json({
            message: 'Question added successfully',
            examName: assessment.examName,
            examCategory: assessment.examCategory,
            question: newQuestion
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// PUT route to update a question in an assessment
app.put('/api/assessments/:assessmentId/questions/:questionId', async (req, res) => {
    const { assessmentId, questionId } = req.params;
    const { questionID, question, questionType, questionCategory, nextQuestions, nextQIfSkipped, requireForEvaluation, disclaimer, alertText, notifytext, notifynottext, options } = req.body;

    if (!questionID || !question || !questionType || !questionCategory) {
        return res.status(400).send('Question ID, Question, Question Type, and Question Category are required');
    }

    try {
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) {
            return res.status(404).send('Assessment not found');
        }

        const questionIndex = assessment.questions.findIndex(q => q._id.toString() === questionId);
        if (questionIndex === -1) {
            return res.status(404).send('Question not found');
        }

        assessment.questions[questionIndex] = { _id: questionId, questionID, question, questionType, questionCategory, nextQuestions, nextQIfSkipped, requireForEvaluation, disclaimer, alertText, notifytext, notifynottext, options };
        await assessment.save();

        res.status(200).json({
            message: 'Question updated successfully',
            examName: assessment.examName,
            examCategory: assessment.examCategory,
            question: assessment.questions[questionIndex]
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// DELETE route to delete a question from an assessment
app.delete('/api/assessments/:assessmentId/questions/:questionId', async (req, res) => {
    const { assessmentId, questionId } = req.params;

    try {
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) {
            return res.status(404).send('Assessment not found');
        }

        assessment.questions = assessment.questions.filter(q => q._id.toString() !== questionId);
        await assessment.save();

        res.status(200).send('Question deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// GET route to fetch questions for a specific assessment by exam name
app.get('/api/assessments/:examName/questions', async (req, res) => {
    const { examName } = req.params;
    try {
        const assessment = await Assessment.findOne({ examName });
        if (!assessment) {
            return res.status(404).send('Assessment not found');
        }
        res.json(assessment.questions.sort((a, b) => a.questionID - b.questionID)); // Ensure questions are sorted by QuestionID
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


app.post('/api/results/submitresults', async (req, res) => {
    const { examName, examCategory, userEmail, answers, questionIDs } = req.body;
    console.log('Received request:', req.body);

    if (!examName || !examCategory || !userEmail || !Array.isArray(answers) || !Array.isArray(questionIDs)) {
        console.error('Invalid request data');
        return res.status(400).json({ message: 'Exam Name, Exam Category, User Email, Answers array, and Question IDs array are required' });
    }

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            console.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        const assessment = await Assessment.findOne({ examName });
        if (!assessment) {
            console.error('Assessment not found');
            return res.status(404).json({ message: 'Assessment not found' });
        }

        // Initialize totals to update the user's schema
        let totalTurnover = 0;
        let totalCapex = 0;
        let totalOpex = 0;
        let totalActivity = 1;

        // Process the answers to ensure they are in the correct format
        const results = answers.map(answer => {
            const question = assessment.questions.find(q => q.questionID === answer.questionID);
            if (question) {
                // Update totals based on question category
                if (answer.questionCategory === 'Turnover') {
                    totalTurnover += parseFloat(answer.answer) || 0;
                } else if (answer.questionCategory === 'CapEx') {
                    totalCapex += parseFloat(answer.answer) || 0;
                } else if (answer.questionCategory === 'OpEx') {
                    totalOpex += parseFloat(answer.answer) || 0;
                }

                return {
                    questionID: answer.questionID,
                    questionCategory: answer.questionCategory,
                    questionType: answer.questionType,
                    requireForEvaluation: answer.requireForEvaluation,
                    answer: answer.answer ? (answer.answer.includes(';') ? answer.answer.split(';').map(a => a.trim()) : [answer.answer.trim()]) : ''
                };
            } else {
                console.error(`Question with ID ${answer.questionID} not found in the assessment.`);
                return {
                    questionID: answer.questionID,
                    questionCategory: answer.questionCategory,
                    answer: answer.answer ? (answer.answer.includes(';') ? answer.answer.split(';').map(a => a.trim()) : [answer.answer.trim()]) : ''
                };
            }
        });

        // Update the user's totals
        user.totalTurnover += totalTurnover;
        user.totalCapex += totalCapex;
        user.totalOpex += totalOpex;
        user.totalActivity += totalActivity;

        await user.save();

        const result = new Result({
            examName,
            examCategory,
            userId: user._id,
            questionIDs,
            answers: results,
        });

        await result.save();

        res.status(201).json({
            message: 'Result saved successfully',
            examName: result.examName,
            examCategory: result.examCategory,
            userId: result.userId,
            questionIDs: result.questionIDs,
            answers: result.answers
        });
    } catch (error) {
        console.error('Error saving results:', error);
        res.status(500).json({ message: 'Error saving results' });
    }
});




app.get('/api/results', async (req, res) => {
    try {
        const results = await Result.find().populate('userId', 'name email');

        // Extract unique users
        const users = results.reduce((acc, result) => {
            const { name, email } = result.userId;
            if (!acc.find(user => user.email === email)) {
                acc.push({ name, email });
            }
            return acc;
        }, []);

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
    }
});

// Add route to fetch exams for a specific user by email
app.get('/api/results/:email/exams', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const results = await Result.find({ userId: user._id });

        res.json(results);
    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).send('Server error');
    }
});


// GET route to fetch answers for a specific result by its _id
app.get('/api/results/:examName/:examCategory/answers', async (req, res) => {
    const { examName, examCategory } = req.params;
    const { _id } = req.query; // Get _id from query parameters

    if (!_id) {
        return res.status(400).json({ message: 'No _id provided' });
    }

    try {
        // Fetch the assessment to get questions
        const assessment = await Assessment.findOne({ examName, examCategory });
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        // Fetch the result based on _id
        const result = await Result.findById(_id);
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        // Map the answers to include the questions
        const questionAnswers = result.answers.map(answer => {
            const question = assessment.questions.find(q => q.questionID === answer.questionID)?.question;
            return {
                question: question || null,
                answer: answer.answer.length > 0 ? answer.answer.join(', ') : null
            };
        }).filter(qa => qa.question && qa.answer); // Filter out entries with null values

        res.json(questionAnswers);
    } catch (error) {
        console.error('Error fetching answers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});




app.get('/api/dashboard', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).send('Email query parameter is required');
        }

        // Find the user with the given email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Find results that reference this user
        const results = await Result.find({ userId: user._id }).populate('userId');

        // Extract unique users and full results
        const users = results.reduce((acc, result) => {
            const { name, email, companyName } = result.userId;
            if (!acc.users.find(user => user.email === email)) {
                acc.users.push({ name, email, companyName });
            }
            acc.results.push(result);
            return acc;
        }, { users: [], results: [] });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
    }
});


// PUT route to update user financial data
app.put('/api/users/:id/financial-data', async (req, res) => {
    const { id } = req.params;
    const { totalTurnover, totalCapex, totalOpex, totalActivity } = req.body;

    console.log("Received PUT request with data:", { id, totalTurnover, totalCapex, totalOpex, totalActivity });

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { totalTurnover, totalCapex, totalOpex, totalActivity },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});





app.get('/', (req, res) => {
    res.status(200).send('Server is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("App is running on port 5000");
});
