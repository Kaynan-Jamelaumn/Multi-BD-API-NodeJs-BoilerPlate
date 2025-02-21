import PassportValidator from "./PassportValidator,js";
class IDValidator {
    static validateFields(userData, options = { required: true }) {
        const { username, name, surname, email, password, role } = userData;
        const { required } = options;
      
        // Validate required fields
        if (required && (!name || !surname || !email || !password || !username)) {
          return { error: 'All fields (username, name, surname, email, password) are required.', status: 400 };
        }
      
        // Validate name and surname length
        if (name && name.length < 2) {
          return { error: 'Name must be at least 2 characters long.', status: 400 };
        }
        if (surname && surname.length < 2) {
          return { error: 'Surname must be at least 2 characters long.', status: 400 };
        }
        if (username && username.length < 2) {
          return { error: 'Username must be at least 2 characters long.', status: 400 };
        }
      
      
        // Validate email format
        if (email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            return { error: 'Invalid email format.', status: 400 };
          }
        }
      
        // Validate password length and strength
        if (password) {       //const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; <- password regex including special chars 
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
          if (!passwordRegex.test(password)) {
            return {
              error:
                'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.',
              status: 400,
            };
          }
        }
      
        // Validate role
        if (role && !['User', 'Admin'].includes(role)) {
          return { error: 'Invalid role. Allowed values are "User" or "Admin".', status: 400 };
        }
      
        return null; // No validation errors
      }
    
 
  }
  export default IDValidator;
