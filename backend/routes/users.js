const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/User');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.put('/update', auth, async (req, res) => {
//   try {
//     const { userId, updateData } = req.body;
//     console.log(userId, updateData)
//     // Update the user information in the database
//     const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

//     res.json({ success: true, user: updatedUser });
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ success: false, message: 'Failed to update user information' });
//   }
// });

router.get('/teacher/students', auth, async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id);
    if (teacher.role !== 'teacher') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const students = await User.find({
      role: 'student',
      class_: teacher.teachesClass,
      section: teacher.teachesSection,
      orgId: teacher.orgId
    }).select('-password');

    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
});

router.get('/principal/teachers', auth, async (req, res) => {
  try {
    const principal = await User.findById(req.user.id);
    if (principal.role !== 'principal') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const teachers = await User.find({
      role: 'teacher',
      orgId: principal.orgId
    }).select('-password');
    console.log(teachers)
    res.json({ success: true, teachers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
});

router.put('/update/:id', auth, upload.single('image'), async (req, res) => {
  const userId = req.params.id;
  const { name, email, password, role, class_, section, teachesClass, teachesSection, orgId } = req.body;
  const image = req.file ? req.file.path : '';
  try {
    let updateData = { name, email, role, class_, section, teachesClass, teachesSection, orgId };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    if (image) {
      updateData.image = image;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
});

router.post('/verify-student/:id', auth, async (req, res) => {
  const teacherId = req.user.id;
  const studentId = req.params.id;

  try {
    const teacher = await User.findById(teacherId);
    const student = await User.findById(studentId);

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(403).json({ success: false, message: 'Only teachers can verify students' });
    }

    if (teacher.teachesClass !== student.class_ || teacher.teachesSection !== student.section || teacher.orgId !== student.orgId) {
      return res.status(403).json({ success: false, message: 'You can only verify students in your class and section' });
    }

    student.verified = true;
    await student.save();

    res.json({ success: true, message: 'Student verified successfully', student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to verify student' });
  }
});

router.post('/verify-teacher/:id', auth, async (req, res) => {
  const principalId = req.user.id;
  const teacherId = req.params.id;

  try {
    const principal = await User.findById(principalId);
    const teacher = await User.findById(teacherId);

    if (!principal || principal.role !== 'principal') {
      return res.status(403).json({ success: false, message: 'Only principals can verify teachers' });
    }

    if (principal.orgId !== teacher.orgId) {
      return res.status(403).json({ success: false, message: 'You can only verify teachers of your own org' });
    }

    teacher.verified = true;
    await teacher.save();

    res.json({ success: true, message: 'Teacher verified successfully', teacher });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to verify Teacher' });
  }
});


module.exports = router;
