import { useState } from "react";
import { js30Days } from "./data";

function renderParagraph(text, key) {
  const parts = text.split(/(`[^`]+`)/g); // splits on `code`
  return (
    <p key={key} className="mb-4 text-gray-700">
      {parts.map((part, index) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code
            key={index}
            className="bg-gray-200 px-1 rounded text-sm text-black"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </p>
  );
}

export default function ProblemLayout() {
  const [selectedDay, setSelectedDay] = useState(js30Days[0]);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r overflow-y-auto">
        <h2 className="text-lg font-bold p-4">30 Days of JavaScript</h2>
        <ul>
          {js30Days.map((day) => (
            <li
              key={day.id}
              onClick={() => setSelectedDay(day)}
              className={`p-3 cursor-pointer hover:bg-gray-200 ${
                selectedDay.id === day.id ? "bg-gray-300 font-semibold" : ""
              }`}
            >
              {day.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">{selectedDay.title}</h1>

        {selectedDay.content.map((block, index) => {
          if (block.type === "heading") {
            return (
              <h2 key={index} className="text-xl font-semibold mt-4 mb-2">
                {block.text}
              </h2>
            );
          }
          if (block.type === "paragraph") {
            return renderParagraph(block.text, index);
          }
          if (block.type === "code") {
            return (
              <pre
                key={index}
                className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4"
              >
                <code>{block.text}</code>
              </pre>
            );
          }
          return null;
        })}
      </main>
    </div>
  );
}
