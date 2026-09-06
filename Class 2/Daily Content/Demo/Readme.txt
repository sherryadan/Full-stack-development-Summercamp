CSS 
four major concepts 

- Selector 
- Property 
- Value 
- Rule

h1 {   -> Selector
    color (property): red (value);
    font-size (property): 40px (value);
}


CSS SELECTORS 

5 selectors main

- Element Selector 
select html elements 

- Class Selector 
starts with a dot (.)
selects the class 

- ID Selector 
starts with a hashtag (#)
selects element with unique id

- Universal Selector 
starts with a steric (*)
covers everything on a page

- Multiple Selector
selects multiple elements at same time


Tailwind CSS 
 It is a CSS framework, 
 provides small, reusable utility classes, 
 you can directly apply it to your HTML Elements 

 Utility First Concept 
 You Build your design by Combining utilities

 text Styling
 text-xs
 sm
 base 
 lg
 xl
 2xl
 4xl

 font-light
 normal
 medium 
 semibold
 bold
 extrabold

 JAVASCRIPT:
 Html -> made a button
 css -> style the button 
 JAVASCRIPT -> What should happen when we click the button 


 VARIABLES:
 variables are used to store data in memory 

 3 methods 
 let -> used when the value has to be changed 
 const -> used when the value has not to be changed 
 var -> legacy JAVASCRIPT


 let a =6 

const age = 56

age = 54 // Error 

DATATYPES:

text - string
numbers - int 
decimal - float 
true/false 0/1 - Boolean 
undefined - undefined 
null - null 
values, properties - Object 
list/ set - Array

OPERATORS:

Arithmetic operators ( +, -, *, /, %)

Comparison operators (<, >, >=, <=, ===, !==)

5 === 5 // true 
5 === "5" // false

value1 = 5 
value2 = "5"

type1 = int 
type2= str

5 == 5 // true 

5!==5 // false 
5 !== 8 // true 


Logical Operators 

AND - all conditions should be true
OR - any one condition should be true 
NOT - it turns true in false and false in true 


Conditional Statements

if -- program executes if the condition is true 
if - else --  program executes a funtion if condition is true other wise execuets a different function
else - if -- multiple conditions with multiple possibilities 


Ternary Operator:

short form of if -else 

let age = 24;

let result = age >= 18 ? "Adult" : "Minor"; 

Funtions:

reusable block of code 

function greet() {
    console.log("Good Morning Sir");
}

greet();  // function call 

Functions parameter:

function greet(name){
    console.log("Good Morning" + name)
}


//function call 
greet("Adan");

Return 

function -> takes input -> process it -> returns output

ARRAY:
multiple values have to be stored 

[] -- array rprsnt

let fruit = ["Apple", "Banana", "Orange"];

console.log(fruits[1])

push () -- add elements in array 
pop () -- last item removed
length -- size of an array 

ARRAY METHODS:

forEach()

fruits.forEach(function(fruit){
    console.Log(fruit)
})

Arrow 

fruits.forEach(fruit) => {
    console.log (fruit)
}
map()
make a new array from existing array 

let number = [1,2,3];

let doubled = number.map(function(number){
    return number * 2
});

output = [2,4,6]

filter()
selects items from array on the basis of condition

let number =  [1,2,3,4,5,6]

let evenNumbers = number.filter(
    function(number){
        return number % 2 
    }
);

