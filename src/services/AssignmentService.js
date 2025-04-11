const Assignment = require('../models/Assignment');
const ValidationService = require('./ValidationService');

class AssignmentService {
  constructor() {
    this.validationService = new ValidationService();
  }

  generateAssignments(employees, previousAssignments) {
    if (employees.length < 2) {
      throw new Error('Need at least 2 employees to generate assignments');
    }
    
    let validAssignmentFound = false;
    let assignments = [];
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loops

    while (!validAssignmentFound && attempts < maxAttempts) {
      attempts++;
      assignments = [];
      
      // Make a copy of employees for potential secret children
      const availableSecretChildren = [...employees];
      const assignedEmployees = new Set();
      let valid = true;

      for (const employee of employees) {
        // Filter eligible secret children
        const eligibleChildren = availableSecretChildren.filter(child => 
          this.validationService.validateAssignment(employee, child, previousAssignments) &&
          !assignedEmployees.has(child.emailId)
        );

        if (eligibleChildren.length === 0) {
          valid = false;
          break;
        }

        // Randomly select a secret child
        const randomIndex = Math.floor(Math.random() * eligibleChildren.length);
        const secretChild = eligibleChildren[randomIndex];
        
        // Mark this secret child as assigned
        assignedEmployees.add(secretChild.emailId);
        
        // Create the assignment
        assignments.push(new Assignment(employee, secretChild));
        
        // Remove the assigned secret child from available pool
        const secretChildIndex = availableSecretChildren.findIndex(
          child => child.emailId === secretChild.emailId
        );
        if (secretChildIndex !== -1) {
          availableSecretChildren.splice(secretChildIndex, 1);
        }
      }

      if (valid && assignments.length === employees.length) {
        validAssignmentFound = true;
      }
    }

    if (!validAssignmentFound) {
      throw new Error('Could not generate valid assignments after multiple attempts');
    }

    return assignments;
  }
}

module.exports = AssignmentService;