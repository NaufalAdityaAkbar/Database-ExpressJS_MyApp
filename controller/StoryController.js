// const db = require('../config/database');

// exports.addStory = (req, res) => {
//   const { phone_number, caption, media_url } = req.body;

//   const query = "INSERT INTO stories (phone_number, caption, media_url) VALUES (?, ?, ?)";
//   db.query(query, [phone_number, caption, media_url], (err, result) => {
//     if (err) return res.status(500).json({ message: "Failed to add story" });
//     res.status(201).json({ message: "Story added successfully" });
//   });
// };

// exports.getStories = (req, res) => {
//   const query = "SELECT * FROM stories ORDER BY created_at DESC";
//   db.query(query, (err, results) => {
//     if (err) return res.status(500).json({ message: "Failed to retrieve stories" });
//     res.json(results);
//   });
// };
// module.exports= {
//   addStory,
//   getstories
// };