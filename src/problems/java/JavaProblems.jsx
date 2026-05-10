import React from "react";
import ProblemListPage from "../ProblemListPage";
import { javaProblems } from "../data/problemSets";

export default function JavaProblems() {
  return (
    <ProblemListPage
      eyebrow="Java Practice"
      title="Java OOP and MCA Lab Problems"
      description="Core Java programs covering classes, objects, inheritance, overloading, arrays, and exception handling."
      problems={javaProblems}
    />
  );
}
