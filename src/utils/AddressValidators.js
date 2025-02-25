class AddressValidator {
    static validateAddressFields(fields, options = { required: false }) {
      const {
        userId,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
        country,
      } = fields;
  
      // List of required fields
      const requiredFields = [
        "userId",
        "street",
        "number",
        "neighborhood",
        "city",
        "state",
        "zipCode",
      ];
  
      // Check for missing required fields
      if (options.required) {
        const missingFields = requiredFields.filter(
          (field) => fields[field] === undefined || fields[field] === null
        );
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
        }
      }
  
      // Validate individual fields
      if (userId && typeof userId !== "number") {
        throw new Error("Invalid userId: must be a number.");
      }
  
      if (street && typeof street !== "string") {
        throw new Error("Invalid street: must be a string.");
      }
  
      if (number && (typeof number !== "number" && typeof number !== "string")) {
        throw new Error("Invalid number: must be a string or number.");
      }
  
      if (complement && typeof complement !== "string") {
        throw new Error("Invalid complement: must be a string.");
      }
  
      if (neighborhood && typeof neighborhood !== "string") {
        throw new Error("Invalid neighborhood: must be a string.");
      }
  
      if (city && typeof city !== "string") {
        throw new Error("Invalid city: must be a string.");
      }
  
      if (state && typeof state !== "string") {
        throw new Error("Invalid state: must be a string.");
      }
  
      if (
        zipCode &&
        (typeof zipCode !== "string" || !/^\d{5}(-\d{4})?$/.test(zipCode))
      ) {
        throw new Error(
          "Invalid zipCode: must be a valid ZIP code (e.g., 12345 or 12345-6789)."
        );
      }
  
      if (country && typeof country !== "string") {
        throw new Error("Invalid country: must be a string.");
      }
    }
  }
  
  export default AddressValidator;
  