export const js30Days = [
  {
    id: 1,
    title: "Day 1 - Create Hello World Function",
    content: [
      {
        type: "heading",
        text: "🔹 Problem Description",
      },
      {
        type: "paragraph",
        text: "Create a function called `createHelloWorld` that returns another function. When this returned function is called (with or without arguments), it should always return: `Hello World`",
      },
      {
        type: "heading",
        text: "🔹 Example Walkthrough",
      },
      {
        type: "code",
        text: `const f = createHelloWorld();
console.log(f()); // Output: "Hello World"
console.log(f({}, null, 42)); // Output: "Hello World"`,
      },
      {
        type: "paragraph",
        text: "No matter what arguments you pass to `f`, it always returns `Hello World`.",
      },
      {
        type: "heading",
        text: "🔹 How to Solve It",
      },
      {
        type: "paragraph",
        text: "Here's a simple way to write this in JavaScript:",
      },
      {
        type: "code",
        text: `function createHelloWorld() {
  return function(...args) {
    return "Hello World";
  };
}`,
      },
      {
        type: "heading",
        text: "🔹 Explanation of the Code",
      },
      {
        type: "paragraph",
        text: "`createHelloWorld()` is the outer function. It returns another function.",
      },
      {
        type: "paragraph",
        text: "`function(...args)` is the inner function. It uses the rest parameter to accept any number of arguments, but it ignores them and just returns `Hello World`.",
      },
      {
        type: "heading",
        text: "🔹 Why Use ...args?",
      },
      {
        type: "paragraph",
        text: "`...args` (called the rest parameter) allows the function to accept any number of arguments.",
      },
      {
        type: "paragraph",
        text: "Examples:",
      },
      {
        type: "code",
        text: `f(); // no arguments
f(1); // one argument
f("hi", 123, true); // multiple arguments`,
      },
      {
        type: "paragraph",
        text: "Even though arguments are passed, we don't use them. We just return `Hello World`.",
      },
      {
        type: "heading",
        text: "🔹 Constraints",
      },
      {
        type: "paragraph",
        text: "`0 <= args.length <= 10`: This means the returned function can be called with up to 10 arguments, but they don't affect the output.",
      },
    ],
  },
  {
    id: 2,
    title: "Day 2 - Functions",
    content: [
      { type: "heading", text: "Defining Functions" },
      {
        type: "paragraph",
        text: "Functions are reusable blocks of code that take input and return output.",
      },
      {
        type: "code",
        text: `function add(a, b) {
  return a + b;
}
console.log(add(5, 3)); // 8`,
      },
    ],
  },
];
