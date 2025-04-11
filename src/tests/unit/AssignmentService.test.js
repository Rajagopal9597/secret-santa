const { expect } = require('chai');
const AssignmentService = require('../../services/AssignmentService');
const Employee = require('../../models/Employee');

describe('AssignmentService', () => {
  let assignmentService;
  
  beforeEach(() => {
    assignmentService = new AssignmentService();
  });
  
  describe('generateAssignments', () => {
    it('should throw error if less than 2 employees provided', () => {
      const employees = [new Employee('John Doe', 'john@acme.com')];
      
      expect(() => {
        assignmentService.generateAssignments(employees, new Map());
      }).to.throw('Need at least 2 employees to generate assignments');
    });
    
    it('should generate valid assignments for all employees', () => {
      const employees = [
        new Employee('John Doe', 'john@acme.com'),
        new Employee('Jane Smith', 'jane@acme.com'),
        new Employee('Bob Johnson', 'bob@acme.com'),
        new Employee('Alice Brown', 'alice@acme.com')
      ];
      
      const previousAssignments = new Map();
      previousAssignments.set('john@acme.com', 'jane@acme.com');
      previousAssignments.set('jane@acme.com', 'bob@acme.com');
      previousAssignments.set('bob@acme.com', 'alice@acme.com');
      previousAssignments.set('alice@acme.com', 'john@acme.com');
      
      const assignments = assignmentService.generateAssignments(employees, previousAssignments);
      
      // Check that we have the correct number of assignments
      expect(assignments).to.have.lengthOf(employees.length);
      
      // Check that no employee is assigned to themselves
      assignments.forEach(assignment => {
        expect(assignment.employee.emailId).to.not.equal(assignment.secretChild.emailId);
      });
      
      // Check that no employee has the same secret child as last year
      assignments.forEach(assignment => {
        const previousChild = previousAssignments.get(assignment.employee.emailId);
        if (previousChild) {
          expect(assignment.secretChild.emailId).to.not.equal(previousChild);
        }
      });
      
      // Check that each employee is a secret child exactly once
      const secretChildEmails = assignments.map(a => a.secretChild.emailId);
      const uniqueSecretChildren = new Set(secretChildEmails);
      expect(uniqueSecretChildren.size).to.equal(employees.length);
    });
  });
});