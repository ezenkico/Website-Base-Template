// frontend/src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="border-b">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Website Template
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Launch modern websites faster with Next.js and Strapi
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              A clean starter built for marketing sites, business websites, and
              platforms that need a flexible frontend with a manageable CMS
              backend.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="rounded-md bg-gray-900 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="rounded-md border px-6 py-3 text-center text-sm font-medium transition hover:bg-gray-50"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="w-full max-w-xl rounded-2xl border bg-gray-50 p-6 shadow-sm">
            <div className="space-y-4">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-8 w-3/4 rounded bg-gray-300" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="h-4 w-20 rounded bg-gray-200" />
                  <div className="mt-3 h-6 w-16 rounded bg-blue-200" />
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="h-4 w-20 rounded bg-gray-200" />
                  <div className="mt-3 h-6 w-16 rounded bg-green-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight">
            Built for a practical website stack
          </h2>
          <p className="mt-4 text-gray-600">
            Use this template as a starting point for business websites,
            product sites, landing pages, and CMS-backed platforms.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border p-6">
            <h3 className="text-lg font-semibold">Next.js Frontend</h3>
            <p className="mt-3 text-sm text-gray-600">
              Fast routing, server rendering, and a modern React-based
              foundation.
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <h3 className="text-lg font-semibold">Strapi Backend</h3>
            <p className="mt-3 text-sm text-gray-600">
              Manage pages, content, media, and structured data from a CMS.
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <h3 className="text-lg font-semibold">Reusable Template</h3>
            <p className="mt-3 text-sm text-gray-600">
              A clean base you can extend for client projects and startup sites.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to start building?
            </h2>
            <p className="mt-4 max-w-2xl text-gray-600">
              Customize the content model, connect Strapi data, and turn this
              into your default website foundation.
            </p>

            <div className="mt-8">
              <Link
                href="/login"
                className="inline-flex rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}