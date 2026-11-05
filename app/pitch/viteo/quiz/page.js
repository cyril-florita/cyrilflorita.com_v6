import Quiz from "@/components/viteo/Quiz";

export const metadata = {
  title: "Personalize your vitamin pack",
  description: "Eight quick questions build a daily vitamin pack, with the reason for every pill. A live, working personalization flow from Viteo, a design and dev pitch by Cyril Florita.",
  alternates: { canonical: "/pitch/viteo/quiz/" },
};

export default function QuizPage() {
  return <Quiz />;
}
