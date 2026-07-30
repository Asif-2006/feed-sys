function blockTemplate(username, reason) {
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
                background:#c62828;
                color:white;
                text-align:center;
                padding:20px;
            }

            .content{
                padding:30px;
                color:#333;
                line-height:1.7;
            }

            .warning{
                background:#fdecea;
                border-left:5px solid #d32f2f;
                padding:15px;
                margin:20px 0;
            }

            .reason{
                background:#f8f9fa;
                border:1px solid #ddd;
                border-radius:6px;
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
                <h2>🚫 Account Blocked</h2>
            </div>

            <div class="content">

                <p>Hello <strong>${username}</strong>,</p>

                <p>
                    Your <strong>HexiNova</strong> account has been
                    <strong>blocked by an administrator</strong> due to a
                    violation of our Community Guidelines.
                </p>

                <div class="warning">
                    You are currently unable to access your account until
                    further notice.
                </div>

                <div class="reason">
                    <strong>Reason for Block:</strong><br><br>
                    ${reason}
                </div>

                <p>
                    If you believe this action was taken in error,
                    please contact the HexiNova support team for further
                    assistance.
                </p>

                <center>
                    <a href="#" class="button">
                        Contact Support
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

module.exports = blockTemplate;