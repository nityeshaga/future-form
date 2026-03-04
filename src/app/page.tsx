import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  BarChart3,
  Palette,
  MousePointerClick,
  Star,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: MousePointerClick,
    title: "One at a Time",
    description:
      "Questions appear one by one with smooth animations, keeping respondents focused and engaged.",
  },
  {
    icon: Zap,
    title: "8 Question Types",
    description:
      "Short text, long text, email, multiple choice, yes/no, rating, and more — everything you need.",
  },
  {
    icon: Palette,
    title: "Drag & Drop Builder",
    description:
      "Build forms visually with our intuitive drag-and-drop editor. No coding required.",
  },
  {
    icon: BarChart3,
    title: "Response Analytics",
    description:
      "View responses in a clean table, drill into individual submissions, and export to CSV.",
  },
  {
    icon: Star,
    title: "Keyboard Shortcuts",
    description:
      "Respondents can navigate with keyboard — press Enter, use arrow keys, or type letter keys.",
  },
  {
    icon: Shield,
    title: "Shareable Links",
    description:
      "Publish your form and share a simple link. Anyone can respond without signing up.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <span className="text-xl font-bold">FutureForm</span>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get Started
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
          Build forms people{" "}
          <span className="text-primary">love to fill out</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Create beautiful, one-question-at-a-time forms with smooth
          animations and keyboard navigation. Free and open source.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/register">
            <Button size="lg">
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Log in
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold">
            Everything you need
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            A modern form builder with all the essentials.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-lg border bg-background p-6">
                <f.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-3xl font-bold">Ready to create your first form?</h2>
        <p className="mt-3 text-muted-foreground">
          It takes less than a minute to get started.
        </p>
        <Link href="/register">
          <Button size="lg" className="mt-8">
            Get Started for Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>FutureForm — Open source form builder</p>
      </footer>
    </div>
  );
}
