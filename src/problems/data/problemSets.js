export const problemCategories = [
  {
    title: "JavaScript Problems",
    to: "/problems/javascript",
    stats: "40+ Tasks",
    description: "Practice 30 Days JavaScript tasks, 10 Days Code challenges, arrays, strings, DOM, and interview basics.",
  },
  {
    title: "Java Problems",
    to: "/problems/java",
    stats: "20+ Programs",
    description: "Core Java, OOP, classes, inheritance, interfaces, exception handling, and MCA lab-style programs.",
  },
  {
    title: "ReactJS Problems",
    to: "/problems/reactjs",
    stats: "20+ Tasks",
    description: "React components, props, state, hooks, routing, forms, API handling, and UI practice tasks.",
  },
];

export const js30Days = [
  { day: 1, title: "Print Hello World", level: "Beginner", task: "Create a JavaScript file and print Hello World in the console.", solution: "console.log('Hello World');" },
  { day: 2, title: "Variables", level: "Beginner", task: "Create variables for your name, age, and role, then print them.", solution: "const name = 'Sunil Kumar';\nconst age = 24;\nconst role = 'Full Stack Developer';\nconsole.log(name, age, role);" },
  { day: 3, title: "Data Types", level: "Beginner", task: "Check the type of string, number, boolean, null, undefined, object, and array.", solution: "console.log(typeof 'Sunil');\nconsole.log(typeof 10);\nconsole.log(typeof true);\nconsole.log(typeof null);\nconsole.log(typeof undefined);\nconsole.log(typeof {});\nconsole.log(Array.isArray([]));" },
  { day: 4, title: "Even or Odd", level: "Beginner", task: "Write a function to check whether a number is even or odd.", solution: "function checkEvenOdd(num) {\n  return num % 2 === 0 ? 'Even' : 'Odd';\n}\nconsole.log(checkEvenOdd(7));" },
  { day: 5, title: "Largest of Two Numbers", level: "Beginner", task: "Find the largest number between two values.", solution: "function largest(a, b) {\n  return a > b ? a : b;\n}\nconsole.log(largest(10, 25));" },
  { day: 6, title: "Simple Calculator", level: "Beginner", task: "Create add, subtract, multiply, and divide functions.", solution: "const add = (a,b) => a + b;\nconst sub = (a,b) => a - b;\nconst mul = (a,b) => a * b;\nconst div = (a,b) => b !== 0 ? a / b : 'Cannot divide by zero';" },
  { day: 7, title: "Loop 1 to 10", level: "Beginner", task: "Print numbers from 1 to 10 using a for loop.", solution: "for (let i = 1; i <= 10; i++) {\n  console.log(i);\n}" },
  { day: 8, title: "Sum of Numbers", level: "Beginner", task: "Find the sum of numbers from 1 to n.", solution: "function sumToN(n) {\n  let sum = 0;\n  for (let i = 1; i <= n; i++) sum += i;\n  return sum;\n}\nconsole.log(sumToN(10));" },
  { day: 9, title: "Factorial", level: "Beginner", task: "Find factorial of a number.", solution: "function factorial(n) {\n  let result = 1;\n  for (let i = 2; i <= n; i++) result *= i;\n  return result;\n}\nconsole.log(factorial(5));" },
  { day: 10, title: "Reverse String", level: "Beginner", task: "Reverse a string without changing the original text variable.", solution: "function reverseString(str) {\n  return str.split('').reverse().join('');\n}\nconsole.log(reverseString('SunilCraft'));" },
  { day: 11, title: "Palindrome", level: "Intermediate", task: "Check if a string is palindrome.", solution: "function isPalindrome(str) {\n  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === clean.split('').reverse().join('');\n}" },
  { day: 12, title: "Find Maximum in Array", level: "Intermediate", task: "Find the largest value from an array.", solution: "const nums = [10, 4, 99, 23];\nconsole.log(Math.max(...nums));" },
  { day: 13, title: "Remove Duplicates", level: "Intermediate", task: "Remove duplicate values from an array.", solution: "const values = [1, 2, 2, 3, 4, 4];\nconst unique = [...new Set(values)];\nconsole.log(unique);" },
  { day: 14, title: "Count Vowels", level: "Intermediate", task: "Count vowels in a string.", solution: "function countVowels(str) {\n  return (str.match(/[aeiou]/gi) || []).length;\n}" },
  { day: 15, title: "Array Map", level: "Intermediate", task: "Create a new array with every number doubled.", solution: "const nums = [1,2,3,4];\nconst doubled = nums.map(num => num * 2);" },
  { day: 16, title: "Array Filter", level: "Intermediate", task: "Filter only active users.", solution: "const users = [{name:'Sunil', active:true}, {name:'Alex', active:false}];\nconst activeUsers = users.filter(user => user.active);" },
  { day: 17, title: "Array Reduce", level: "Intermediate", task: "Calculate cart total using reduce.", solution: "const cart = [{price: 100}, {price: 250}];\nconst total = cart.reduce((sum, item) => sum + item.price, 0);" },
  { day: 18, title: "Object Destructuring", level: "Intermediate", task: "Extract name and role from a profile object.", solution: "const profile = { name: 'Sunil', role: 'Full Stack Developer' };\nconst { name, role } = profile;" },
  { day: 19, title: "Spread Operator", level: "Intermediate", task: "Copy an object and update one value.", solution: "const user = { name: 'Sunil', city: 'Bengaluru' };\nconst updated = { ...user, city: 'India' };" },
  { day: 20, title: "Promise", level: "Intermediate", task: "Create a promise that resolves after one second.", solution: "const wait = new Promise(resolve => setTimeout(() => resolve('Done'), 1000));\nwait.then(console.log);" },
  { day: 21, title: "Async Await", level: "Intermediate", task: "Fetch users using async/await.", solution: "async function getUsers() {\n  const res = await fetch('https://jsonplaceholder.typicode.com/users');\n  const data = await res.json();\n  console.log(data);\n}" },
  { day: 22, title: "Try Catch", level: "Intermediate", task: "Handle API errors safely.", solution: "async function loadData() {\n  try {\n    const res = await fetch('/api/data');\n    if (!res.ok) throw new Error('API failed');\n  } catch (error) {\n    console.error(error.message);\n  }\n}" },
  { day: 23, title: "DOM Select", level: "Intermediate", task: "Select an element and change text.", solution: "const title = document.querySelector('#title');\ntitle.textContent = 'SunilCraft';" },
  { day: 24, title: "DOM Event", level: "Intermediate", task: "Add click event to a button.", solution: "document.querySelector('button').addEventListener('click', () => {\n  alert('Clicked');\n});" },
  { day: 25, title: "LocalStorage", level: "Intermediate", task: "Save and read theme from localStorage.", solution: "localStorage.setItem('theme', 'dark');\nconst theme = localStorage.getItem('theme');" },
  { day: 26, title: "Debounce", level: "Advanced", task: "Create a debounce function for search input.", solution: "function debounce(fn, delay) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}" },
  { day: 27, title: "Form Validation", level: "Advanced", task: "Validate email and password before submit.", solution: "function validate(email, password) {\n  if (!email.includes('@')) return 'Invalid email';\n  if (password.length < 6) return 'Password too short';\n  return 'Valid';\n}" },
  { day: 28, title: "Todo App Logic", level: "Advanced", task: "Add, complete, and delete todo items.", solution: "let todos = [];\nfunction addTodo(text) { todos.push({ id: Date.now(), text, done: false }); }\nfunction toggleTodo(id) { todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t); }\nfunction deleteTodo(id) { todos = todos.filter(t => t.id !== id); }" },
  { day: 29, title: "Search Filter", level: "Advanced", task: "Search projects by title.", solution: "const projects = ['ChessPlay', 'SunilCraft', 'DevWithSunil'];\nconst query = 'chess';\nconst result = projects.filter(p => p.toLowerCase().includes(query));" },
  { day: 30, title: "Mini Project", level: "Advanced", task: "Build a small project card renderer using array data.", solution: "const projects = [{ title: 'ChessPlay', stack: 'React + Node' }];\nconst html = projects.map(p => `<article><h2>${p.title}</h2><p>${p.stack}</p></article>`).join('');" },
];

