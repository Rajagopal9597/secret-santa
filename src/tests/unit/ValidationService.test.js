const { expect } = require('chai');
const ValidationService = require('../../services/ValidationService');
const Employee = require('../../models/Employee');

describe('ValidationService', () => {
  let validationService;
  
  beforeEach(() => {
    validationService = new ValidationService();
  });
  
  describe('validateAssignment', () => {
    it('should return false if employee is assigned to themselves', () => {
      const employee = new Employee('John Doe', 'john@acme.com');
      const result = validationService.validateAssignment(employee, employee, new Map());
      expect(result).to.be.false;
    });
    
    it('should return false if employee is assigned to the same secret child as last year', () => {
      const employee = new Employee('John Doe', 'john@acme.com');
      const secretChild = new Employee('Jane Smith', 'jane@acme.com');
      
      const previousAssignments = new Map();
      previousAssignments.set('john@acme.com', 'jane@acme.com');
      
      const result = validationService.validateAssignment(employee, secretChild, previousAssignments);
      expect(result).to.be.false;
    });
    
    it('should return true for a valid assignment', () => {
      const employee = new Employee('John Doe', 'john@acme.com');
      const secretChild = new Employee('Jane Smith', 'jane@acme.com');
      const previousAssignments = new Map();
      
      const result = validationService.validateAssignment(employee, secretChild, previousAssignments);
      expect(result).to.be.true;
    });
  });
});