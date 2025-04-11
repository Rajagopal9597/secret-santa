// src/services/CsvService.js
const fs = require('fs');
const { parse, stringify } = require('csv-parse/sync');
const XLSX = require('xlsx');
const Employee = require('../models/Employee');

class CsvService {
  async readEmployees(filePath) {
    try {
      if (filePath.endsWith('.xlsx')) {
        // Handle Excel files
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const records = XLSX.utils.sheet_to_json(worksheet);
        
        return records.map(record => new Employee(
          record.Employee_Name, 
          record.Employee_EmailID
        ));
      } else {
        // Handle CSV files
        const fileContent = await fs.promises.readFile(filePath, 'utf8');
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        });
        
        return records.map(record => new Employee(
          record.Employee_Name, 
          record.Employee_EmailID
        ));
      }
    } catch (error) {
      throw new Error(`Error reading employees: ${error.message}`);
    }
  }

  async readPreviousAssignments(filePath) {
    try {
      const assignments = new Map();
      
      if (filePath.endsWith('.xlsx')) {
        // Handle Excel files
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const records = XLSX.utils.sheet_to_json(worksheet);
        
        records.forEach(record => {
          assignments.set(record.Employee_EmailID, record.Secret_Child_EmailID);
        });
      } else {
        // Handle CSV files
        const fileContent = await fs.promises.readFile(filePath, 'utf8');
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        });
        
        records.forEach(record => {
          assignments.set(record.Employee_EmailID, record.Secret_Child_EmailID);
        });
      }
      
      return assignments;
    } catch (error) {
      // If no previous assignments exist, return an empty map
      if (error.code === 'ENOENT') {
        return new Map();
      }
      throw new Error(`Error reading previous assignments: ${error.message}`);
    }
  }

  async writeAssignments(filePath, assignments) {
    try {
      const records = assignments.map(assignment => ({
        Employee_Name: assignment.employee.name,
        Employee_EmailID: assignment.employee.emailId,
        Secret_Child_Name: assignment.secretChild.name,
        Secret_Child_EmailID: assignment.secretChild.emailId
      }));
      
      if (filePath.endsWith('.xlsx')) {
        // Handle Excel files
        const worksheet = XLSX.utils.json_to_sheet(records);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Assignments');
        XLSX.writeFile(workbook, filePath);
      } else {
        // Handle CSV files
        const csvContent = stringify(records, { header: true });
        await fs.promises.writeFile(filePath, csvContent);
      }
    } catch (error) {
      throw new Error(`Error writing assignments: ${error.message}`);
    }
  }
}

module.exports = CsvService;