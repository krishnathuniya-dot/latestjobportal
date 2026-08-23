const Contact = require("../model/contact");

// Fetch Contact Data
const getContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();

    if (!contact) {
      contact = await Contact.create({
        pageTitle: "Contact Us",
        email: "",
        mobileNumber: "",
        pageDescription: "",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Contact Data
const updateContact = async (req, res) => {
  try {
    const {
      pageTitle,
      email,
      mobileNumber,
      pageDescription,
    } = req.body;

    let contact = await Contact.findOne();

    if (!contact) {
      contact = await Contact.create({
        pageTitle,
        email,
        mobileNumber,
        pageDescription,
      });
    } else {
      contact.pageTitle = pageTitle;
      contact.email = email;
      contact.mobileNumber = mobileNumber;
      contact.pageDescription = pageDescription;

      await contact.save();
    }

    res.status(200).json({
      success: true,
      message: "Contact Updated Successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getContact,
  updateContact,
};