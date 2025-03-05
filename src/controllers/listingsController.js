const ProductListing = require('../models/ProductListing');
const ServiceListing = require('../models/ServiceListing');
const JobListing = require('../models/JobListing');
const MatrimonyListing = require('../models/MatrimonyListing');

// Mapping of listing types to their respective models
const ListingModels = {
    product: ProductListing,
    service: ServiceListing,
    job: JobListing,
    matrimony: MatrimonyListing
};

// @desc    Create a new listing
// @route   POST /api/listings/:type
exports.createListing = async (req, res) => {
    try {
        const { type } = req.params;
        const listingModel = ListingModels[type];

        if (!listingModel) {
            return res.status(400).json({
                success: false,
                message: 'Invalid listing type'
            });
        }

        // Add user from authentication middleware
        req.body.user = req.user.id;

        const listing = new listingModel(req.body);
        await listing.save();

        res.status(201).json({
            success: true,
            data: listing
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating listing',
            error: error.message
        });
    }
};

// @desc    Get all listings of a specific type
// @route   GET /api/listings/:type
exports.getListings = async (req, res) => {
    try {
        const { type } = req.params;
        const listingModel = ListingModels[type];

        if (!listingModel) {
            return res.status(400).json({
                success: false,
                message: 'Invalid listing type'
            });
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;

        // Filtering (without price)
        const filters = {};
        if (req.query.status) filters.status = req.query.status;

        if (type === 'product') {
            if (req.query.category) {
                filters.category = req.query.category;
            }
            if (req.query.location) {
                filters.location = req.query.location;
            }
        }

        // Sorting (default by newest first)
        const sortOptions = { createdAt: -1 };
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(':');
            sortOptions[field] = order === 'desc' ? -1 : 1;
        }

        // Search
        const searchQuery = req.query.search ? {
            $or: [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ]
        } : {};

        // Combine all filters
        const query = {
            ...filters,
            ...searchQuery
        };

        // Execute query
        const totalListings = await listingModel.countDocuments(query);
        const listings = await listingModel
            .find(query)
            .sort(sortOptions)
            .limit(limit)
            .skip(skipIndex)
            .populate('user', 'username email');

        res.status(200).json({
            success: true,
            count: listings.length,
            totalListings,
            totalPages: Math.ceil(totalListings / limit),
            currentPage: page,
            data: listings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching listings',
            error: error.message
        });
    }
};
exports.getListings = async (req, res) => {
    try {
        const { type } = req.params;
        const listingModel = ListingModels[type];

        if (!listingModel) {
            return res.status(400).json({
                success: false,
                message: 'Invalid listing type'
            });
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;

        // Filtering (without price)
        const filters = {};
        if (req.query.status) filters.status = req.query.status;

        if (type === 'product') {
            if (req.query.category) {
                filters.category = req.query.category;
            }
            if (req.query.location) {
                filters.location = req.query.location;
            }
        }

        // Sorting (default by newest first)
        const sortOptions = { createdAt: -1 };
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(':');
            sortOptions[field] = order === 'desc' ? -1 : 1;
        }

        // Search
        const searchQuery = req.query.search ? {
            $or: [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ]
        } : {};

        // Combine all filters
        const query = {
            ...filters,
            ...searchQuery
        };

        // Execute query
        const totalListings = await listingModel.countDocuments(query);
        const listings = await listingModel
            .find(query)
            .sort(sortOptions)
            .limit(limit)
            .skip(skipIndex)
            .populate('user', 'username email');

        res.status(200).json({
            success: true,
            count: listings.length,
            totalListings,
            totalPages: Math.ceil(totalListings / limit),
            currentPage: page,
            data: listings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching listings',
            error: error.message
        });
    }
};

// @desc    Get single listing by ID
// @route   GET /api/listings/:type/:id
exports.getSingleListing = async (req, res) => {
    try {
        const { type, id } = req.params;
        const listingModel = ListingModels[type];

        if (!listingModel) {
            return res.status(400).json({
                success: false,
                message: 'Invalid listing type'
            });
        }

        const listing = await listingModel
            .findById(id)
            .populate('user', 'username email');

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: 'Listing not found'
            });
        }

        res.status(200).json({
            success: true,
            data: listing
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching listing',
            error: error.message
        });
    }
};

// @desc    Update a listing
// @route   PUT /api/listings/:type/:id
exports.updateListing = async (req, res) => {
    try {
        const { type, id } = req.params;
        const listingModel = ListingModels[type];

        if (!listingModel) {
            return res.status(400).json({
                success: false,
                message: 'Invalid listing type'
            });
        }

        // Find the listing and ensure the user owns it
        const listing = await listingModel.findOne({
            _id: id,
            user: req.user.id
        });

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: 'Listing not found or you are not authorized to update it'
            });
        }

        // Remove fields that cannot be updated
        const updateFields = { ...req.body };
        delete updateFields.user;
        delete updateFields.createdAt;
        delete updateFields.status;

        // Update the listing
        const updatedListing = await listingModel.findByIdAndUpdate(
            id,
            updateFields,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: updatedListing
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating listing',
            error: error.message
        });
    }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:type/:id
exports.deleteListing = async (req, res) => {
    try {
        const { type, id } = req.params;
        const listingModel = ListingModels[type];

        if (!listingModel) {
            return res.status(400).json({
                success: false,
                message: 'Invalid listing type'
            });
        }

        // Find the listing and ensure the user owns it
        const listing = await listingModel.findOne({
            _id: id,
            user: req.user.id
        });

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: 'Listing not found or you are not authorized to delete it'
            });
        }

        // Soft delete by updating status
        listing.status = 'inactive';
        await listing.save();

        res.status(200).json({
            success: true,
            message: 'Listing successfully marked as inactive'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting listing',
            error: error.message
        });
    }
};

// @desc    Search across all listing types
// @route   GET /api/listings/search
exports.searchListings = async (req, res) => {
    try {
        const { query, type } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // If specific type is provided, search only that type
        if (type && !ListingModels[type]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid listing type'
            });
        }

        // Perform search
        const searchResults = {};
        const searchPromises = type
            ? [ListingModels[type].find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            })]
            : Object.values(ListingModels).map(model =>
                model.find({
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } }
                    ]
                })
            );

        const results = await Promise.all(searchPromises);

        // Organize results
        Object.keys(ListingModels).forEach((key, index) => {
            searchResults[key] = results[type ? 0 : index];
        });

        res.status(200).json({
            success: true,
            data: type ? searchResults[type] : searchResults
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching listings',
            error: error.message
        });
    }
};