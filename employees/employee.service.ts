import { getRepository } from 'typeorm';
import { Employee } from './employee.entity';
import { Department } from '../departments/department.entity';
import { db } from "../_helpers/db";


export class EmployeeService {
  async create(data: any) {
    const employeeRepository = db.dataSource.getRepository(Employee);
    const departmentRepository = db.dataSource.getRepository(Department);

    // Find the department by ID (assuming department is provided as ID in the request body)
    const department = await departmentRepository.findOne({ where: { id: data.departmentId } });

    if (!department) {
      throw new Error('Department not found');
    }

    // Create a new employee object
    const newEmployee = employeeRepository.create({
      name: data.name,
      position: data.position,
      salary: data.salary,
      department, // Assign the department object
      isActive: data.isActive || true,
      hireDate: new Date(),
    });

    // Save the new employee in the database
    return await employeeRepository.save(newEmployee);
  }

  async getAll() {
    const employeeRepository = db.dataSource.getRepository(Employee);
    return await employeeRepository
      .createQueryBuilder("employee")
      .leftJoinAndSelect("employee.department", "department")
      .select([
        "employee.id",
        "employee.name",
        "employee.position",
        "employee.salary",
        "department.id",
        "department.name",
      ])
      .getMany();
  }
  

  async updateSalary(id: number, salary: number) {
    const employeeRepository = db.dataSource.getRepository(Employee);
    
    // Find the employee by id
    const employee = await employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new Error("Employee not found");
    }

    // Update the salary field only
    employee.salary = salary;

    // Save the updated employee
    return await employeeRepository.save(employee);
  }


  async softDelete(id: number) {
    const employeeRepository = db.dataSource.getRepository(Employee);
    
    // Find the employee by id
    const employee = await employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new Error("Employee not found");
    }
    
    // Set isActive to false for a soft delete
    employee.isActive = false;
    
    // Save and return the updated employee
    return await employeeRepository.save(employee);
  }

}
