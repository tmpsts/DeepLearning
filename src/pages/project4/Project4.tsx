import {
  ArticleFooter,
  ArticleHeader,
  ArticleLayout,
  BackLink,
  Divider,
  Figure,
  P,
  Section,
  Subsection,
} from "../../components/article";

import * as assets from "./assets";

export default function Project4Page() {
  return (
    <ArticleLayout>
      <BackLink />
      <article>
        <ArticleHeader
          label="Project 4"
          title="Generative Models: VAE and GANs"
          subtitle="Implementation and analysis of the Variational Autoencoder (VAE) and Deep Convolutional GAN (DCGAN) model architectures, trained on the MNIST and Pokemon datasets respectively."
          byline={{
            author: "Matthew Denton",
            meta: "CSCI 492 - Deep Learning - April 20th, 2026",
          }}
        />

          <Section title="Introduction">
            <P>
              This project explores two separate generative models, the
              Variational Autoencoder (VAE) and the Deep Convolutional GAN
              (DCGAN). Part 1 starts with a basic autoencoder trained on the
              MNIST dataset, examining its evaluation quality and latent space
              to a second (better) model, the VAE. Part 2 trains a DCGAN on the
              Pokemon dataset and studies how the choice of activation in the
              discriminator (standard ReLU vs. Leaky ReLU) affects training
              stability and the quality of the generated samples.
            </P>
          </Section>

          <Section title="Part 1: Variational Autoencoder (VAE)">
            <Subsection title="Task 1: Implement and analyze a basic autoencoder">
              <P>
                For this task, I implemented a basic autoencoder as a pair of
                fully-connected encoder and decoder layers, which compress a
                784-pixel MNIST image down to a latent vector and reconstruct it
                using a mean squared error reconstruction loss. I trained three
                separate models with latent dimensions of 2, 8, and 32 to study
                how the size of the bottleneck affects reconstruction quality
                (Figure 1), and then visualized a batch of reconstructions from
                each model (Figures 2-4). As expected, increasing the latent
                dimension lowers the final training loss and produces visibly
                sharper reconstructions.
              </P>

              <Figure
                src={assets.autoencoder_training}
                alt="Autoencoder training loss by latent size"
                index={1}
              />

              <P>
                The final MSE at dimensions 2, 8, and 32 is 0.0675, 0.0266, and
                0.0109 respectively, with roughly a 6 times drop between dim 2
                and dim 32. Additionally, all three loss curves plateau fairly
                quickly, suggesting that the models are learning to represent
                the data well and are not overfitting.
              </P>

              <P>
                Below are the visual reconstruction results from each version of
                the autoencoder, with the original digit on the top and the
                model's reconstruction on the bottom. At 2 latent dimensions the
                model is visibly unable to reconstruct the digit accurately. The
                reconstructions are blurry, though the model can still
                discriminate broad shapes like 9's, 0's, and 1's. At 8
                dimensions the reconstructions are much closer to the input,
                with the only consistent failure being some confusion between
                4's and 9's. At 32 dimensions the reconstructions are nearly
                perfect, with only minor fringing around digit edges.
              </P>

              <Figure
                src={assets.autoencoder_sample_2}
                alt="Autoencoder reconstructions, latent dim = 2"
                index={2}
              />
              <Figure
                src={assets.autoencoder_sample_8}
                alt="Autoencoder reconstructions, latent dim = 8"
                index={3}
              />
              <Figure
                src={assets.autoencoder_sample_32}
                alt="Autoencoder reconstructions, latent dim = 32"
                index={4}
              />

              <P>
                To probe the learned latent space, I drew 8 random vectors and
                decoded them using the trained decoder for both the 8 and 32
                dimensional models (Figures 5 and 6). The decoded samples are
                mostly noise, with only disconnected fragments of digits
                present. This behavior is expected and is the main motivation
                for moving to a VAE. As in a basic autoencoder, the encoder is
                free to place valid digit embeddings anywhere in the space, at
                arbitrary means and variances and with arbitrary gaps between
                classes. Random sampling therefore lands in regions the decoder
                was never trained on, and the decoder produces unstructured
                output. The 32 dimensional case looks slightly worse because the
                encoded data occupies an even smaller fraction of the total
                latent volume. The takeaway is not that the autoencoder failed
                to learn, but that the representation it learned is not well
                organized.
              </P>

              <Figure
                src={assets.autoencoder_latent_8}
                alt="Random latent samples, autoencoder (hidden = 8)"
                index={5}
              />
              <Figure
                src={assets.autoencoder_latent_32}
                alt="Random latent samples, autoencoder (hidden = 32)"
                index={6}
              />
            </Subsection>

            <Subsection title="Task 2: Implement and analyze a VAE">
              <P>
                For this task, I implemented a VAE with an encoder that outputs
                a mean vector and a log-variance vector, a reparameterized
                sample from the distribution, and an accompanying decoder. I
                then chose a latent dimension of 2 so that the learned latent
                space could be visualized directly on a 2D grid later on. The
                training objective is the negative ELBO, which decomposes into a
                reconstruction term and a KL term. The reconstruction term uses
                binary cross-entropy since MNIST pixels are treated as on/off,
                not continuous values. The KL term measures how far each encoded
                distribution is from a standard normal, and helps keep the
                latent space organized. I trained for 10 epochs on MNIST, with
                the per-sample training loss shown in Figure 7.
              </P>

              <Figure
                src={assets.vae_training}
                alt="VAE training loss (BCE + KL)"
                index={7}
              />

              <P>
                The training loss drops from roughly 184 at epoch 1 to 144 at
                epoch 10 and flattens toward the end, with most of the
                improvement happening in the first four epochs. The loss value
                looks large compared to the autoencoder's MSE because this loss
                is a sum of the BCE reconstruction term over all 784 pixels plus
                the KL term, leading to the large overall loss value.
              </P>

              <P>
                Figure 8 shows 8 samples drawn from the VAE's 2D latent space
                and passed through the decoder. This shows a noticeable
                improvement over the autoencoder samples in Figures 5 and 6,
                especially given that the VAE is generating from only 2
                dimensions while the autoencoders had 8 and 32. The difference
                here is not model capacity, but the KL term forcing the model to
                represent the data in a more structured way. The autoencoder
                samples are reincluded below for a direct side-by-side
                comparison.
              </P>

              <Figure
                src={assets.vae_sample}
                alt="Random samples from the VAE"
                index={8}
              />
              <Figure
                src={assets.autoencoder_latent_8}
                alt="Autoencoder samples, latent dim = 8 (reference)"
                index={5}
              />
              <Figure
                src={assets.autoencoder_latent_32}
                alt="Autoencoder samples, latent dim = 32 (reference)"
                index={6}
              />

              <P>
                To visualize how the VAE organizes digits in its latent space, I
                built a 2D grid of coordinates, decoded each point, and tiled
                the results. Figure 9 uses the range [-1, 1] and Figure 10 uses
                [-5, 5]. The [-1, 1] view zooms in on the dense core of the
                space and shows smooth, continuous morphing between a small
                subset of classes. The [-5, 5] view zooms out and exposes a
                wider set of classes, but the extreme corners degrade into blank
                or malformed outputs. This makes sense as the KL term is pulling
                the encoded distributions toward the center of the space, so the
                decoder is almost never trained on samples drawn from the outer
                edges and has nothing meaningful to produce there.
              </P>

              <Figure
                src={assets.vae_latent_1}
                alt="VAE latent space, range [-1, 1]"
                index={9}
              />
              <Figure
                src={assets.vae_latent_5}
                alt="VAE latent space, range [-5, 5]"
                index={10}
              />
            </Subsection>
          </Section>

          <Divider />

          <Section title="Part 2: Deep Convolutional GAN">
            <Subsection title="Task 1: Implement a deep convolutional GAN">
              <P>
                For this task, I implemented a DCGAN and trained it on the
                Pokemon dataset. The generator takes a noise vector z drawn from
                a standard normal distribution and maps it to a 64x64 RGB image
                through a stack of convolutional layers, each followed by batch
                normalization and a ReLU activation. The discriminator mirrors
                this with its own stack of convolutional layers, batch
                normalization, and Leaky ReLU with alpha = 0.2, collapsing down
                to a single scalar that is passed through a sigmoid to estimate
                whether a given sample is "real" or "fake." The goal is for the
                generator to produce samples that are indistinguishable from the
                real Pokemon training images, attempting to "fool" the
                discriminator into labeling them as real. Figure 11 shows a
                batch of real training images for reference.
              </P>

              <Figure
                src={assets.pokemon_training}
                alt="Pokemon training data"
                index={11}
              />

              <P>
                Figure 12 shows the generator (blue) and discriminator (orange)
                losses per iteration for the Leaky ReLU baseline, trained for
                about 16,000 steps. The discriminator loss drops to near zero
                almost immediately, with occasional spikes when the generator
                briefly tricks it, while the generator loss slowly climbs from
                about 5 to 7. This is a sign that the discriminator is learning
                faster than the generator can keep up. Once the discriminator is
                consistently right, the gradient it passes back to the generator
                carries very little useful information, so the generator
                struggles to improve. The rising generator loss does not mean
                the generator is getting worse in an absolute sense, it means
                the feedback it is getting from the discriminator has become
                less helpful.
              </P>

              <Figure
                src={assets.gan_leaky_training}
                alt="DCGAN with Leaky ReLU loss curves"
                index={12}
              />

              <P>
                Even with that imbalance, the generator did learn useful
                structure over the course of training. Figure 13 visualizes its
                output at different points during training. Each row corresponds
                to a later checkpoint, and the 8 columns show a fixed set of
                noise vectors decoded at each one. The top rows are essentially
                just color blobs. By the middle rows the outputs sharpen into
                vaguely Pokemon shaped silhouettes, and by the bottom rows they
                have recognizable body plans and reasonable color palettes.
              </P>

              <Figure
                src={assets.gan_leaky_pokemon}
                alt="DCGAN with Leaky ReLU samples"
                index={13}
              />
            </Subsection>

            <Subsection title="Task 2: GAN tuning and evaluation">
              <P>
                For the tuning experiment, I replaced the Leaky ReLU in the
                discriminator with standard ReLU and retrained for the same
                number of iterations, leaving everything else unchanged. The
                results are shown in Figures 14 and 15.
              </P>

              <P>
                The ReLU loss curve in Figure 14 has the same rough shape as the
                Leaky run, with the discriminator collapsing and the generator
                drifting upward. The magnitudes are noticeably worse though. The
                generator loss sits around 10 during normal training, compared
                to 5 to 7 for the Leaky run, and spikes above 50 in the final
                1,000 iterations. At that point training has effectively
                collapsed. This is consistent with the "dying ReLU" problem in
                the discriminator. When a ReLU unit receives a negative input,
                it outputs exactly zero and its gradient is also zero, and once
                that happens the unit is stuck and stops contributing to
                training. Leaky ReLU avoids this by letting a small fraction of
                the signal through on negative inputs, which keeps the unit
                active and keeps the gradient flowing. Since the discriminator's
                gradient is the only learning signal the generator sees, losing
                discriminator capacity also directly hurts the generator.
              </P>

              <Figure
                src={assets.gan_relu_training}
                alt="DCGAN with ReLU loss curves"
                index={14}
              />

              <P>
                Figure 15 shows the corresponding samples for the ReLU run. The
                middle rows look roughly comparable to the Leaky run, and the
                generator does learn to produce Pokemon-ish silhouettes. But the
                very last row devolves into a low contrast mess. This breakdown
                lines up in time with the loss spike at the end of Figure 14,
                confirming that training did not just become unstable, it
                actually collapsed in the final iterations.
              </P>

              <Figure
                src={assets.gan_relu_pokemon}
                alt="DCGAN with ReLU samples"
                index={15}
              />

              <P>
                Neither run shows obvious mode collapse in these visualizations
                except for the very last row of the ReLU run. Otherwise, the
                generator produces visibly distinct silhouettes and color
                palettes for the generated pokemon quite well. Overall, Leaky
                ReLU with alpha = 0.2 was clearly more stable than standard ReLU
                in the discriminator and produced the better final samples,
                which matches the recommendation in the DCGAN literature. Both
                runs still showed the same underlying problem of the
                discriminator dominating the generator. But, Leaky ReLU with
                alpha = 0.2 was able to produce more stable and better final
                samples.
              </P>
            </Subsection>
          </Section>

        <ArticleFooter />
      </article>
    </ArticleLayout>
  );
}
