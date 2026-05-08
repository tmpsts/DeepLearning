import {
  ArticleFooter,
  ArticleHeader,
  ArticleLayout,
  BackLink,
  Code,
  CodeBlock,
  Figure,
  List,
  P,
  Pass,
  Section,
  Table,
} from "../../components/article";

import * as assets from "./assets";

export default function Project5Page() {
  return (
    <ArticleLayout>
      <BackLink />
      <article>
        <ArticleHeader
          label="Project 5"
          title="AI Agent for LaTeX Optimization"
          subtitle="An AI agent pipeline that, through OpenRouter, automates a practical workflow: optimizing a LaTeX project by reducing its size while preserving visual quality."
          byline={{
            author: "Matthew Denton",
            meta: "CSCI 492 - Deep Learning - May 8th, 2026",
          }}
        />

        <Section title="Introduction">
          <P>
            For this project I built an AI agent pipeline that takes a LaTeX
            project, deletes the non-essential files, compresses images and
            figures, builds the pdf, and verifies that nothing got messed up in
            the process. Every decision step (what to keep, how to compress, and
            whether the final pdf still looks ok) is made by an Ai Agent through
            OpenRouter.
          </P>
          <P>
            For the model, went with <Code>google/gemini-2.5-flash</Code>. It's
            cheap, it's fast, it supports vision, and it's plenty good at the
            kind of structured JSON answers I need. The model can be swapped
            through the <Code>OPENROUTER_MODEL</Code> env variable if I want to
            try something else later.
          </P>
        </Section>

        <Section title="Step 1: Hash-based duplicate removal">
          <P>
            I started first by attempting to remove duplicate files from the
            folder by using a hash based approach to look at files that are
            exactly the same. The plan was fairly simple: SHA-256 every file in
            the project, group files with matching hashes, and have the AI agent
            pick a single survivor in each group of matching files.
          </P>
          <P>
            Then, I passed all these groups of files into the AI agent and gave
            it a prompt to only pick one of the files to keep. This kinda worked
            but proved to not entirely remove all the needed files and wasn't
            very consistent. The model would sometimes keep the wrong copy, like{" "}
            <Code>backups/main_v1.tex</Code> instead of the active{" "}
            <Code>main_v3.tex</Code>, depending on the alphabetic order of the
            group. Even with rules in the prompt to prefer non-backup files, a
            re-run would sometimes still pick the older version. The other
            problem is that hashing only catches identical duplicates. Files
            like <Code>rebuttal.tex</Code> (a separate document sitting next to
            the paper) or <Code>sec/X_suppl.tex</Code> (a commented-out
            supplementary section) aren't duplicates of anything, so they never
            showed up and stayed in the project. (I did decide to keep these
            files in the project later on though.)
          </P>
          <P>
            So this approach was kinda working around the actual problem instead
            of solving it.
          </P>
        </Section>

        <Section title="Step 2: Read the LaTeX source instead">
          <P>
            My next approach was to have the AI agent scan the actual{" "}
            <Code>main_v3.tex</Code> file and other associated files to delete
            only unreferenced files that were not required to compile the pdf.
            The pipeline finds the main <Code>.tex</Code> (the one with{" "}
            <Code>{String.raw`\documentclass`}</Code> and{" "}
            <Code>{String.raw`\begin{document}`}</Code>), bundles up the
            contents of every <Code>.tex</Code> file in the project plus a list
            of every file, and asks the model to return the list of files that
            are actually needed. The model is told to follow{" "}
            <Code>{String.raw`\input`}</Code>,{" "}
            <Code>{String.raw`\include`}</Code>,{" "}
            <Code>{String.raw`\includegraphics`}</Code>,{" "}
            <Code>{String.raw`\bibliography`}</Code>,{" "}
            <Code>{String.raw`\bibliographystyle`}</Code>, and{" "}
            <Code>{String.raw`\usepackage`}</Code> references, ignore
            commented-out code, and ignore alternate documents. Anything not in
            the keep list gets deleted.
          </P>
          <P>
            On implementing this change I got the following output below. I also
            added some code to remove build artifacts (.aux, .fls, etc) before
            zipping the folder.
          </P>

          <CodeBlock label="Pipeline output">
            {`Main LaTeX file: main_v3.tex
              AI marked 33 files as required.
              Deleted 31 unreferenced files:
                - README.md
                - rebuttal.tex
                - backups/main_v1.tex
                - backups/main_v2.tex
                - sec/X_suppl.tex
                - figures/illustrations/illustration v1-2.jpg
                - figures/illustrations/illustration v1.jpg
                - figures/illustrations/illustration_v2.jpg
                - figures/illustrations/vis v1-1.jpg
                - figures/illustrations/vis_v1.jpg
                - figures/comparison_on_dataset_A/example_3/input_img.jpg
                - figures/comparison_on_dataset_A/example_3/method_diffusion.jpg
                - figures/comparison_on_dataset_A/example_3/method_JEPA.jpg
                - figures/comparison_on_dataset_A/example_3/method_mamba.jpg
                - figures/comparison_on_dataset_A/example_3/method_ResNet.jpg
                - figures/comparison_on_dataset_A/example_3/method_RNN.jpg
                - figures/comparison_on_dataset_A/example_3/method_Transformer.jpg
                - figures/comparison_on_dataset_A/example_4/input_img.jpg
                - figures/comparison_on_dataset_A/example_4/method_ResNet.jpg
                - figures/comparison_on_dataset_A/example_4/method_RNN.jpg
                - figures/comparison_on_dataset_A/example_4/method_Transformer.jpg
                - figures/comparison_on_dataset_A/example_5/method_diffusion.jpg
                - figures/comparison_on_dataset_A/example_5/method_JEPA.jpg
                - figures/comparison_on_dataset_A/example_5/method_mamba.jpg
                - backups/figures/illustration/illustration v1-2.jpg
                - backups/figures/illustration/illustration v1.jpg
                - backups/figures/illustration/illustration-v3.jpg
                - backups/figures/illustration/illustration_v2.jpg
                - backups/figures/illustration/vis v1-1.jpg
                - backups/figures/illustration/vis-v2.jpg
                - backups/figures/illustration/vis_v1.jpg
              Removed 4 empty folders:
                - figures/comparison_on_dataset_A/example_3
                - backups/figures/illustration
                - backups/figures
                - backups
              Output folder: 101.12 MB
              Project zip:   100.47 MB (Part 1 < 50 MB, Part 3 < 30 MB)
              Compiled PDF:  50.57 MB (Part 2 < 30 MB, Part 3 < 15 MB)`}
          </CodeBlock>

          <P>
            This actually fixed the duplicates problem too, since the alternate
            image versions just don't show up in the keep list (nothing in{" "}
            <Code>main_v3.tex</Code> references them). It also caught files that
            hashing couldn't have caught, like <Code>rebuttal.tex</Code> and{" "}
            <Code>sec/X_suppl.tex</Code>.
          </P>
        </Section>

        <Section title="Step 3: Image compression">
          <P>
            Now that I had completed this step, removing all unneeded files, I
            was left with a 100MB zip file and 50MB pdf. My next goal was to
            reduce the sizes. Using a file explorer tool, I had found that
            pretty much all of the data was taken up by the PDF and the images.
            This made my next goal to compress the image files.
          </P>

          <Figure
            src={assets.file_sizes}
            alt="File size breakdown of the project folder"
            index={1}
          />

          <P>
            Instead of picking the compression numbers myself, I made this its
            own AI step. The pipeline builds an inventory of every image (path,
            format, size in MB), feeds it to the model along with the current
            uncompressed project size and the target zip size (50 MB), and asks
            for a JSON plan with three fields: <Code>max_edge_px</Code>,{" "}
            <Code>jpeg_quality</Code>, and a short rationale. The plan then gets
            applied uniformly with PIL. Every image gets resized to the
            suggested long edge and re-encoded at the suggested JPEG quality. If
            the new file ends up bigger than the original (which can happen for
            tiny images), the temp file gets thrown away and the original is
            left alone.
          </P>

          <P>And boom!</P>

          <CodeBlock label="Pipeline output with compression">
            {`OpenRouter model: google/gemini-2.5-flash
              Copied project to: --hidden--
              Main LaTeX file: main_v3.tex
              AI marked 33 files as required.
              Deleted 31 unreferenced files:
                - README.md
                - rebuttal.tex
                - backups/main_v1.tex
                - backups/main_v2.tex
                - sec/X_suppl.tex
                - figures/illustrations/illustration v1-2.jpg
                - figures/illustrations/illustration v1.jpg
                - figures/illustrations/illustration_v2.jpg
                - figures/illustrations/vis v1-1.jpg
                - figures/illustrations/vis_v1.jpg
                - figures/comparison_on_dataset_A/example_3/input_img.jpg
                - figures/comparison_on_dataset_A/example_3/method_diffusion.jpg
                - figures/comparison_on_dataset_A/example_3/method_JEPA.jpg
                - figures/comparison_on_dataset_A/example_3/method_mamba.jpg
                - figures/comparison_on_dataset_A/example_3/method_ResNet.jpg
                - figures/comparison_on_dataset_A/example_3/method_RNN.jpg
                - figures/comparison_on_dataset_A/example_3/method_Transformer.jpg
                - figures/comparison_on_dataset_A/example_4/input_img.jpg
                - figures/comparison_on_dataset_A/example_4/method_ResNet.jpg
                - figures/comparison_on_dataset_A/example_4/method_RNN.jpg
                - figures/comparison_on_dataset_A/example_4/method_Transformer.jpg
                - figures/comparison_on_dataset_A/example_5/method_diffusion.jpg
                - figures/comparison_on_dataset_A/example_5/method_JEPA.jpg
                - figures/comparison_on_dataset_A/example_5/method_mamba.jpg
                - backups/figures/illustration/illustration v1-2.jpg
                - backups/figures/illustration/illustration v1.jpg
                - backups/figures/illustration/illustration-v3.jpg
                - backups/figures/illustration/illustration_v2.jpg
                - backups/figures/illustration/vis v1-1.jpg
                - backups/figures/illustration/vis-v2.jpg
                - backups/figures/illustration/vis_v1.jpg
              Removed 4 empty folders:
                - figures/comparison_on_dataset_A/example_3
                - backups/figures/illustration
                - backups/figures
                - backups
              Compression plan: max_edge=1500px, jpeg_quality=85
                Rationale: To reduce the project size by 0.44 MB, I'm setting max_edge_px
                to 1500 and jpeg_quality to 85. This should achieve the target size
                without noticeable degradation in visual quality, aligning well with
                typical two-column paper requirements.
              Compressed 23 images:
                - figures/comparison_on_dataset_A/example_1/method_mamba.jpg: -3.16 MB
                - figures/comparison_on_dataset_A/example_5/method_Transformer.jpg: -2.93 MB
                - figures/comparison_on_dataset_A/example_4/method_diffusion.jpg: -2.79 MB
                - figures/comparison_on_dataset_A/example_1/method_ResNet.jpg: -2.73 MB
                - figures/illustrations/illustration-v3.jpg: -3.07 MB
                - figures/comparison_on_dataset_A/example_2/method_JEPA.jpg: -2.25 MB
                - figures/comparison_on_dataset_A/example_2/method_diffusion.jpg: -2.04 MB
                - figures/comparison_on_dataset_A/example_2/input_img.jpg: -1.93 MB
                - figures/illustrations/vis-v2.jpg: -1.80 MB
                - figures/comparison_on_dataset_A/example_2/method_RNN.jpg: -1.85 MB
                - figures/comparison_on_dataset_A/example_5/method_RNN.jpg: -1.81 MB
                - figures/comparison_on_dataset_A/example_1/method_diffusion.jpg: -1.74 MB
                - figures/comparison_on_dataset_A/example_5/input_img.jpg: -1.57 MB
                - figures/comparison_on_dataset_A/example_5/method_ResNet.jpg: -1.53 MB
                - figures/comparison_on_dataset_A/example_2/method_ResNet.jpg: -1.38 MB
                - figures/comparison_on_dataset_A/example_2/method_mamba.jpg: -1.45 MB
                - figures/comparison_on_dataset_A/example_1/method_JEPA.jpg: -1.38 MB
                - figures/comparison_on_dataset_A/example_2/method_Transformer.jpg: -1.34 MB
                - figures/comparison_on_dataset_A/example_1/method_RNN.jpg: -1.31 MB
                - figures/comparison_on_dataset_A/example_1/method_Transformer.jpg: -0.97 MB
                - figures/comparison_on_dataset_A/example_4/method_mamba.jpg: -0.95 MB
                - figures/comparison_on_dataset_A/example_1/input_img.jpg: -0.81 MB
                - figures/comparison_on_dataset_A/example_4/method_JEPA.jpg: -0.65 MB
              Removed 8 build artifacts:
                - main_v3.aux
                - main_v3.bbl
                - main_v3.blg
                - main_v3.brf
                - main_v3.fdb_latexmk
                - main_v3.fls
                - main_v3.log
                - main_v3.out
              Output folder: 18.13 MB
              Project zip:   18.05 MB (Part 1 < 50 MB, Part 3 < 30 MB)
              Compiled PDF:  9.13 MB (Part 2 < 30 MB, Part 3 < 15 MB)
              Credits: $310.00 total, $4.4287 used, $305.5713 left`}
          </CodeBlock>

          <P>
            The output zip and compiled PDF are now under the 30MB and 15MB
            limits for part 1, 2, AND 3. I did not expect this to all happen at
            once but it seems like it worked. The model picked a pretty gentle
            plan (1500 px, quality 85), I think because the prompt tells it that
            aggressive compression hurts visual quality grading and that quality
            85 is usually indistinguishable from 95 in print. That ended up
            being plenty.
          </P>
        </Section>

        <Section title="Step 4: Verification">
          <P>
            For the last thing, I do want to implement a verification step too
            that uses the AI model to ensure nothing with this pdf is out of
            wack, so I'll do that now.
          </P>
          <P>The verifier has two layers:</P>

          <List
            ordered
            items={[
              <>
                <strong className="font-semibold text-ink-strong">
                  Structural.
                </strong>{" "}
                Pure Python, no API call. Reads the LaTeX <Code>.log</Code>{" "}
                file, flags any <Code>! </Code> errors and any undefined
                references or citations, and complains if the produced pdf is
                missing or under 20 KB. This catches almost every "did the build
                go wrong" case.
              </>,
              <>
                <strong className="font-semibold text-ink-strong">
                  Visual.
                </strong>{" "}
                Renders pdf pages with <Code>pypdfium2</Code> and sends them to
                the vision model with a prompt that asks for visible problems
                like missing figures, garbled text, or broken layout.
              </>,
            ]}
          />

          <CodeBlock label="First verification run">
            {`Structural verification: 2 issue(s)
                [WARNING]: LaTeX Warning: Reference \`fig:short' on page 1 undefined on input line 53.
                [WARNING]: LaTeX Warning: Reference \`fig:short-a' on page 1 undefined on input line 86.
              Visual verification: 1 issue(s)
                [WARNING] page 1: Text refers to a figure on page 11 (Figure 1), but the current image is on page 1.
              Verification passed.

              Removed 8 build artifacts.

              Output folder: 18.15 MB
              Project zip:   18.06 MB (Part 1 < 50 MB, Part 3 < 30 MB)
              Compiled PDF:  9.13 MB (Part 2 < 30 MB, Part 3 < 15 MB)
              Credits: $310.00 total, $4.4313 used, $305.5687 left`}
          </CodeBlock>

          <P>
            Done, the verification step now completes and gives some helpful
            information. It can be seen that the information provided may not
            always be correct (e.g. the visual warning is just a
            misunderstanding of the text) but it does seem to work well. I
            decided to manually make the images way worse than usual to test out
            if it can see it.
          </P>

          <CodeBlock label="Run with intentionally degraded images (page-only verifier)">
            {`Structural verification: 2 issue(s)
                [WARNING]: LaTeX Warning: Reference \`fig:short' on page 1 undefined on input line 53.
                [WARNING]: LaTeX Warning: Reference \`fig:short-a' on page 1 undefined on input line 86.
              Visual verification: 2 issue(s)
                [WARNING] page 1: Figure 1 is present, but missing its rightmost portion.
                [ERROR] page 3: Figure 2 is present, but missing its rightmost portion.

              1 major issue(s) detected.
              Retry pipeline? [Y/n]: n`}
          </CodeBlock>

          <P>
            Well that's not quite right. When retrying too it will spit out
            errors, but almost always those errors are not about visual quality,
            but about the positioning of the elements. Except, the position of
            the elements is just fine, it's only the quality that has changed. I
            believe the issue stems from using the pdf as the sole source of
            truth. By the time a butchered JPEG gets embedded in the rendered
            page, it shows up as a fairly small thumbnail, and at 1.5x render
            scale the JPEG block artifacts are basically invisible. The model
            only sees the page-level view and can't really tell that the figure
            looks awful when you zoom in on it. Next, I'll append the actual
            source image files to the prompt as well, to see if that might help
            if the AI has access to each individual image.
          </P>

          <Figure
            src={assets.bad_images}
            alt="Source images sent to the verifier after the quality=2 test"
            index={2}
          />

          <CodeBlock label="Run with source images attached to the verifier">
            {`Structural verification: 2 issue(s)
                [WARNING]: LaTeX Warning: Reference \`fig:short' on page 1 undefined on input line 53.
                [WARNING]: LaTeX Warning: Reference \`fig:short-a' on page 1 undefined on input line 86.
              Visual verification: 23 issue(s)
                [ERROR] image figures/comparison_on_dataset_A/example_1/input_img.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_1/method_diffusion.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_1/method_JEPA.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_1/method_mamba.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_1/method_ResNet.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_1/method_RNN.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_1/method_Transformer.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_2/input_img.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_2/method_diffusion.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_2/method_JEPA.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_2/method_mamba.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_2/method_ResNet.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_2/method_RNN.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_2/method_Transformer.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_4/method_diffusion.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_4/method_JEPA.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_4/method_mamba.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_5/input_img.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_5/method_ResNet.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_5/method_RNN.jpg: Severe JPEG block artifacts
                [ERROR] image figures/comparison_on_dataset_A/example_5/method_Transformer.jpg: Severe JPEG block artifacts
                [ERROR] image figures/illustrations/illustration-v3.jpg: Severe JPEG block artifacts and pixelation
                [ERROR] image figures/illustrations/vis-v2.jpg: Severe JPEG block artifacts and pixelation

              23 major issue(s) detected.`}
          </CodeBlock>

          <P>
            And, there we go! Using the images themselves seems to have resolved
            this issue. Now when the JPEG compression gets too aggressive, the
            visual verification system will pick it up and send an error. The
            prompt also got updated to make the model look at each source image
            as a standalone photo (not as a tiny figure on a page) and to use{" "}
            <Code>error</Code> severity for severe JPEG blockiness.
          </P>

          <P>
            When any verification issue comes back with{" "}
            <Code>severity == "error"</Code>, the pipeline now prints{" "}
            <Code>Retry pipeline? [Y/n]:</Code>. Pressing Enter or{" "}
            <Code>y</Code> re-runs the whole flow from scratch (copy, prune,
            compress, build, verify), and since the AI's compression plan can
            vary slightly between calls, a retry can actually produce different
            output. Pressing <Code>n</Code> exits the loop and just finalizes
            whatever the last attempt produced.
          </P>

          <P>
            One small tweak I made after this was to make the visual verifier
            less strict. On a normal run it was returning a bunch of warnings
            for images that were already kinda blurry to start with, before any
            compression even happened, and it was getting noisy. The prompt now
            tells the model that figures end up small in the printed paper, that
            minor JPEG artifacts at full resolution will not be visible at print
            size, and to ignore stuff like slight blurriness, soft edges, and
            subtle banding. It only flags things that would actually be visible
            in the rendered pdf, like missing figures or images that are clearly
            destroyed.
          </P>

          <P>
            Running one last time, it now compiles fully with the verification
            step, reducing the total well below the needed requirements. Here is
            the full pipeline output:
          </P>

          <CodeBlock label="Final end-to-end pipeline run">
            {`OpenRouter model: google/gemini-2.5-flash

              === Pipeline attempt 1 ===
              Copied project to: --hidden--
              Main LaTeX file: main_v3.tex
              AI marked 33 files as required.
              Deleted 26 unreferenced files:
                - figures/illustrations/illustration v1-2.jpg
                - figures/illustrations/illustration v1.jpg
                - figures/illustrations/illustration_v2.jpg
                - figures/illustrations/vis v1-1.jpg
                - figures/illustrations/vis_v1.jpg
                - figures/comparison_on_dataset_A/example_3/input_img.jpg
                - figures/comparison_on_dataset_A/example_3/method_diffusion.jpg
                - figures/comparison_on_dataset_A/example_3/method_JEPA.jpg
                - figures/comparison_on_dataset_A/example_3/method_mamba.jpg
                - figures/comparison_on_dataset_A/example_3/method_ResNet.jpg
                - figures/comparison_on_dataset_A/example_3/method_RNN.jpg
                - figures/comparison_on_dataset_A/example_3/method_Transformer.jpg
                - figures/comparison_on_dataset_A/example_4/input_img.jpg
                - figures/comparison_on_dataset_A/example_4/method_ResNet.jpg
                - figures/comparison_on_dataset_A/example_4/method_RNN.jpg
                - figures/comparison_on_dataset_A/example_4/method_Transformer.jpg
                - figures/comparison_on_dataset_A/example_5/method_diffusion.jpg
                - figures/comparison_on_dataset_A/example_5/method_JEPA.jpg
                - figures/comparison_on_dataset_A/example_5/method_mamba.jpg
                - backups/figures/illustration/illustration v1-2.jpg
                - backups/figures/illustration/illustration v1.jpg
                - backups/figures/illustration/illustration-v3.jpg
                - backups/figures/illustration/illustration_v2.jpg
                - backups/figures/illustration/vis v1-1.jpg
                - backups/figures/illustration/vis-v2.jpg
                - backups/figures/illustration/vis_v1.jpg
              Removed 3 empty folders:
                - figures/comparison_on_dataset_A/example_3
                - backups/figures/illustration
                - backups/figures
              Compression plan: max_edge=1500px, jpeg_quality=85
                Rationale: Project is only slightly over budget. Reducing max edge to
                1500px and JPEG quality to 85 will likely achieve target without
                significant visual quality loss. This is a gentle approach.
              Compressed 23 images:
                - figures/comparison_on_dataset_A/example_1/method_mamba.jpg: -3.16 MB
                - figures/comparison_on_dataset_A/example_5/method_Transformer.jpg: -2.93 MB
                - figures/comparison_on_dataset_A/example_4/method_diffusion.jpg: -2.79 MB
                - figures/comparison_on_dataset_A/example_1/method_ResNet.jpg: -2.73 MB
                - figures/illustrations/illustration-v3.jpg: -3.07 MB
                - figures/comparison_on_dataset_A/example_2/method_JEPA.jpg: -2.25 MB
                - figures/comparison_on_dataset_A/example_2/method_diffusion.jpg: -2.04 MB
                - figures/comparison_on_dataset_A/example_2/input_img.jpg: -1.93 MB
                - figures/illustrations/vis-v2.jpg: -1.80 MB
                - figures/comparison_on_dataset_A/example_2/method_RNN.jpg: -1.85 MB
                - figures/comparison_on_dataset_A/example_5/method_RNN.jpg: -1.81 MB
                - figures/comparison_on_dataset_A/example_1/method_diffusion.jpg: -1.74 MB
                - figures/comparison_on_dataset_A/example_5/input_img.jpg: -1.57 MB
                - figures/comparison_on_dataset_A/example_5/method_ResNet.jpg: -1.53 MB
                - figures/comparison_on_dataset_A/example_2/method_ResNet.jpg: -1.38 MB
                - figures/comparison_on_dataset_A/example_2/method_mamba.jpg: -1.45 MB
                - figures/comparison_on_dataset_A/example_1/method_JEPA.jpg: -1.38 MB
                - figures/comparison_on_dataset_A/example_2/method_Transformer.jpg: -1.34 MB
                - figures/comparison_on_dataset_A/example_1/method_RNN.jpg: -1.31 MB
                - figures/comparison_on_dataset_A/example_1/method_Transformer.jpg: -0.97 MB
                - figures/comparison_on_dataset_A/example_4/method_mamba.jpg: -0.95 MB
                - figures/comparison_on_dataset_A/example_1/input_img.jpg: -0.81 MB
                - figures/comparison_on_dataset_A/example_4/method_JEPA.jpg: -0.65 MB
              Structural verification: 2 issue(s)
                [WARNING]: LaTeX Warning: Reference \`fig:short' on page 1 undefined on input line 53.
                [WARNING]: LaTeX Warning: Reference \`fig:short-a' on page 1 undefined on input line 86.
              Visual verification: clean
              Verification passed.

              Removed 8 build artifacts.

              Output folder: 18.15 MB
              Project zip:   18.06 MB (Part 1 < 50 MB, Part 3 < 30 MB)
              Compiled PDF:  9.13 MB (Part 2 < 30 MB, Part 3 < 15 MB)
              Credits: $310.00 total, $4.4741 used, $305.5259 left`}
          </CodeBlock>
        </Section>

        <Section title="Final numbers">
          <Table
            columns={["", "Original", "After pipeline"]}
            rows={[
              ["Project zip", "100.47 MB", "18.06 MB"],
              ["Compiled PDF", "50.57 MB", "9.13 MB"],
            ]}
          />

          <P>
            A single pipeline run hits all three parts with the gentle 1500 px /
            quality 85 plan. The whole thing costs about $0.04 of OpenRouter
            credit per attempt (one text call to pick required files, one text
            call for the compression plan, and one multimodal call for visual
            verification), which is well under the $25 budget. Overall, I spent
            around $5 of AI credits on this project.
          </P>
        </Section>

        <ArticleFooter />
      </article>
    </ArticleLayout>
  );
}
