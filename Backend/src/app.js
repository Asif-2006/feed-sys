const express = require('express');
const cors = require('cors')
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth.routes')
const postRoutes = require("./routes/post.routes");
const blockedWordRoutes = require("./routes/blockedWord.routes");
const adminRoutes = require("./routes/admin.routes");


const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "https://feed-sys.vercel.app",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);
app.use(express.json())
app.use(cookieParser())

/**
 * - Authentication API's
*/
app.use('/api/auth', authRoutes);



/**
 * - Posts API's
*/

app.use("/api/posts", postRoutes);


/**
 * - Blocked Words
 */


app.use("/api/admin/blocked-words", blockedWordRoutes);



/**
 *  - Admin Panel
 */

app.use("/api/admin/user", adminRoutes);











module.exports = app;



