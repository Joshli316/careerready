"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Input } from "@/components/ui/Input";

const categories = [
  {
    name: "Work Habits",
    items: [
      "I understand and follow company rules and regulations",
      "I show up on time and call in promptly when late or sick",
      "I maintain good personal hygiene and dress appropriately",
      "I limit personal cell phone use to breaks and rest periods",
      "I am honest with time reporting and don't misuse company resources",
    ],
  },
  {
    name: "Performance of Duties",
    items: [
      "I understand my job duties and responsibilities",
      "I am meeting performance goals and standards",
      "I look for ways to use my skills to benefit the organization",
      "I am confident in my ability to perform my work assignments",
    ],
  },
  {
    name: "Communication & Feedback",
    items: [
      "I relate to co-workers and customers professionally",
      "I respond well to constructive criticism and learn from feedback",
      "I speak up when there is a problem and admit mistakes",
      "I treat co-workers with respect — no inappropriate behavior",
    ],
  },
  {
    name: "Professional Growth",
    items: [
      "I seek ways to remain productive without being told",
      "I have learned new skills",
      "I have assisted with tasks outside my job description",
      "I am a valued employee who contributes to the organization",
    ],
  },
];

export default function SelfEvaluationPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({});

  function setRating(item: string, value: number) {
    setRatings({ ...ratings, [item]: value });
  }

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
  const ratedItems = Object.keys(ratings).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">New Employee Self-Evaluation</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Track your progress at 1, 3, and 6 months. Rate yourself honestly on each item.
        </p>
      </div>

      <Callout type="tip" className="mb-6">
        Most employers have a 3-6 month probationary period. Use this evaluation to identify
        areas for improvement before your formal review.
      </Callout>

      <div className="mb-4 text-sm text-neutral-500">
        1 = Poor &nbsp; 2 = Fair &nbsp; 3 = Average &nbsp; 4 = Above Average &nbsp; 5 = Outstanding
      </div>

      <div className="space-y-6">
        {categories.map((cat) => (
          <section key={cat.name} className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-neutral-800">{cat.name}</h2>
            <div className="space-y-3">
              {cat.items.map((item) => (
                <div key={item} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-neutral-700 flex-1">{item}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRating(item, n)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          ratings[item] === n
                            ? "bg-primary-400 text-white"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-neutral-50 border border-neutral-150 p-4 text-sm text-neutral-500">
        Rated {ratedItems} of {totalItems} items.
        {ratedItems === totalItems && Object.values(ratings).length > 0 && (
          <span className="ml-2 font-medium text-primary-700">
            Average: {(Object.values(ratings).reduce((a, b) => a + b, 0) / ratedItems).toFixed(1)} / 5.0
          </span>
        )}
      </div>
    </div>
  );
}
