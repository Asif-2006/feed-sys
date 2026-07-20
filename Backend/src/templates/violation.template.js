function violationTemplate(username, violations) {
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
                background:#d32f2f;
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
                background:#fff3cd;
                border-left:5px solid #ffc107;
                padding:15px;
                margin:20px 0;
            }

            ul{
                padding-left:20px;
            }

            li{
                margin-bottom:8px;
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
                <h2>⚠ Community Guidelines Violation</h2>
            </div>

            <div class="content">

                <p>Hello <strong>${username}</strong>,</p>

                <p>
                    We reviewed the image you attempted to upload to
                    <strong>HexiNova</strong>.
                </p>

                <div class="warning">
                    Our automated moderation system detected one or more
                    violations of our Community Guidelines.
                </div>

                <p><strong>Detected Violations:</strong></p>

                ${violations.map(v => `
    <div style="margin-bottom:20px;">
        <h4 style="margin:0;">
            ${v.type === "image" ? "🖼 Image" : "📝 Caption"}
        </h4>

        <ul>
            ${v.reasons.map(r => {

        if (typeof r === "string") {
            return `<li>${r}</li>`;
        }

        return `
        <li>
            <strong>Blocked Word:</strong> ${r.word}<br>
            <strong>Category:</strong> ${r.category}<br>
            <strong>Severity:</strong> ${r.severity}
        </li>
    `;

    }).join("")}
        </ul>
    </div>
`).join("")}

                <p>
                    Because of these violations, your post was
                    <strong>not published</strong>.
                </p>

                <p>
                    If you believe this was a mistake, you may upload a different
                    image that complies with our Community Guidelines.
                </p>

                <center>
                    <a href="#" class="button">
                        View Community Guidelines
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

module.exports = violationTemplate;