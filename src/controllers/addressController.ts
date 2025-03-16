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

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId, street, number, complement, neighborhood, city, state, zipCode, country } = req.body;

      const validationError = AddressValidator.validateAddressFields(
        { userId, street, number, complement, neighborhood, city, state, zipCode, country },
        { required: true }
      );
      if (validationError) {
        return res.status(validationError.status).json({ error: validationError.error });
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
      return res.status(201).json(createdAddress);
    } catch (error: any) {
      logger.error("Error creating address:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  getByUserId = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated." });
      }

      const userId: string | number = req.user.role === 'Admin' ? req.params.userId || req.body.userId : req.user.id;
      const addresses = await dbManager.find({ userId });
      if (!addresses.length) {
        return res.status(404).json({ message: "No addresses found for this user." });
      }
      return res.status(200).json(addresses);
    } catch (error: any) {
      logger.error("Error fetching addresses:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  getUserAddresses = async (req: Request, res: Response): Promise<Response> => {
    try {
      const addresses = await dbManager.find({}); // Pass an empty object as the query
      return res.status(200).json(addresses);
    } catch (error: any) {
      logger.error("Error fetching all user addresses:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  getAddressById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id: string = req.params.addressId || req.body.addressId;
      const address = await dbManager.findById(id);
      if (!address) {
        return res.status(404).json({ error: "Address not found." });
      }
      return res.status(200).json(address);
    } catch (error: any) {
      logger.error("Error fetching address by ID:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  setPrimaryAddress = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId: string = req.params.userId || req.body.userId;
      const addressId: string = req.params.addressId || req.body.addressId;
  
      // Update all addresses for the user to set isPrimary to false
      await dbManager.update({ userId }, { isPrimary: false });
  
      // Update the specific address to set isPrimary to true
      await dbManager.update(addressId, { isPrimary: true });
  
      return res.status(200).json({ message: "Primary address updated successfully." });
    } catch (error: any) {
      logger.error("Error setting primary address:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  getPrimaryAddress = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId: string = req.params.userId || req.body.userId;
      const address = await dbManager.findOne({ userId, isPrimary: true });
      if (!address) {
        return res.status(404).json({ error: "Primary address not found." });
      }
      return res.status(200).json(address);
    } catch (error: any) {
      logger.error("Error fetching primary address:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id: string = req.params.addressId || req.body.addressId;
      const updatedData = req.body;

      const validationError = AddressValidator.validateAddressFields(updatedData, { required: false });
      if (validationError) {
        return res.status(validationError.status).json({ error: validationError.error });
      }

      const address = await dbManager.findById(id);
      if (!address) {
        return res.status(404).json({ error: "Address not found." });
      }

      // Update the address with validated data
      const updatedAddress = await dbManager.update(id, updatedData);
      return res.status(200).json(updatedAddress);
    } catch (error: any) {
      logger.error("Error updating address:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id: string = req.params.addressId || req.body.addressId;
      const address = await dbManager.findById(id);
      if (!address) {
        return res.status(404).json({ error: "Address not found." });
      }

      await dbManager.delete(id);
      return res.status(200).json({ message: "Address deleted successfully." });
    } catch (error: any) {
      logger.error("Error deleting address:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}

export default new AddressController();