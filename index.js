const express = require("express");
const ntpClient = require("ntp-client");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

app.use(express.static("public"));

app.get("/getDateTime", (req, res) => {
  ntpClient.getNetworkTime("ptbtime1.ptb.de", 123, (err, date) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Failed to fetch date and time from NTP server" });
    }

    const dateTimeString = date.toString();

    return res.json({ dateTime: dateTimeString });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
