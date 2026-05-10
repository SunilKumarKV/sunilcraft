import React from "react";
import ProblemListPage from "../ProblemListPage";
import { reactProblems } from "../data/problemSets";

export default function ReactProblems() {
  return (
    <ProblemListPage
      eyebrow="ReactJS Practice"
      title="ReactJS Problems"
      description="React practice tasks for components, props, state, forms, API calls, routing, and real portfolio UI building."
      problems={reactProblems}
    />
  );
}
