class ValidationService {
    validateAssignment(employee, secretChild, previousAssignments) {
      // Rule 1: An employee cannot choose themselves
      if (employee.emailId === secretChild.emailId) {
        return false;
      }
      
      // Rule 2: An employee cannot be assigned to the same secret child as previous year
      if (previousAssignments.has(employee.emailId) && 
          previousAssignments.get(employee.emailId) === secretChild.emailId) {
        return false;
      }
      
      return true;
    }
  }
  
  module.exports = ValidationService;