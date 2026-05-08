import { Link } from "react-router";

type ProjectEntry = {
  to: string;
  label: string;
  title: string;
  description: string;
};

const projects: ProjectEntry[] = [
  {
    to: "/project5",
    label: "Project 5",
    title: "AI Agent for LaTeX Optimization",
    description:
      "An AI agent pipeline that, through OpenRouter, automates a practical workflow: optimizing a LaTeX project by reducing its size while preserving visual quality.",
  },
  {
    to: "/project4",
    label: "Project 4",
    title: "Generative Models: VAE and GANs",
    description:
      "Implementation and analysis of the Variational Autoencoder (VAE) and Deep Convolutional GAN (DCGAN) model architectures, trained on the MNIST and Pokemon datasets respectively.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[720px] px-6 py-16 md:py-24">
        <header className="mb-8">
          <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Matthew Denton
          </p>
          <h1 className="mb-5 font-sans text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-strong md:text-5xl">
            CSCI 492 - Deep Learning
          </h1>
          <p className="text-lg leading-relaxed text-ink-muted md:text-xl">
            A collection of project reports written for this course taken in the
            Spring of 2026 at the University of Mississippi.
          </p>
        </header>

        <div className="mb-10 h-px w-full bg-rule" />

        <section>
          <h2 className="mb-8 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Projects
          </h2>

          <ul className="flex flex-col divide-y divide-rule">
            {projects.map((project) => (
              <li key={project.to}>
                <Link
                  to={project.to}
                  className="group block py-8 transition-colors"
                >
                  <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-ink-faint">
                    {project.label}
                  </p>
                  <h3 className="mb-3 font-sans text-2xl font-bold leading-tight tracking-tight text-ink-strong transition-colors group-hover:text-accent md:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mb-4 text-base leading-relaxed text-ink-muted md:text-lg">
                    {project.description}
                  </p>
                  <p className="font-sans text-sm font-medium text-ink-muted transition-colors group-hover:text-accent">
                    Read
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-24 border-t border-rule pt-8">
          <p className="font-sans text-sm text-ink-faint">Matthew Denton</p>
        </footer>
      </div>
    </div>
  );
}
