// constructor 

class Student {
    constructor(name, rollno, department){
        this.name = name;
        this.rollno = rollno;
        this.department = department;
    }
}

const student1 = new Student(
    "Adan",
    23,
    "Computer Science"

);

console.log(student1)

// Destructing object 
console.log(student1.name);


// Loops 

for ( let i= 1; i<=50; i++ ){
    console.log('Student ${i} is present');
}

// Parameteres and Arguments 

function makeTea(flavour, size){
    return `${size} ${flavour} tea`
};

// call above wala funtion 
makeTea("kashmiri", "medium")


// Arrow function
// a simple function 
function add (a,b){
    return a+b;
}

// arrow function 
const add = (a,b) => a+b;

// Nested Objects 
const student3 = {
    name: "Ali",
    address: {
        city: "Lahore",
        country: "Pakistan"
    }
};

// Call back funtion - "Call me when you are done"

function makePizza(callback){
    console.log("Making Pizza .....");
    callback();
}

