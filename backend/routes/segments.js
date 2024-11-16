const Segment = require("../models/Segment");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();


//ROUTE 1: CREATE A SEGMENT
router.post("/createSegment", async (req, res) => {
  try {
    const { name, conditions, customerIds } = req.body;
    const audienceSize = customerIds.length;

    // Check if a segment with the same name or conditions already exists
    const existingSegment = await Segment.findOne({
      $or: [{ name: name }, { conditions: conditions }],
    });
    if (!name || !conditions ) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

    if (existingSegment) {
      if (existingSegment.name === name) {
        return res
          .status(409)
          .json({ message: "A segment already exists with the same name" });
      }
      if (
        JSON.stringify(existingSegment.conditions) ===
        JSON.stringify(conditions)
      ) {
        return res
          .status(409)
          .json({ message: "A segment already exists with these conditions" });
      }
    }

    // Create the new segment
    const newSegment = new Segment({
      segmentId: uuidv4(),
      name,
      conditions,
      createdAt: new Date(),
      audienceSize,
      customerIds,
    });

    // Save the segment to the database
    await newSegment.save();
    res
      .status(201)
      .json({ message: "Segment created successfully", segment: newSegment });
  } catch (error) {
    console.error("Error creating segment:", error);
    res.status(500).json({ message: "Error creating segment" });
  }
});

//ROUTE 2: FETCH ALL SEGMENTS
router.get('/fetchSegments',async(req,res)=>{
  try{
    const segments = await Segment.find({}); //fetch all the segments present in database
    res.status(200).send(segments);
  }
  catch(error){
    console.error("Error fetching segment:", error);
    res.status(500).json({ message: "Error fetching segment" });
  }
})


// ROUTE 2: DELETE A SEGMENT
router.delete('/deleteSegment/:segmentId',async(req,res)=>{
  try{
    //find the segment with the given segmetn id in URL
    let segment = await Segment.findById(req.params.segmentId);
    if(!segment){
        return res.status(404).send("Segment not found");
    }
    
    await Segment.findByIdAndDelete(req.params.segmentId);
    res.send({message: "Segment Deleted"});
  }
  catch(error){
    console.error(error);
    res.send(500).json({message:'Error deleting segment'})
  }
})

module.exports = router;
