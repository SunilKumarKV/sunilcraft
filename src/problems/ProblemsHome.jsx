import { Link } from "react-router-dom";

export default function ProblemsHome() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Problems</h1>
      <p className="mb-4">Choose a category to explore coding challenges:</p>

      <div className="flex gap-4">
        <Link
          to="/problems/javascript"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          JavaScript
        </Link>
        <Link
          to="/problems/java"
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          Java
        </Link>
        <Link
          to="/problems/reactjs"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
        >
          ReactJS
        </Link>
      </div>
    </div>
  );
}
