// Import necessary modules
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// ================= CREATE SUBSECTION =================
exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body;

    //  Proper validation
    if (!sectionId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //  File validation (THIS FIXES 500 ERROR)
    if (!req.files || !req.files.video) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    const video = req.files.video;
    console.log(video)

    //  Upload video to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    console.log(uploadDetails)

    // Create subsection
    const subSectionDetails = await SubSection.create({
      title,
      description,
      timeDuration: `${uploadDetails.duration}`,
      videoUrl: uploadDetails.secure_url,
    });

    //  Push subsection into section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection created successfully",
    });
  } catch (error) {
    console.error("CREATE SUBSECTION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE SUBSECTION =================
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;

    if (!sectionId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "SectionId and SubSectionId are required",
      });
    }

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title) subSection.title = title;
    if (description) subSection.description = description;

    //  Optional video update
    if (req.files && req.files.video) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate("subSection");

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection updated successfully",
    });
  } catch (error) {
    console.error("UPDATE SUBSECTION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE SUBSECTION =================
exports.deleteSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId } = req.body;

    if (!sectionId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "SectionId and SubSectionId are required",
      });
    }

    //  Remove subsection reference from section
    await Section.findByIdAndUpdate(sectionId, {
      $pull: { subSection: subSectionId },
    });

    //  Delete subsection
    const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    const updatedSection = await Section.findById(sectionId).populate("subSection");

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SUBSECTION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
