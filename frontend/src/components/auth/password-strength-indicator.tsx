"use client";

import { useMemo } from "react";
import { zxcvbn } from "@zxcvbn-ts/core";
import { zxcvbnOptions } from "@zxcvbn-ts/core";
import { dictionary, adjacencyGraphs } from "@zxcvbn-ts/language-common";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Initialize zxcvbn
const options = {
  dictionary: {
    ...dictionary,
  },
  graphs: adjacencyGraphs,
};
zxcvbnOptions.setOptions(options);

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

const strengthLabels = [
  { label: "Very Weak", color: "bg-red-500", textColor: "text-red-600" },
  { label: "Weak", color: "bg-orange-500", textColor: "text-orange-600" },
  { label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-600" },
  { label: "Good", color: "bg-blue-500", textColor: "text-blue-600" },
  { label: "Strong", color: "bg-green-500", textColor: "text-green-600" },
];

export function PasswordStrengthIndicator({ 
  password, 
  className 
}: PasswordStrengthIndicatorProps) {
  const analysis = useMemo(() => {
    if (!password) return null;
    return zxcvbn(password);
  }, [password]);

  if (!password || !analysis) {
    return null;
  }

  const score = analysis.score;
  const strength = strengthLabels[score];
  const progressValue = ((score + 1) / 5) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          <span className={cn("font-medium", strength.textColor)}>
            {strength.label}
          </span>
        </div>
        <Progress 
          value={progressValue} 
          className="h-1.5"
        />
      </div>

      {/* Feedback */}
      {analysis.feedback && (analysis.feedback.warning || analysis.feedback.suggestions.length > 0) && (
        <div className="space-y-1 text-xs text-muted-foreground">
          {analysis.feedback.warning && (
            <p className="text-orange-600">{analysis.feedback.warning}</p>
          )}
          {analysis.feedback.suggestions.length > 0 && (
            <ul className="space-y-0.5">
              {analysis.feedback.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Crack time estimate */}
      {analysis.crackTimesDisplay && (
        <div className="text-xs text-muted-foreground">
          <span>Time to crack: {analysis.crackTimesDisplay.offlineSlowHashing1e4PerSecond}</span>
        </div>
      )}
    </div>
  );
}