export const tenDaysCode = [
  { day: 1, title: "Reverse Array", task: "Reverse an array and explain mutation.", solution: "const letters = ['a','b','c'];\nconst reversed = [...letters].reverse();\nconsole.log(letters, reversed);" },
  { day: 2, title: "parseInt Challenge", task: "Understand parseInt with small decimals.", solution: "console.log(parseInt(0.000005));\nconsole.log(parseInt(0.0000005));" },
  { day: 3, title: "FizzBuzz", task: "Print Fizz, Buzz, or FizzBuzz from 1 to 100.", solution: "for (let i=1;i<=100;i++) console.log(i%15===0?'FizzBuzz':i%3===0?'Fizz':i%5===0?'Buzz':i);" },
  { day: 4, title: "Second Largest", task: "Find second largest number in an array.", solution: "const arr = [4,9,2,9,7];\nconst unique = [...new Set(arr)].sort((a,b)=>b-a);\nconsole.log(unique[1]);" },
  { day: 5, title: "Anagram", task: "Check if two strings are anagrams.", solution: "const sort = s => s.toLowerCase().split('').sort().join('');\nconsole.log(sort('listen') === sort('silent'));" },
  { day: 6, title: "Flatten Array", task: "Flatten nested array values.", solution: "const arr = [1,[2,[3]]];\nconsole.log(arr.flat(Infinity));" },
  { day: 7, title: "Frequency Count", task: "Count character frequency.", solution: "const str = 'sunil';\nconst freq = {};\nfor (const ch of str) freq[ch] = (freq[ch] || 0) + 1;" },
  { day: 8, title: "Capitalize Words", task: "Capitalize first letter of each word.", solution: "const title = 'full stack developer';\nconsole.log(title.split(' ').map(w => w[0].toUpperCase()+w.slice(1)).join(' '));" },
  { day: 9, title: "Promise All", task: "Run multiple async requests together.", solution: "Promise.all([fetch('/api/a'), fetch('/api/b')]).then(console.log).catch(console.error);" },
  { day: 10, title: "Build Project List", task: "Render portfolio projects from data.", solution: "const projects = [{ name: 'ChessPlay', url: 'https://chessplay1.vercel.app/' }];\nprojects.forEach(p => console.log(`${p.name}: ${p.url}`));" },
];

