import React from "react";
import ProblemListPage from "../ProblemListPage";
import { tenDaysCode } from "../data/problemSets";

export default function TenDaysCode() {
  return (
    <ProblemListPage
      eyebrow="JavaScript 10 Days Code"
      title="10 Days JavaScript Coding Challenges"
      description="Short, practical JavaScript challenges useful for LinkedIn posts, interview revision, and daily coding consistency."
      problems={tenDaysCode}
      backTo="/problems/javascript"
    />
  );
}
