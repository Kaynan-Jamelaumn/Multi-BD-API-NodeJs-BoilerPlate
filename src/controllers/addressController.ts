import { logger } from "../app.js";
import { getModel } from "../utils/getModel.js";
import AddressValidator from "../utils/AddressValidators.js";
import { getDBManager } from "../manager/dbManagerFactory.js";
import { Request, Response } from "express"; // Importing types for req and res
import { Model } from "../types/models.js";
import { DBManager } from '../manager/DBManager.js';


// Dynamically import the Address model based on the filename
let addressModel: Model;
try {
  // Pass the current file's URL to getModel
  addressModel = await getModel(import.meta.url);
} catch (error) {
  console.log('Error loading address model:', error);
  throw new Error('Failed to load address model');
}

const dbManager: DBManager<any> = getDBManager(addressModel);

class AddressController {

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, street, number, complement, neighborhood, city, state, zipCode, country } = req.body;

      const validationError = AddressValidator.validateAddressFields(
        { userId, street, number, complement, neighborhood, city, state, zipCode, country },
        { required: true }
      );
      if (validationError) {
        res.status(validationError.status).json({ error: validationError.error });
        return;
      }
      const newAddress:  {
        userId: string | number;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      } = { userId, street, number, complement, neighborhood, city, state, zipCode, country };
      const createdAddress = await dbManager.create(newAddress);
      res.status(201).json(createdAddress);
      return;
    } catch (error: any) {
      logger.error("Error creating address:", error);
      res.status(400).json({ error: error.message });
      return;
    }
  }

  getByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized: User not authenticated." });
        return;
      }

      const userId: string | number = req.user.role === 'Admin' ? req.params.userId || req.body.userId : req.user.id;
      const addresses = await dbManager.find({ userId });
      if (!addresses.length) {
        res.status(404).json({ message: "No addresses found for this user." });
        return;
      }
      res.status(200).json(addresses);
      return;
    } catch (error: any) {
      logger.error("Error fetching addresses:", error);
      res.status(500).json({ error: "Internal server error." });
      return;
    }
  }

  getUserAddresses = async (req: Request, res: Response): Promise<void> => {
    try {
      const addresses = await dbManager.find({}); // Pass an empty object as the query
      res.status(200).json(addresses);
      return; 
    } catch (error: any) {
      logger.error("Error fetching all user addresses:", error);
      res.status(500).json({ error: "Internal server error." });
      return;
    }
  }

  getAddressById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.addressId || req.body.addressId;
      const address = await dbManager.findById(id);
      if (!address) {
        res.status(404).json({ error: "Address not found." });
        return;
      }
      res.status(200).json(address);
      return;
    } catch (error: any) {
      logger.error("Error fetching address by ID:", error);
      res.status(500).json({ error: "Internal server error." });
      return;
    }
  }

  setPrimaryAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId: string = req.params.userId || req.body.userId;
      const addressId: string = req.params.addressId || req.body.addressId;
  
      // Update all addresses for the user to set isPrimary to false
      await dbManager.update({ userId }, { isPrimary: false });
  
      // Update the specific address to set isPrimary to true
      await dbManager.update(addressId, { isPrimary: true });
  
      res.status(200).json({ message: "Primary address updated successfully." });
      return;
    } catch (error: any) {
      logger.error("Error setting primary address:", error);
      res.status(500).json({ error: "Internal server error." });
      return;
    }
  }

  getPrimaryAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId: string = req.params.userId || req.body.userId;
      const address = await dbManager.findOne({ userId, isPrimary: true });
      if (!address) {
        res.status(404).json({ error: "Primary address not found." });
        return
      }
      res.status(200).json(address);
      return;
    } catch (error: any) {
      logger.error("Error fetching primary address:", error);
      res.status(500).json({ error: "Internal server error." });
      return;
    }
  }

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.addressId || req.body.addressId;
      const updatedData = req.body;

      const validationError = AddressValidator.validateAddressFields(updatedData, { required: false });
      if (validationError) {
        res.status(validationError.status).json({ error: validationError.error });
        return;
      }

      const address = await dbManager.findById(id);
      if (!address) {
        res.status(404).json({ error: "Address not found." });
        return;
      }

      // Update the address with validated data
      const updatedAddress = await dbManager.update(id, updatedData);
      res.status(200).json(updatedAddress);
      return;
    } catch (error: any) {
      logger.error("Error updating address:", error);
      res.status(400).json({ error: error.message });
      return;
    }
  }

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.addressId || req.body.addressId;
      const address = await dbManager.findById(id);
      if (!address) {
        res.status(404).json({ error: "Address not found." });
        return;
      }

      await dbManager.delete(id);
      res.status(200).json({ message: "Address deleted successfully." });
      return;
    } catch (error: any) {
      logger.error("Error deleting address:", error);
      res.status(500).json({ error: "Internal server error." });
      return;
    }
  }
}

export default new AddressController();