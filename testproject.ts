/** Import the Employee data function*/
const employees = require("./employee.json");

interface Employee {
    
    /** unique id of Employee */
    uniqueId: number;

    /** name of Employee */
    name: string;

    /** subordinate of Employee */
    subordinates: Employee[];

}

interface IEmployeeOrgApp {

    /** The CEO property */
    ceo: Employee;

    /** * Moves the employee with employeeID (uniqueId) under a supervisor (another employee) that has supervisorID (uniqueId). * E.g. move Bob (employeeID) to be subordinate of Georgina (supervisorID). * @param employeeID * @param supervisorID */ 
    move(employeeID: number, supervisorID: number): void;
    
    /** Undo last move action */ 
    undo(): void;
    
    /** Redo last undone action */ 
    redo(): void;

    /** Reset employee data */
    reset(): void;

    // /** Import the Employee data action */ 
    // importData(): void;

}
  
class EmployeeOrgApp implements IEmployeeOrgApp {

    ceo: Employee
    initial: Employee
    prev : Employee
    following: Employee

    constructor(ceo : Employee) {
        this.ceo = ceo
        this.initial = ceo
        this.prev = ceo
        this.following = ceo
    }

    move(employeeID: number, supervisorID: number): void {
        console.log('=========== move function ==============')        
        /** Can not move ceo to any subordinate or not move employee to itself subordinate*/
        if(employeeID>1 && employeeID != supervisorID){
            /** Get  */
            GetTargetEmployee(this.ceo, employeeID, supervisorID)            
            if(targetEmployee.uniqueId == employeeID && targetSuperEmployee.uniqueId == supervisorID && SuperEmployee.uniqueId != supervisorID){
                this.prev = this.ceo
                console.log("Org:", this.ceo)  
                ReplaceEmployee(this.ceo)
                console.log("Moved:", this.ceo)                
                this.following = this.ceo
            }            
        }
    }

    undo(): void {
        console.log('=========== undo function ==============')
        this.ceo = this.prev
        console.log("Undo:", this.ceo)        
    }

    redo(): void {
        console.log('=========== redo function ==============')
        this.ceo = this.following
        console.log("Redo:", this.ceo)        
    }

    reset():void {
        console.log('=========== reset function ==============')
        this.ceo = this.initial
        console.log("Reset:", this.ceo)        
    }
}

let targetEmployee: Employee = {uniqueId: 0, name: 'initial', subordinates: []}
let targetSuperEmployee: Employee = {uniqueId: 0, name: 'initial', subordinates: []}
let SuperEmployee: Employee = {uniqueId: 0, name: 'initial', subordinates: []}

const ReplaceEmployee = (nestedObjects: Employee) => {
    for(let i=0; i<nestedObjects.subordinates.length; i++){
        if(nestedObjects.subordinates[i].uniqueId == targetSuperEmployee.uniqueId){
            nestedObjects.subordinates[i].subordinates.push(targetEmployee)
        }
        if(nestedObjects.subordinates[i].uniqueId == SuperEmployee.uniqueId){
            for(let k=0;k<nestedObjects.subordinates[i].subordinates.length;k++){
                if(nestedObjects.subordinates[i].subordinates[k].uniqueId == targetEmployee.uniqueId){
                    nestedObjects.subordinates[i].subordinates.splice(k,1)
                }
            }
            for(let j=0;j<targetEmployee.subordinates.length;j++){
                nestedObjects.subordinates.push(targetEmployee.subordinates[j])
            }
        }
        if(nestedObjects.subordinates[i].subordinates.length>0){
            nestedObjects.subordinates[i] = ReplaceEmployee(nestedObjects.subordinates[i])
        }
    }
    return nestedObjects
}

const GetTargetEmployee = (nestedObjects: Employee, targetID:number, targetSuperID:number) => {

    for(let i=0; i<nestedObjects.subordinates.length; i++){

        if(nestedObjects.subordinates[i].uniqueId == targetSuperID){
            targetSuperEmployee = nestedObjects.subordinates[i]
        }

        if(nestedObjects.subordinates[i].uniqueId == targetID){
            targetEmployee = nestedObjects.subordinates[i]
            SuperEmployee = nestedObjects
        }

        if(nestedObjects.subordinates[i].subordinates.length>0){
            GetTargetEmployee(nestedObjects.subordinates[i], targetID, targetSuperID)
        }
    }

};



//////////////////////////
/** The Class Test part */
//////////////////////////
/** Import the Employee data */

let ceoData : Employee = employees

let myEmployeeOrgApp = new EmployeeOrgApp(ceoData)
myEmployeeOrgApp.move(7,4)






