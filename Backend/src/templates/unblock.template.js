function unblockTemplate(username) {
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
                background:#2e7d32;
                color:white;
                text-align:center;
                padding:20px;
            }

            .content{
                padding:30px;
                color:#333;
                line-height:1.7;
            }

            .success{
                background:#e8f5e9;
                border-left:5px solid #2e7d32;
                padding:15px;
                margin:20px 0;
            }

            .footer{
                text-align:center;
                font-size:13px;
                color:#777;
                padding:20px;
                background:#fafafa;
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
        </style>
    </head>

    <body>

        <div class="container">

            <div class="header">
                <h2>✅ Account Unblocked</h2>
            </div>

            <div class="content">

                <p>Hello <strong>${username}</strong>,</p>

                <p>
                    Good news! Your <strong>HexiNova</strong> account has
                    been reviewed by our moderation team and is now
                    <strong>active again</strong>.
                </p>

                <div class="success">
                    You can now sign in and continue using all features of
                    your HexiNova account.
                </div>

                <p>
                    Please continue to follow our Community Guidelines to
                    help keep HexiNova a safe and respectful place for
                    everyone.
                </p>

                <center>
                    <a href="#" class="button">
                        Sign In
                    </a>
                </center>

            </div>

            <div class="footer">
                © ${new Date().getFullYear()} HexiNova • This is an automated email. Please do not reply.
            </div>

        </div>

    </body>
    </html>
    `;
}

module.exports = unblockTemplate;