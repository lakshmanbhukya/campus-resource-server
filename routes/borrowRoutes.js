const express = require('express');
const router = express.Router();
const Borrow = require('../models/Borrow');
const { authenticateToken } = require('../middleware/auth');

// Create borrow request
router.post('/request', authenticateToken, async (req, res) => {
  try {
    console.log('📦 Creating borrow request:', req.body);
    const { resourceId, borrower, owner } = req.body;
    
    if (!resourceId || !borrower || !owner) {
      return res.status(400).json({ message: 'ResourceId, borrower, and owner are required' });
    }
    
    // Check if request already exists
    const existingRequest = await Borrow.findOne({ 
      resourceId, 
      borrower, 
      status: { $in: ['Pending', 'Approved'] }
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending or approved request for this resource' });
    }
    
    const request = new Borrow({ resourceId, borrower, owner });
    const savedRequest = await request.save();
    
    console.log('✅ Borrow request created successfully:', savedRequest._id);
    res.status(201).json({ 
      message: 'Borrow Request Sent Successfully',
      request: savedRequest
    });
  } catch (error) {
    console.error('❌ Error creating borrow request:', error);
    res.status(500).json({ message: 'Failed to create borrow request', error: error.message });
  }
});

// Get all borrow requests
router.get('/all', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 Fetching all borrow requests');
    const requests = await Borrow.find().sort({ _id: -1 });
    
    console.log(`✅ Found ${requests.length} borrow requests`);
    res.json(requests);
  } catch (error) {
    console.error('❌ Error fetching borrow requests:', error);
    res.status(500).json({ message: 'Failed to fetch borrow requests', error: error.message });
  }
});

// Update borrow request status
router.put('/update/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`🔄 Updating borrow request ${id} status to: ${status}`);
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const validStatuses = ['Pending', 'Approved', 'Rejected', 'Returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be: Pending, Approved, Rejected, or Returned' });
    }
    
    const updatedRequest = await Borrow.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Borrow request not found' });
    }
    
    console.log('✅ Borrow request status updated successfully');
    res.json({ 
      message: 'Request Status Updated Successfully',
      request: updatedRequest
    });
  } catch (error) {
    console.error('❌ Error updating borrow request status:', error);
    res.status(500).json({ message: 'Failed to update request status', error: error.message });
  }
});

module.exports = router;
