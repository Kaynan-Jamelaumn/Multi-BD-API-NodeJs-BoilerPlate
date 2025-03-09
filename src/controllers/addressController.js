import { logger } from "../../app.js";
import AddressValidator from "../utils/AddressValidators.js";


import { getModel } from "../utils/getModel.js";
// Dynamically import the Address model based on the filename
let AddressModel;
try {
  // Pass the current file's URL to getModel
  AddressModel = await getModel(import.meta.url);
} catch (error) {
  console.log('Error loading address model:', error);
  throw new Error('Failed to load address model');
}

class AddressController {

  create = async (req, res) => {
    try {
      const { userId, street, number, complement, neighborhood, city, state, zipCode, country } = req.body;

      const validationError = AddressValidator.validateAddressFields(
        { userId, street, number, complement, neighborhood, city, state, zipCode, country },
        { required: true }
      );
      if(validationError){
        return res.status(validationError.status).json({ error: validationError.error });
      }
      const newAddress = { userId, street, number, complement, neighborhood, city, state, zipCode, country };
      const createdAddress = await AddressModel.create(newAddress);
      return res.status(201).json(createdAddress);
    } catch (error) {
      logger.error("Error creating address:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  getByUserId = async (req, res) => {
    try {
      const userId = req.user.role === 'Admin' ? req.params.userId || req.body.userId : req.user.id;
      const addresses = await AddressModel.findAll({ where: { userId } });
      if (!addresses.length) {
        return res.status(404).json({ message: "No addresses found for this user." });
      }
      return res.status(200).json(addresses);
    } catch (error) {
      logger.error("Error fetching addresses:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  getUserAddresses = async (req, res) => {
    try {
      const addresses = await AddressModel.findAll();
      return res.status(200).json(addresses);
    } catch (error) {
      logger.error("Error fetching all user addresses:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  getAddressById = async (req, res) => {
    try {
      const id = req.params.addressId || req.body.addressId 
      const address = await AddressModel.findByPk(id);
      if (!address) {
        return res.status(404).json({ error: "Address not found." });
      }
      return res.status(200).json(address);
    } catch (error) {
      logger.error("Error fetching address by ID:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }


  setPrimaryAddress = async (req, res) => {
    try {
      const userId =  req.params.userId || req.body.userId
      const addressId =  req.params.addressId || req.body.addressId
      await AddressModel.update({ isPrimary: false }, { where: { userId } });
      await AddressModel.update({ isPrimary: true }, { where: { id: addressId, userId } });
      return res.status(200).json({ message: "Primary address updated successfully." });
    } catch (error) {
      logger.error("Error setting primary address:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  getPrimaryAddress = async (req, res) => {
    try {
      const userId  = req.params.userId || req.body.userId;
      const address = await AddressModel.findOne({ where: { userId, isPrimary: true } });
      if (!address) {
        return res.status(404).json({ error: "Primary address not found." });
      }
      return res.status(200).json(address);
    } catch (error) {
      logger.error("Error fetching primary address:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }




  update = async (req, res) => {
    try {
      const id = req.params.addressId || req.body.addressId;
      const updatedData = req.body;
  

      const validationError = AddressValidator.validateAddressFields(updatedData, { required: false });
      if(validationError){
        return res.status(validationError.status).json({ error: validationError.error });
      }

      const address = await AddressModel.findByPk(id);
      if (!address) {
        return res.status(404).json({ error: "Address not found." });
      }
  
      // Update the address with validated data
      await address.update(updatedData);
      return res.status(200).json(address);
    } catch (error) {
      logger.error("Error updating address:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res) => {
    try {
      const id = req.params.addressId || req.body.addressId 
      const address = await AddressModel.findByPk(id);
      if (!address) {
        return res.status(404).json({ error: "Address not found." });
      }

      await address.destroy();
      return res.status(200).json({ message: "Address deleted successfully." });
    } catch (error) {
      logger.error("Error deleting address:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}

export default new AddressController();
