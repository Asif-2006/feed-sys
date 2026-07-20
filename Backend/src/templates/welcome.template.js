function welcomeTemplate(username) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body{
                font-family: Arial, Helvetica, sans-serif;
                background:#f4f4f4;
                padding:30px;
            }

            .container{
                max-width:600px;
                margin:auto;
                background:#ffffff;
                border-radius:10px;
                overflow:hidden;
                box-shadow:0 4px 10px rgba(0,0,0,.1);
            }

            .header{
                background:#1976d2;
                color:white;
                text-align:center;
                padding:25px;
            }

            .content{
                padding:30px;
                color:#333;
                line-height:1.7;
            }

            .welcome{
                background:#e8f5e9;
                border-left:5px solid #4caf50;
                padding:15px;
                margin:20px 0;
            }

            ul{
                padding-left:20px;
            }

            li{
                margin-bottom:8px;
            }

            .button{
                display:inline-block;
                margin-top:20px;
                background:#1976d2;
                color:white;
                padding:12px 24px;
                text-decoration:none;
                border-radius:6px;
            }

            .footer{
                text-align:center;
                font-size:13px;
                color:#777;
                padding:20px;
                background:#fafafa;
            }
        </style>
    </head>

    <body>

        <div class="container">

            <div class="header">
                <h1>🎉 Welcome to HexiNova!</h1>
            </div>

            <div class="content">

                <p>Hello <strong>${username}</strong>,</p>

                <p>
                    Thank you for joining <strong>FeedSys</strong>! Your account
                    has been created successfully.
                </p>

                <div class="welcome">
                    🚀 You're all set to start sharing your moments and
                    connecting with the community.
                </div>

                <h3>What you can do next:</h3>

                <ul>
                    <li>Create and share posts.</li>
                    <li>Upload photos securely with AI-powered moderation.</li>
                    <li>Discover content from other users.</li>
                    <li>Build your profile and grow your network.</li>
                </ul>

                <p>
                    We're excited to have you with us and hope you enjoy your
                    experience on HexiNova.
                </p>

                <center>
                    <a href="#" class="button">
                        Explore FeedSys
                    </a>
                </center>

            </div>

            <div class="footer">
                © ${new Date().getFullYear()} FeedSys • Welcome aboard! <br>
                This is an automated email. Please do not reply.
            </div>

        </div>

    </body>
    </html>
    `;
}

module.exports = welcomeTemplate;