const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("welcome to the Google API v2 by ByteMontan");
});

app.post("/api/forma", async (req, res) => {
  const CLIENT_ID =
    "797244964784-15gj8vhr56bg0s1f43rmkcdagv5ia69g.apps.googleusercontent.com";
  const CLEINT_SECRET = "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";
  const REDIRECT_URI = "https://developers.google.com/oauthplayground";
  const REFRESH_TOKEN =
    "1//049Gpn-VjBfvZCgYIARAAGAQSNwF-L9Ire8Na_-o0ekR4Sirw3R5cGSPCfFV49L3kE5s3ZyLr-pGSqJz0vJxhj7DsVSu22IBzSjs";
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const accessToken = await oAuth2Client.getAccessToken();
  let data = req.body;
  let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    auth: {
      type: "OAuth2",
      user: "zindazed@gmail.com",
      clientId: CLIENT_ID,
      clientSecret: CLEINT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
  console.log(`Recieved: ${data}`);

  let mailOptions = {
    from: `${data.name} <zindazed@gmail.com>`,
    to: "zindazed@gmail.com",
    subject: `${data.subject}`,
    html: `
    <p>Dear LuTreeCo</p>
    <p>${data.msg}</p>

    <p>Yours faithfully,</p>
    <p>${data.name}<br/>${data.number}</p>
    `,
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      res.send(error);
      console.log(`failed`);
    } else {
      res.send("Success");
      console.log(`sent successfully`);
    }
  });

  smtpTransport.close();
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`server starting at port ${PORT}`);
});
