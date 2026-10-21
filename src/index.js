
require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const GoogleProvider = require('./servicer/provider');
const cors = require('cors');
const mongoose = require('mongoose');
const mongodb = require('./db/mongodb');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

// CORS
app.use(cors({
    // origin: 'https://lms-harshdepani.vercel.app',
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true
}));

// Static file
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body & Cookie parser
app.use(express.json());
app.use(cookieParser());

// Session setup will happen after MongoDB connects

// Passport setup will happen after MongoDB connects

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Google OAuth
// GoogleProvider.GoogleProvider();

// Socket.IO only on local
// if (!process.env.VERCEL) {
//     const createSocketIO = require('./servicer/socketIO');
//     createSocketIO();
// }

// Connect to MongoDB before starting the server
async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing in .env');
        }

        if (!process.env.SESSION_SECRET) {
            throw new Error('SESSION_SECRET is missing in .env');
        }

        await mongodb();

        console.log('MongoDB connected successfully');

        // Session with MongoStore
        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                client: mongoose.connection.getClient(),
                touchAfter: 24 * 3600
            })
        }));

        // Passport
        app.use(passport.initialize());
        app.use(passport.session());

        // Routes
        const routers1 = require('./routers/api/v2');
        app.use("/api/v2", routers1);

        // Home route
        app.get("/", (req, res) => {
            res.send("Welcome IN LMS Backend");
        });

        // module.exports = app;

        app.listen(process.env.PORT || 5000, () => {
            console.log(`this port started at ${process.env.PORT || 5000}`);
        });

    } catch (error) {
        console.error('❌ Backend startup failed:', error.message);
        process.exitCode = 1;
    }
}

startServer();



// require('dotenv').config()
// const path = require('path');
// const express = require('express');
// const app = express();
// const cookieParser = require('cookie-parser');
// const passport = require('passport');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const GoogleProvider = require('./servicer/provider');
// const cors = require('cors');
// const mongodb = require('./db/mongodb');

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger-output.json');

// // ✅ CORS
// app.use(cors({
//     // origin: 'https://lms-harshdepani.vercel.app',
//     origin: "http://localhost:5173",
//     optionsSuccessStatus: 200,
//     credentials: true
// }));

// // ✅ Static file
// app.use('/public', express.static(path.join(__dirname, 'public')));

// // ✅ Body & Cookie parser
// app.use(express.json());
// app.use(cookieParser());

// // ✅ Session with MongoStore
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//         mongoUrl: process.env.MONGODB_URI,
//         touchAfter: 24 * 3600
//     })
// }));

// // ✅ Passport
// app.use(passport.initialize());
// app.use(passport.session());

// // ✅ Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// // ✅ Google OAuth
// // GoogleProvider.GoogleProvider();

// // ✅ Socket.IO only on local
// // if (!process.env.VERCEL) {
// //     const createSocketIO = require('./servicer/socketIO');
// //     createSocketIO();
// // }

// // ✅ KEY FIX — await MongoDB on every request
// app.use(async (req, res, next) => {
//     try {
//         await mongodb(); // ✅ waits for connection before proceeding
//         next();
//     } catch (err) {
//         console.error('❌ MongoDB connection error:', err.message);
//         return res.status(503).json({
//             success: false,
//             message: "Database connection failed: " + err.message
//         });
//     }
// });

// // ✅ Routes — AFTER the mongodb middleware
// const routers1 = require('./routers/api/v2');
// app.use("/api/v2", routers1);

// // ✅ Home route
// app.get("/", (req, res) => {
//     res.send("Welcome IN LMS Backend");
// });

// // module.exports = app;

// app.listen(process.env.PORT, () => {
//     console.log(`this port started at ${process.env.PORT}`);

// })