export const javaProblems = [
  { title: "Class and Object", level: "Beginner", task: "Create a Student class and print student details.", solution: "class Student {\n  String name = \"Sunil\";\n  int age = 24;\n  void display() { System.out.println(name + \" \" + age); }\n}\npublic class Main { public static void main(String[] args) { new Student().display(); } }" },
  { title: "Constructor", level: "Beginner", task: "Use constructor to initialize values.", solution: "class Student {\n  String name;\n  Student(String name) { this.name = name; }\n}\npublic class Main { public static void main(String[] args) { Student s = new Student(\"Sunil\"); } }" },
  { title: "Inheritance", level: "Intermediate", task: "Create parent and child classes.", solution: "class Person { void speak(){ System.out.println(\"Hello\"); } }\nclass Developer extends Person { void code(){ System.out.println(\"Coding\"); } }" },
  { title: "Method Overloading", level: "Intermediate", task: "Create multiple add methods.", solution: "class Calc { int add(int a,int b){return a+b;} double add(double a,double b){return a+b;} }" },
  { title: "Exception Handling", level: "Intermediate", task: "Handle divide by zero safely.", solution: "try { int x = 10 / 0; } catch (ArithmeticException e) { System.out.println(\"Cannot divide by zero\"); }" },
  { title: "Array Sum", level: "Beginner", task: "Find sum of array elements.", solution: "int[] arr = {1,2,3}; int sum = 0; for(int n: arr) sum += n; System.out.println(sum);" },
];

export const reactProblems = [
  { title: "Create Component", level: "Beginner", task: "Create a reusable ProfileCard component.", solution: "function ProfileCard({ name, role }) {\n  return <div><h2>{name}</h2><p>{role}</p></div>;\n}" },
  { title: "useState Counter", level: "Beginner", task: "Create a counter with increment and decrement buttons.", solution: "const [count, setCount] = useState(0);\n<button onClick={() => setCount(count + 1)}>+</button>" },
  { title: "Props", level: "Beginner", task: "Pass project data using props.", solution: "function ProjectCard({ project }) { return <h2>{project.title}</h2>; }" },
  { title: "List Rendering", level: "Beginner", task: "Render portfolio projects using map.", solution: "{projects.map(project => <ProjectCard key={project.title} project={project} />)}" },
  { title: "Form Handling", level: "Intermediate", task: "Capture input value using controlled component.", solution: "const [email, setEmail] = useState('');\n<input value={email} onChange={e => setEmail(e.target.value)} />" },
  { title: "API Fetch", level: "Intermediate", task: "Fetch data inside useEffect.", solution: "useEffect(() => { fetch('/api/projects').then(r => r.json()).then(setProjects); }, []);" },
];
