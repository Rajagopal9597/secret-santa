const CsvService = require('./services/CsvService');
const AssignmentService = require('./services/AssignmentService');

class SecretSantaApp {
  constructor() {
    this.csvService = new CsvService();
    this.assignmentService = new AssignmentService();
  }

  async run(employeesFilePath, previousAssignmentsFilePath, outputFilePath) {
    try {
      console.log('Reading employee data...');
      const employees = await this.csvService.readEmployees(employeesFilePath);
      console.log(`Found ${employees.length} employees`);

      console.log('Reading previous assignments...');
      const previousAssignments = await this.csvService.readPreviousAssignments(previousAssignmentsFilePath);
      console.log(`Found ${previousAssignments.size} previous assignments`);

      console.log('Generating new assignments...');
      const assignments = this.assignmentService.generateAssignments(employees, previousAssignments);
      console.log(`Generated ${assignments.length} new assignments`);

      console.log('Writing assignments to file...');
      await this.csvService.writeAssignments(outputFilePath, assignments);
      console.log(`Assignments saved to ${outputFilePath}`);

      return assignments;
    } catch (error) {
      console.error(`Error running Secret Santa app: ${error.message}`);
      throw error;
    }
  }
}

module.exports = SecretSantaApp;