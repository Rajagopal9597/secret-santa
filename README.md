// README.md
# Secret Santa Game

A Node.js application to automate the Secret Santa assignment process for Acme company.

## Features

- Parses employee information from CSV files
- Assigns secret children to employees following specific rules:
  - An employee cannot choose themselves
  - An employee cannot be assigned to the same secret child as the previous year
  - Each employee must have exactly one secret child
  - Each secret child must be assigned to only one employee
- Generates a CSV file with the new assignments

## Installation

```bash
# Clone the repository
git clone https://github.com/Rajagopal9597/secret-santa.git
cd secret-santa

# Install dependencies
npm install
```

## Usage

### Running the application

```bash
node src/cli.js 
```


```

### Output Format

The output CSV file will have the same format as the previous assignments file.

## Testing

Run the tests with:

```bash
npm run test
```

## Design Decisions

### Modularity and Extensibility

The solution follows object-oriented programming principles:
- **Models**: Employee and Assignment classes to represent data
- **Services**: CsvService, ValidationService, and AssignmentService for business logic
- **Application**: SecretSantaApp to coordinate the workflow

### Error Handling

- Comprehensive error handling for file operations and invalid inputs
- User-friendly error messages for common issues

### Algorithm

The assignment algorithm:
1. Creates a pool of available secret children
2. For each employee, finds eligible children based on rules
3. Randomly selects one eligible child
4. Removes the child from the available pool
5. If a valid assignment can't be made, retries the process

This approach ensures all rules are followed while maintaining randomness.

