import React from "react";
import ProblemListPage from "../../ProblemListPage";
import { js30Days } from "../../data/problemSets";

export default function ProblemLayout() {
  return (
    <ProblemListPage
      eyebrow="JavaScript 30 Days"
      title="30 Days JavaScript Problems"
      description="A complete beginner-to-advanced JavaScript practice track for SunilCraft. Use it to learn, revise, and show consistent coding practice."
      problems={js30Days}
      backTo="/problems/javascript"
    />
  );
}
