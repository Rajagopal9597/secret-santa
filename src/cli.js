const path = require('path');
const SecretSantaApp = require('./index');

async function main() {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    console.log('Command line arguments:', args);
    
    // Default file paths
    let employeesFile = 'src/data/Employee-List.xlsx';
    let previousAssignmentsFile = 'src/data/Secret-Santa-Game-Resut-2023.xlsx';
    let outputFile = 'src/data/Secret-Santa-Game-Result-2024.xlsx';
    
    // Use command line arguments if provided
    if (args.length === 3) {
      [employeesFile, previousAssignmentsFile, outputFile] = args;
    } else if (args.length > 0 && args.length < 3) {
      console.error('Usage: node cli.js <employeesFile> <previousAssignmentsFile> <outputFile>');
      process.exit(1);
    }
    
    // Resolve paths
    const employeesPath = path.resolve(employeesFile);
    const previousAssignmentsPath = path.resolve(previousAssignmentsFile);
    const outputPath = path.resolve(outputFile);
    
    console.log('Using files:');
    console.log('- Employees:', employeesPath);
    console.log('- Previous Assignments:', previousAssignmentsPath);
    console.log('- Output:', outputPath);
    
    // Run the app
    const app = new SecretSantaApp();
    await app.run(employeesPath, previousAssignmentsPath, outputPath);
    
    console.log('Secret Santa assignments completed successfully!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error(error.stack); // Add stack trace for more detail
    process.exit(1);
  }
}

// Run the CLI if executed directly
if (require.main === module) {
  main();
}