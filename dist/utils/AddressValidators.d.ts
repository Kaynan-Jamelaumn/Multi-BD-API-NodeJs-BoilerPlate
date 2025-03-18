interface ValidationResult {
    status: number;
    error: string;
}
interface AddressFields {
    userId?: number;
    street?: string;
    number?: number | string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}
interface ValidationOptions {
    required?: boolean;
}
declare class AddressValidator {
    static validateAddressFields(fields: AddressFields, options?: ValidationOptions): ValidationResult | null;
}
export default AddressValidator;
