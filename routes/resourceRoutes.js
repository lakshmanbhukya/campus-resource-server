const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { authenticateToken } = require('../middleware/auth');

// Add new resource
router.post('/add', authenticateToken, async (req, res) => {
  try {
    console.log('📦 Adding new resource:', req.body);
    const { title, description, owner } = req.body;
    
    if (!title || !description || !owner) {
      return res.status(400).json({ message: 'Title, description, and owner are required' });
    }
    
    const resource = new Resource({ title, description, owner });
    const savedResource = await resource.save();
    
    console.log('✅ Resource added successfully:', savedResource._id);
    res.status(201).json({ 
      message: 'Resource Added Successfully',
      resource: savedResource
    });
  } catch (error) {
    console.error('❌ Error adding resource:', error);
    res.status(500).json({ message: 'Failed to add resource', error: error.message });
  }
});

// Get all resources
router.get('/all', async (req, res) => {
  try {
    console.log('🔍 Fetching all resources');
    const resources = await Resource.find().sort({ _id: -1 });
    
    console.log(`✅ Found ${resources.length} resources`);
    res.json(resources);
  } catch (error) {
    console.error('❌ Error fetching resources:', error);
    res.status(500).json({ message: 'Failed to fetch resources', error: error.message });
  }
});

// Update resource status
router.put('/update-status/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`🔄 Updating resource ${id} status to: ${status}`);
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const validStatuses = ['Available', 'Borrowed', 'Unavailable'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be: Available, Borrowed, or Unavailable' });
    }
    
    const updatedResource = await Resource.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    );
    
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    console.log('✅ Resource status updated successfully');
    res.json({ 
      message: 'Status Updated Successfully',
      resource: updatedResource
    });
  } catch (error) {
    console.error('❌ Error updating resource status:', error);
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
});

module.exports = router;

