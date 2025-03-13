import { Router, Request, Response } from 'express';
import { EmployeeService } from './employee.service';

const router = Router();
const employeeService = new EmployeeService();

// Use Case 1: Add a New Employee
router.post('/', async (req: Request, res: Response) => {
  try {
    const newEmployee = await employeeService.create(req.body);
    res.status(201).json(newEmployee);
} catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
});

//Use Case 2: Retrieve All Employees
router.get('/', async (req: Request, res: Response) => {
    try {
      const employees = await employeeService.getAll();
      res.status(200).json(employees);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  });


export default router;
