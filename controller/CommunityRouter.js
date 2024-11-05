const db = require('../config/database');

const getContacts = (req, res) => {
  const sql = 'SELECT id, name, phone_number, bio, photo FROM users';
  db.query(sql, (error, results) => {
      if (error) {
          console.error('Error fetching contacts:', error);
          return res.status(500).json({ message: 'Failed to fetch contacts' });
      }
      res.status(200).json(results);
  });
};

const createGroup = (req, res) => {
  const { group_name, group_description, members, creator_phone_number } = req.body;

  // Memeriksa apakah pembuat grup terdaftar di database
  const checkUserSql = 'SELECT phone_number FROM users WHERE phone_number = ?';
  db.query(checkUserSql, [creator_phone_number], (error, result) => {
      if (error || result.length === 0) {
          return res.status(400).json({ message: 'Invalid phone number or user not found.' });
      }

      const group_photo = req.file ? `groups/${req.file.filename}` : null;

      // Memasukkan grup baru
      const insertGroupSql = 'INSERT INTO groups (group_name, group_description, group_photo) VALUES (?, ?, ?)';
      db.query(insertGroupSql, [group_name, group_description, group_photo], (error, result) => {
          if (error) {
              console.error('Error creating group:', error);
              return res.status(500).json({ message: 'Failed to create group' });
          }

          const groupId = result.insertId;

          // Menambahkan pembuat grup ke anggota
          let uniqueMembers;
          try {
              // Pastikan `members` sudah berupa array jika diterima dalam bentuk JSON string
              const parsedMembers = typeof members === 'string' ? JSON.parse(members) : members;
              uniqueMembers = [...new Set([...parsedMembers, creator_phone_number])]; // Gabungkan dan hapus duplikat
          } catch (error) {
              console.error('Error parsing members:', error);
              return res.status(400).json({ message: 'Invalid members data format' });
          }

          // Memasukkan anggota baru ke dalam grup
          const insertMembersSql = 'INSERT INTO group_members (group_id, phone_number) VALUES ?';
          const memberValues = uniqueMembers.map(phone_number => [groupId, phone_number]);

          db.query(insertMembersSql, [memberValues], (error) => {
              if (error) {
                  console.error('Error adding members:', error);
                  return res.status(500).json({ message: 'Failed to add members' });
              }
              res.status(201).json({ message: 'Group created successfully with new members' });
          });
      });
  });
};

// Mengambil grup yang berisi pengguna yang login
const getGroupsForUser = (req, res) => {
  const { phone_number } = req.params;

  const sql = `
    SELECT g.group_id, g.group_name, g.group_description, g.group_photo
    FROM groups g
    JOIN group_members gm ON g.group_id = gm.group_id
    WHERE gm.phone_number = ?
  `;

  db.query(sql, [phone_number], (error, results) => {
    if (error) {
      console.error('Error fetching groups:', error);
      return res.status(500).json({ message: 'Failed to fetch groups' });
    }

    res.status(200).json(results);
  });
};

// Mengambil pesan berdasarkan `group_id`
const getGroupMessages = (req, res) => {
  const { groupId } = req.params;

  const sql = `
    SELECT gm.message, gm.sent_at, u.phone_number AS sender_phone, u.name AS sender_name, u.photo AS sender_photo
    FROM group_messages gm
    JOIN users u ON gm.sender_phone_number = u.phone_number
    WHERE gm.group_id = ?
    ORDER BY gm.sent_at ASC
  `;

  db.query(sql, [groupId], (error, results) => {
    if (error) {
      console.error('Error fetching group messages:', error);
      return res.status(500).json({ message: 'Failed to fetch messages' });
    }

    res.status(200).json(results);
  });
};


const sendMessageToGroup = (req, res) => {
  const { groupId, senderPhoneNumber, message } = req.body;

  const sql = `
    INSERT INTO group_messages (group_id, sender_phone_number, message, sent_at)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(sql, [groupId, senderPhoneNumber, message], (error, results) => {
    if (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({ message: 'Failed to send message' });
    }

    // Optionally, you can fetch all messages or just return a success message
    res.status(201).json({ message: 'Message sent successfully' });
  });
};



module.exports={ getContacts, getGroupsForUser, createGroup, getGroupMessages, sendMessageToGroup  };