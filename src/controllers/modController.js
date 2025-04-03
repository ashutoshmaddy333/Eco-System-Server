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

        // Fetch the user and ensure required fields are present
        const user = await User.findById(userId).select(
            'city state pincode gender phoneNumber lastName firstName isApproved'
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if required fields are present
        const requiredFields = ['city', 'state', 'pincode', 'gender', 'phoneNumber', 'lastName', 'firstName'];
        const missingFields = requiredFields.filter((field) => !user[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User profile is incomplete',
                missingFields,
            });
        }

        // Validate the action
        if (action !== 'approve' && action !== 'reject') {
            return res.status(400).json({
                success: false,
                message: 'Invalid action. Use "approve" or "reject"',
            });
        }

        // Update the user's approval status
        user.isApproved = action === 'approve';
        await user.save();

        res.status(200).json({
            success: true,
            message: `Profile ${action}ed successfully`,
            data: {
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                isApproved: user.isApproved,
            },
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
<<<<<<< HEAD
};
=======

    // Find the listing
    const listing = await ListingModel.findById(listingId)
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      })
    }

    // Update status based on action
    if (action === "approve") {
      listing.status = "active"
    } else if (action === "reject") {
      listing.status = "inactive"
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "approve" or "reject"',
      })
    }

    await listing.save()

    // Create notification for the listing owner
    const Notification = require("../models/Notification")
    await Notification.createNotification({
      user: listing.user,
      type: action === "approve" ? "listing_approved" : "listing_rejected",
      content: `Your ${listingType} listing has been ${action === "approve" ? "approved" : "rejected"}`,
      relatedEntity: {
        entityId: listing._id,
        type: "Listing",
      },
    })

    res.status(200).json({
      success: true,
      message: `Listing ${action}d successfully`,
      data: listing,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing listing",
      error: error.message,
    })
  }
}

// Bulk approve or reject listings
exports.bulkApproveOrRejectListings = async (req, res) => {
  try {
    const { listingIds, listingTypes, action } = req.body

    if (
      !listingIds ||
      !listingTypes ||
      !action ||
      !Array.isArray(listingIds) ||
      !Array.isArray(listingTypes) ||
      listingIds.length !== listingTypes.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid listing IDs, types arrays, and action are required",
      })
    }

    const results = {
      total: listingIds.length,
      processed: 0,
      failed: 0,
      notifications: 0,
    }

    const Notification = require("../models/Notification")

    // Process each listing
    for (let i = 0; i < listingIds.length; i++) {
      try {
        const listingId = listingIds[i]
        const listingType = listingTypes[i]

        // Get the appropriate model
        const ListingModel = {
          product: require("../models/ProductListing"),
          service: require("../models/ServiceListing"),
          job: require("../models/JobListing"),
          matrimony: require("../models/MatrimonyListing"),
        }[listingType]

        if (!ListingModel) continue

        // Find and update the listing
        const listing = await ListingModel.findById(listingId)
        if (!listing) continue

        // Update status based on action
        listing.status = action === "approve" ? "active" : "inactive"
        await listing.save()
        results.processed++

        // Create notification
        await Notification.createNotification({
          user: listing.user,
          type: action === "approve" ? "listing_approved" : "listing_rejected",
          content: `Your ${listingType} listing has been ${action === "approve" ? "approved" : "rejected"}`,
          relatedEntity: {
            entityId: listing._id,
            type: "Listing",
          },
        })
        results.notifications++
      } catch (error) {
        results.failed++
        console.error(`Error processing listing ${i}:`, error)
      }
    }

    res.status(200).json({
      success: true,
      message: `Processed ${results.processed} out of ${results.total} listings`,
      results,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing bulk listings",
      error: error.message,
    })
  }
}

// Add this new function after bulkApproveOrRejectListings

// @desc    Get all listing IDs for bulk operations
// @route   GET /api/mod/listings/all-ids
exports.getAllListingIds = async (req, res) => {
  try {
    const type = req.query.type || "all" // 'all', 'product', 'service', 'job', 'matrimony'

    // Define models to query based on type
    const modelsToQuery =
      type === "all"
        ? [
            { model: require("../models/ProductListing"), name: "product" },
            { model: require("../models/ServiceListing"), name: "service" },
            { model: require("../models/JobListing"), name: "job" },
            { model: require("../models/MatrimonyListing"), name: "matrimony" },
          ]
        : [
            {
              model: require(`../models/${type.charAt(0).toUpperCase() + type.slice(1)}Listing`),
              name: type,
            },
          ]

    // Get IDs from each model
    const results = await Promise.all(
      modelsToQuery.map(async ({ model, name }) => {
        const items = await model.find().select("_id")
        return {
          type: name,
          ids: items.map((item) => item._id.toString()),
        }
      }),
    )

    // Combine results
    const allIds = {}
    results.forEach((result) => {
      allIds[result.type] = result.ids
    })

    res.status(200).json({
      success: true,
      data: type === "all" ? allIds : allIds[type],
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching listing IDs",
      error: error.message,
    })
  }
}

>>>>>>> 5487b44 (all set)
