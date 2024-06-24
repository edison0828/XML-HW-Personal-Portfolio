const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const xml2js = require("xml2js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/submit-form", (req, res) => {
  const { name, email, message } = req.body;
  // 創建 XML
  const builder = new xml2js.Builder();
  const xml = builder.buildObject({
    contact: {
      name: name,
      email: email,
      message: message,
    },
  });

  // 獲取當前台灣時間並格式化為 'YYYY-MM-DD_HH-mm-ss' 的格式
  const now = new Date();
  now.setHours(now.getHours() + 8); // 調整為台灣時間 (UTC+8)
  const formattedDateTime = now
    .toISOString()
    .replace(/T/, "_")
    .replace(/\..+/, "")
    .replace(/:/g, "-");

  const filename = `contact-${formattedDateTime}.xml`; // 創建基於時間的唯一文件名

  fs.writeFile(filename, xml, (err) => {
    if (err) throw err;
    console.log(`Data saved to ${filename}`);
  });

  res.send("Form submitted successfully!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
