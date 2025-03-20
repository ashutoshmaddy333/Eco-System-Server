const mongoose = require('mongoose');
const User = require('../models/User');
const Interest = require('../models/Interest'); // Assuming you have an Interest model
const Product = require('../models/ProductListing'); // Assuming you have a Product model

// Get all profiles for moderation (paginated)
exports.getProfilesForModeration = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        if (page < 1) {
            return res.status(400).json({
                success: false,
                message: 'Page number must be a positive integer',
            });
        }

        const limit = 100; // 100 items per page
        const skip = (page - 1) * limit;

        const profiles = await User.find({ role: 'user' })
            .skip(skip)
            .limit(limit)
            .select('-password -otp -confirmPassword'); // Exclude sensitive fields

        res.status(200).json({
            success: true,
            data: profiles,
            page,
            limit,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profiles for moderation',
            error: error.message,
        });
    }
};

// Approve or reject a profile
exports.approveOrRejectProfile = async (req, res) => {
    try {
        const { userId, action } = req.body; // action: 'approve' or 'reject'

        // Validate input
        if (!userId || !action) {
            return res.status(400).json({
                success: false,
                message: 'User ID and action are required',
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid User ID',
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (action === 'approve') {
            user.isApproved = true;
        } else if (action === 'reject') {
            user.isApproved = false;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid action. Use "approve" or "reject"',
            });
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: `Profile ${action}ed successfully`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error approving/rejecting profile',
            error: error.message,
        });
    }
};

// Bulk approve or reject profiles
exports.bulkApproveOrRejectProfiles = async (req, res) => {
    try {
        const { userIds, action } = req.body; // action: 'approve' or 'reject'

        // Validate input
        if (!Array.isArray(userIds) || userIds.length === 0 || !action) {
            return res.status(400).json({
                success: false,
                message: 'User IDs (array) and action are required',
            });
        }

        // Validate each userId in the array
        const invalidIds = userIds.filter((id) => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid User IDs found in the array',
                invalidIds,
            });
        }

        const updateQuery = action === 'approve' ? { isApproved: true } : { isApproved: false };

        await User.updateMany({ _id: { $in: userIds } }, updateQuery);

        res.status(200).json({
            success: true,
            message: `Profiles ${action}ed in bulk successfully`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error performing bulk action',
            error: error.message,
        });
    }
};

// Get list of interests shown
exports.getInterests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100; // Default limit to 100 items per page
        const skip = (page - 1) * limit;

        const interests = await Interest.find({})
            .skip(skip)
            .limit(limit)
            .populate('userId', 'firstName lastName email') // Populate user details
            .populate('productId', 'name place quantity'); // Populate product details

        res.status(200).json({
            success: true,
            data: interests,
            page,
            limit,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching interests',
            error: error.message,
        });
    }
};

// Approve or reject an interest
exports.approveOrRejectInterest = async (req, res) => {
    try {
        const { interestId, action } = req.body; // action: 'approve' or 'reject'

        // Validate input
        if (!interestId || !action) {
            return res.status(400).json({
                success: false,
                message: 'Interest ID and action are required',
            });
        }

        if (!mongoose.Types.ObjectId.isValid(interestId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Interest ID',
            });
        }

        const interest = await Interest.findById(interestId);
        if (!interest) {
            return res.status(404).json({
                success: false,
                message: 'Interest not found',
            });
        }

        if (action === 'approve') {
            interest.isApproved = true;
        } else if (action === 'reject') {
            interest.isApproved = false;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid action. Use "approve" or "reject"',
            });
        }

        await interest.save();

        res.status(200).json({
            success: true,
            message: `Interest ${action}ed successfully`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error approving/rejecting interest',
            error: error.message,
        });
    }
};