import Link from "next/link";

export default function FormNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">Form not found</h1>
      <p className="mt-2 text-muted-foreground">
        This form doesn&apos;t exist or is no longer accepting responses.
      </p>
      <Link
        href="/"
        className="mt-6 text-primary hover:underline"
      >
        Go to homepage
      </Link>
    </div>
  );
}
