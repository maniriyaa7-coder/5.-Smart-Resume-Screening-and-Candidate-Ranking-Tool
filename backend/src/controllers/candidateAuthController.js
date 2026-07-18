import Candidate from '../models/Candidate.js';
import {
  generateTokenPair,
  setTokenCookies,
  clearTokenCookies,
  verifyRefreshToken,
} from '../utils/jwt.js';

/**
 * @desc    Register new candidate
 * @route   POST /api/auth/candidate/register
 * @access  Public
 */
export const registerCandidate = async (req, res, next) => {
  try {
    const { fullName, email, password, phoneNumber, college, skills, currentLocation } = req.body;
    console.log(`[REGISTRATION] Attempting registration for email: ${email}`);

    // Check if candidate already exists
    const existingCandidate = await Candidate.findOne({ email });
    console.log(`[REGISTRATION] Existing user check: ${existingCandidate ? 'Found' : 'Not Found'}`);
    
    if (existingCandidate) {
      console.log(`[REGISTRATION] Registration failed: Email ${email} already registered`);
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create candidate
    const candidate = await Candidate.create({
      fullName,
      email,
      password,
      phoneNumber,
      college,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      currentLocation,
      role: 'candidate', // Explicitly specify candidate role for unified model
    });
    console.log(`[REGISTRATION] Candidate successfully created in DB: ${candidate._id}`);

    // Generate tokens
    console.log('[REGISTRATION] Generating JWT tokens...');
    const { accessToken, refreshToken } = generateTokenPair(candidate._id, 'candidate');
    console.log('[REGISTRATION] Tokens generated successfully');

    // Save refresh token to database
    candidate.refreshToken = refreshToken;
    await candidate.save();

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken, false);

    console.log('[REGISTRATION] Returning successful response (201)');
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: candidate.toSafeObject(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(`[REGISTRATION] Error occurred during candidate registration: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Login candidate
 * @route   POST /api/auth/candidate/login
 * @access  Public
 */
export const loginCandidate = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    console.log(`[LOGIN] Candidate login request received for email: ${email}`);

    // Find candidate and include password field
    const candidate = await Candidate.findOne({ email }).select('+password');
    console.log(`[LOGIN] User lookup result: ${candidate ? 'Found' : 'Not Found'}`);

    if (!candidate) {
      console.log('[LOGIN] Login failed: User not found in DB');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.log(`[LOGIN] Stored hashed password: ${candidate.password}`);

    // Check if candidate is active
    if (!candidate.isActive) {
      console.log('[LOGIN] Login failed: Account is inactive');
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact support.',
      });
    }

    // Verify password
    const isPasswordValid = await candidate.comparePassword(password);
    console.log(`[LOGIN] Password validation (bcrypt.compare) result: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log('[LOGIN] Login failed: Incorrect password');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login
    candidate.lastLogin = new Date();

    // Generate tokens
    console.log('[LOGIN] Generating JWT token pair...');
    const { accessToken, refreshToken } = generateTokenPair(candidate._id, 'candidate');
    console.log('[LOGIN] Tokens generated successfully');

    // Save refresh token to database
    candidate.refreshToken = refreshToken;
    await candidate.save();

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken, rememberMe);

    console.log('[LOGIN] Returning successful response (200)');
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: candidate.toSafeObject(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(`[LOGIN] Error occurred during candidate login: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Logout candidate
 * @route   POST /api/auth/candidate/logout
 * @access  Private
 */
export const logoutCandidate = async (req, res, next) => {
  try {
    // Clear refresh token from database
    if (req.user) {
      await Candidate.findByIdAndUpdate(req.user._id, {
        refreshToken: null,
      });
    }

    // Clear cookies
    clearTokenCookies(res);

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get candidate profile
 * @route   GET /api/auth/candidate/profile
 * @access  Private
 */
export const getCandidateProfile = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.user._id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: candidate.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update candidate profile
 * @route   PUT /api/auth/candidate/profile
 * @access  Private
 */
export const updateCandidateProfile = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, college, skills, currentLocation } = req.body;

    const candidate = await Candidate.findById(req.user._id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }

    // Update fields
    if (fullName) candidate.fullName = fullName;
    if (phoneNumber) candidate.phoneNumber = phoneNumber;
    if (college) candidate.college = college;
    if (skills) {
      candidate.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    }
    if (currentLocation) candidate.currentLocation = currentLocation;

    await candidate.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: candidate.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};
