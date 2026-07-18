import User from '../models/User.js';
import {
  generateTokenPair,
  setTokenCookies,
  clearTokenCookies,
  verifyRefreshToken,
} from '../utils/jwt.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, company } = req.body;
    console.log(`[REGISTRATION] Attempting user registration for email: ${email}, role: ${role}`);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log(`[REGISTRATION] Existing user check: ${existingUser ? 'Found' : 'Not Found'}`);
    
    if (existingUser) {
      console.log(`[REGISTRATION] Registration failed: Email ${email} already registered`);
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create user
    const userData = {
      name,
      email,
      password,
      role,
    };

    if (role === 'recruiter' && company) {
      userData.company = company;
    }

    const user = await User.create(userData);
    console.log(`[REGISTRATION] User successfully created in DB: ${user._id}`);

    // Generate tokens
    console.log('[REGISTRATION] Generating JWT tokens...');
    const { accessToken, refreshToken } = generateTokenPair(user._id, user.role);
    console.log('[REGISTRATION] Tokens generated successfully');

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken, false);

    console.log('[REGISTRATION] Returning successful response (201)');
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.toSafeObject(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(`[REGISTRATION] Error occurred during user registration: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    console.log(`[LOGIN] User login request received for email: ${email}`);

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    console.log(`[LOGIN] User lookup result: ${user ? 'Found' : 'Not Found'}`);

    if (!user) {
      console.log('[LOGIN] Login failed: User not found in DB');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.log(`[LOGIN] Stored hashed password: ${user.password}`);

    // Check if user is active
    if (!user.isActive) {
      console.log('[LOGIN] Login failed: Account is inactive');
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact support.',
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    console.log(`[LOGIN] Password validation (bcrypt.compare) result: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log('[LOGIN] Login failed: Incorrect password');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate tokens
    console.log('[LOGIN] Generating JWT token pair...');
    const { accessToken, refreshToken } = generateTokenPair(user._id, user.role);
    console.log('[LOGIN] Tokens generated successfully');

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken, rememberMe);

    console.log('[LOGIN] Returning successful response (200)');
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toSafeObject(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(`[LOGIN] Error occurred during user login: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    // Clear refresh token from database
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
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
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: tokenFromBody } = req.body;
    const tokenFromCookie = req.cookies.refreshToken;

    const refreshToken = tokenFromBody || tokenFromCookie;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not provided',
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive',
      });
    }

    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(
      user._id,
      user.role
    );

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set new cookies
    setTokenCookies(res, accessToken, newRefreshToken, true);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify token
 * @route   GET /api/auth/verify
 * @access  Private
 */
export const verifyToken = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: {
        user: req.user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};
