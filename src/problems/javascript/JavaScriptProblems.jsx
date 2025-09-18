import { Link } from "react-router-dom";

export default function JavaScriptProblems() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">JavaScript Problems</h1>
      <p className="mb-4">Choose a problem set:</p>

      <div className="flex gap-4">
        <Link
          to="/problems/javascript/30days"
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600"
        >
          30 Days of JavaScript
        </Link>
        <Link
          to="/problems/javascript/10days"
          className="px-6 py-3 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600"
        >
          10 Days Code
        </Link>
      </div>
    </div>
  );
}
