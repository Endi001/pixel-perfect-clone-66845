import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/stride/scenes/Hero";
import { Establish } from "@/components/stride/scenes/Establish";
import { Manifesto } from "@/components/stride/scenes/Manifesto";
import { HorizontalRail } from "@/components/stride/scenes/HorizontalRail";
import { Interrupted } from "@/components/stride/scenes/Interrupted";
import { Biomechanics } from "@/components/stride/scenes/Biomechanics";
import { Treatments } from "@/components/stride/scenes/Treatments";
import { Method } from "@/components/stride/scenes/Method";
import { Testimonials } from "@/components/stride/scenes/Testimonials";
import { ReturnCTA } from "@/components/stride/scenes/ReturnCTA";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Establish />
      <Manifesto />
      <HorizontalRail />
      <Interrupted />
      <Biomechanics />
      <Treatments />
      <Method />
      <Testimonials />
      <ReturnCTA />
    </>
  );
}
