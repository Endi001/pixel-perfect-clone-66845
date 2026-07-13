import heroVideo from "@/assets/hero-run.mp4.asset.json";
import heroPoster from "@/assets/hero-poster.jpg.asset.json";

// Self-hosted hero + poster; other Pexels clips hotlinked for this first pass.
// TODO(self-host): Download & re-encode remaining clips per STRIDE §5.
export const stridemedia = {
  hero: {
    src: heroVideo.url,
    poster: heroPoster.url,
  },
  establish: {
    src: "https://videos.pexels.com/video-files/3125907/3125907-uhd_2560_1440_25fps.mp4",
    poster: "https://images.pexels.com/photos/3125907/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  rail: [
    "https://videos.pexels.com/video-files/3191933/3191933-uhd_2560_1440_25fps.mp4",
    "https://videos.pexels.com/video-files/3191899/3191899-uhd_2560_1440_25fps.mp4",
    "https://videos.pexels.com/video-files/14458139/14458139-hd_1920_1080_24fps.mp4",
    "https://videos.pexels.com/video-files/3264775/3264775-hd_1920_1080_24fps.mp4",
  ],
  // Two persistent layers for the horizontal rail — one wide body plane,
  // one close-up. Each layer plays exactly one clip continuously.
  railLayers: {
    wide: "https://videos.pexels.com/video-files/3191933/3191933-uhd_2560_1440_25fps.mp4",
    closeup: "https://videos.pexels.com/video-files/3264775/3264775-hd_1920_1080_24fps.mp4",
  },
  boxing: {
    src: "https://videos.pexels.com/video-files/9777987/9777987-hd_1920_1080_25fps.mp4",
    poster: "https://images.pexels.com/photos/4761791/pexels-photo-4761791.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  biomechanics: {
    // João Godoy — man running in race, mid-stride
    src: "https://images.pexels.com/photos/24308070/pexels-photo-24308070.jpeg?auto=compress&cs=tinysrgb&w=2000",
  },
  sunset: {
    src: "https://videos.pexels.com/video-files/4440942/4440942-hd_1920_1080_25fps.mp4",
    poster: "https://images.pexels.com/photos/1339919/pexels-photo-1339919.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
};

export const clinic = {
  name: "STRIDE Physiotherapy",
  location: "Ashfield Quay",
  address: "12 Regatta Walk, Ashfield Quay",
  phone: "(555) 018-2044",
  phoneLink: "tel:+15550182044",
  email: "hello@stridephysio.example",
  hours: [
    { d: "Mon–Fri", h: "7:00 – 19:00" },
    { d: "Saturday", h: "9:00 – 13:00" },
    { d: "Sunday", h: "Closed" },
  ],
  heroLine: "Momentum is built, not born.",
  heroSub:
    "We treat pain, rebuild movement, and get you back to full speed — whatever speed means for you.",
  team: [
    { name: "Elena Marsh", role: "Lead Physiotherapist", cred: "MSc Sports Rehabilitation" },
    { name: "Tom Okafor", role: "Physiotherapist", cred: "Manual Therapy Lead" },
    { name: "Priya Anand", role: "Physiotherapist", cred: "Post-Operative Rehabilitation" },
  ],
  services: [
    { n: "01", name: "Back pain", desc: "Persistent low-back and thoracic pain, disc-related symptoms, and post-flare rehabilitation." },
    { n: "02", name: "Neck pain", desc: "Whiplash recovery, tension-driven pain, and cervical mobility restoration." },
    { n: "03", name: "Joint pain", desc: "Knees, hips, shoulders — hands-on assessment and loaded rehabilitation." },
    { n: "04", name: "Muscle pain", desc: "Strains, overuse, and the pain that shows up long after the injury." },
    { n: "05", name: "Post-operative rehabilitation", desc: "Structured return from ACL, rotator cuff, joint replacement and abdominal surgery." },
    { n: "06", name: "Injury recovery", desc: "From acute injury through progressive loading back to full capacity." },
    { n: "07", name: "Mobility problems", desc: "Stiffness, restricted range, and the confidence to move through it again." },
    { n: "08", name: "Chronic pain", desc: "Long-standing pain treated with modern, movement-based rehabilitation." },
    { n: "09", name: "Sports injuries", desc: "Return-to-sport programmes built around your event, position and season." },
  ],
  method: [
    { n: "01", label: "Assess", body: "Movement, load history and the actual mechanics of your pain — measured, not guessed." },
    { n: "02", label: "Treat", body: "Manual therapy where it earns its place, alongside education you can act on the same day." },
    { n: "03", label: "Rebuild", body: "Progressive loading in the exact patterns your body has been avoiding." },
    { n: "04", label: "Return", body: "Back to running, lifting, gardening, parenting — with the capacity to keep going." },
  ],
  testimonials: [
    {
      quote:
        "Six weeks after my knee surgery I could barely walk to the corner shop. Twelve weeks with STRIDE and I ran my first 5k since the injury.",
      name: "Marcus D.", context: "Post-op knee rehab",
    },
    {
      quote:
        "I'd stopped picking up my daughter because of back pain. Elena didn't tell me to rest — she loaded me carefully until my back stopped feeling fragile.",
      name: "Rina S.", context: "Chronic low-back pain",
    },
    {
      quote:
        "Every physio before had told me to stretch and hope. Tom gave me a plan for the exact match I was training for. I played the season out.",
      name: "Owen P.", context: "Recurring hamstring",
    },
  ],
  conditions: ["BACK.", "NECK.", "SHOULDER.", "HIP.", "KNEE.", "ANKLE."],
};
