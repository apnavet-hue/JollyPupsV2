const servicePages = {
  "pet-day-care": {
    service: "Pet day care",
    eyebrow: "Farm daycare in Gurugram",
    title: "A playful farm day with calm supervision.",
    description:
      "Structured play, rest, enrichment, and handler attention for pets who need a safe daytime routine while you are busy.",
    image: "/assets/jolly-pups-farm-daycare.webp",
    alt: "Dog enjoying supervised daycare at Jolly Pups Paradise",
    badge: "At the farm",
    stats: ["Matched playgroups", "Rest breaks", "Photo updates"],
    benefits: [
      "Supervised social time with pets matched by comfort and energy.",
      "Indoor rest pockets so the day does not become overstimulating.",
      "Fresh water, feeding support, and parent notes followed carefully.",
      "A farm routine that gives city pets room to sniff, stretch, and settle.",
    ],
    includes: ["Temperament check", "Play sessions", "Nap breaks", "Feeding support", "Clean rest areas", "Parent updates"],
    packages: [
      ["Trial Day", "For first-time visitors and routine matching."],
      ["Full Day Care", "A balanced day of activity, rest, and care."],
      ["Recurring Care", "Weekly routines for regular daycare families."],
    ],
    steps: ["Share your pet's routine", "Arrive for a calm introduction", "We guide play and rest", "You receive pickup notes"],
    faqs: [
      ["Can nervous pets join daycare?", "Yes. We begin gently and match activity to your pet's temperament."],
      ["Do pets get rest time?", "Yes. Rest breaks are built into the day so pets do not get overtired."],
      ["Where does daycare happen?", "Daycare happens at our pet farm in Sector 91, Gurugram."],
    ],
  },
  "overnight-boarding": {
    service: "Overnight boarding",
    eyebrow: "Safe farm boarding",
    title: "A sleepover that still feels familiar.",
    description:
      "Clean sleeping areas, calm routines, feeding notes, and attentive handlers for short overnight stays.",
    image: "/assets/jolly-pups-farm-boarding.webp",
    alt: "Comfortable pet boarding space at Jolly Pups Paradise",
    badge: "At the farm",
    stats: ["Clean suites", "Routine meals", "Night checks"],
    benefits: [
      "A predictable evening routine helps pets settle after active farm time.",
      "Handlers follow food, medicine, comfort, and sleep preferences shared by parents.",
      "Separate rest zones keep pets safe, clean, and comfortable.",
      "Updates help you travel without wondering how your pet is doing.",
    ],
    includes: ["Check-in notes", "Meal routine", "Evening walk", "Rest suite", "Night monitoring", "Pickup briefing"],
    packages: [
      ["One Night Stay", "For quick trips, events, and overnight plans."],
      ["Weekend Stay", "Two to three nights with a steady routine."],
      ["Custom Stay", "Boarding planned around your pet's habits."],
    ],
    steps: ["Tell us the routine", "Pack food and essentials", "We settle your pet in", "Pickup with care notes"],
    faqs: [
      ["What should I bring?", "Please bring food, medication if needed, vaccination details, and a familiar comfort item."],
      ["Can my pet board after daycare?", "Yes. Daycare and boarding can be combined when availability allows."],
      ["Do you board cats?", "Yes, subject to temperament, space, and care requirements."],
    ],
  },
  "long-pet-boarding": {
    service: "Long pet boarding",
    eyebrow: "Extended stay care",
    title: "Longer stays with a routine you can trust.",
    description:
      "For holidays, work travel, and recovery support, we build a steady care plan around your pet's normal rhythm.",
    image: "/assets/jolly-pups-inclusive-board.webp",
    alt: "Pets resting during a longer boarding stay",
    badge: "At the farm",
    stats: ["Routine planning", "Regular updates", "Care continuity"],
    benefits: [
      "A written routine keeps feeding, rest, activity, and medication support consistent.",
      "Pets get enough stimulation without losing the calm structure longer stays need.",
      "The team watches appetite, mood, stool, coat, and comfort changes over time.",
      "Parent updates make it easier to stay connected while away.",
    ],
    includes: ["Stay plan", "Daily activity", "Meal tracking", "Health notes", "Grooming add-ons", "Regular updates"],
    packages: [
      ["Weekly Stay", "Ideal for short travel blocks and family trips."],
      ["Extended Stay", "A planned routine for longer travel."],
      ["Care Plus", "Boarding with grooming, consults, or training support."],
    ],
    steps: ["Create the stay plan", "Complete check-in", "Follow daily rhythm", "Review progress before pickup"],
    faqs: [
      ["How often will I get updates?", "We share updates based on the care plan and your preferred communication rhythm."],
      ["Can grooming be added?", "Yes. Grooming can be planned during longer stays when suitable."],
      ["Is long boarding cage-free?", "We use safe supervised time and separate rest spaces based on each pet's needs."],
    ],
  },
  grooming: {
    service: "Grooming",
    eyebrow: "Dog and cat grooming",
    title: "Fresh coats, tidy trims, and gentle grooming.",
    description:
      "Bathing, coat care, trimming, nails, ears, and gentle handling for dogs and cats.",
    image: "/assets/jolly-pups-inclusive-hero.webp",
    alt: "Freshly groomed pet with a calm handler",
    badge: "At home or at farm",
    stats: ["Dogs and cats", "Coat-safe products", "Patient handling"],
    benefits: [
      "Pets stay calmer with slow handling and breaks when they need them.",
      "Coat, skin, paw, ear, and hygiene needs are handled in one planned session.",
      "At-home or farm options make grooming easier for different families.",
      "We guide you on coat maintenance between grooming sessions.",
    ],
    includes: ["Bath and blow dry", "Haircut or trim", "Nail trimming", "Ear cleaning", "Paw care", "De-shedding"],
    packages: [
      ["Classic Groom", "Bath, drying, brushing, nails, ears, and hygiene tidy."],
      ["Full Groom", "Classic care plus haircut or styling for coat needs."],
      ["Cat Grooming", "Calm cat-safe grooming planned around temperament."],
    ],
    steps: ["Choose home or farm", "Share coat and temperament notes", "We groom gently", "You get aftercare guidance"],
    faqs: [
      ["Do you groom both dogs and cats?", "Yes. We support dog and cat grooming with handling based on temperament."],
      ["How long does grooming take?", "Most sessions take 60 to 120 minutes depending on coat, size, and comfort."],
      ["Can anxious pets be groomed?", "Yes. We slow the session down and use breaks when needed."],
    ],
  },
  training: {
    service: "Training",
    eyebrow: "Practical pet training",
    title: "Everyday manners built with patience.",
    description:
      "Positive, routine-friendly training for confidence, leash skills, handling, puppy basics, and better home manners.",
    image: "/assets/jolly-pups-farm-hero.webp",
    alt: "Pet training session at Jolly Pups Paradise",
    badge: "At home or at farm",
    stats: ["Positive methods", "Home routines", "Parent coaching"],
    benefits: [
      "Training focuses on useful behavior your family can maintain at home.",
      "Sessions are adapted for age, confidence, breed needs, and environment.",
      "Parents learn the cues, rewards, and practice rhythm alongside the pet.",
      "Farm sessions can help with focus, social confidence, and outdoor manners.",
    ],
    includes: ["Behavior review", "Goal plan", "Cue practice", "Leash work", "Handling support", "Parent homework"],
    packages: [
      ["Puppy Basics", "Foundations for young pets and new families."],
      ["Manners Program", "Polite greetings, recall, leash basics, and calm settling."],
      ["Confidence Support", "Gentle work for shy, anxious, or easily distracted pets."],
    ],
    steps: ["Discuss goals", "Assess behavior", "Practice together", "Continue with homework"],
    faqs: [
      ["Do you train at home?", "Yes. Training can happen at home or at the farm depending on goals."],
      ["Is training punishment-free?", "We focus on positive, practical, confidence-building methods."],
      ["How many sessions are needed?", "It depends on goals and consistency. We suggest a plan after the first discussion."],
    ],
  },
  "vet-consultation": {
    service: "Vet consultation",
    eyebrow: "Calm health guidance",
    title: "Vet advice without unnecessary stress.",
    description:
      "Book practical veterinary guidance for routine concerns, wellness checks, follow-ups, and next-step decisions.",
    image: "/assets/jolly-pups-inclusive-board-900.webp",
    alt: "Calm pet care consultation",
    badge: "At home or at farm",
    stats: ["Routine checks", "Follow-up advice", "Care clarity"],
    benefits: [
      "A calm consult helps you understand symptoms, care options, and urgency.",
      "Pets can be seen in a more familiar setting when suitable.",
      "We help coordinate vaccination, grooming, boarding, or training needs around health notes.",
      "Clear next steps reduce guesswork for pet parents.",
    ],
    includes: ["Concern review", "Basic wellness check", "Care advice", "Follow-up guidance", "Records note", "Referral direction"],
    packages: [
      ["Wellness Consult", "For routine guidance and general health questions."],
      ["Follow-up Consult", "For ongoing care questions after treatment."],
      ["Boarding Readiness", "Health guidance before daycare or boarding."],
    ],
    steps: ["Share the concern", "Book the slot", "Consult calmly", "Follow the care plan"],
    faqs: [
      ["Is this for emergencies?", "No. Emergencies should go directly to a veterinary hospital."],
      ["Can consults happen at home?", "Yes, depending on availability, location, and the concern."],
      ["Can I combine this with vaccination?", "Yes, when appropriate and scheduled in advance."],
    ],
  },
  vaccinations: {
    service: "Vaccinations",
    eyebrow: "Vaccines and boosters",
    title: "Vaccination visits made simple.",
    description:
      "Schedule core vaccines and boosters with gentle handling, clear reminders, and practical record support.",
    image: "/assets/jolly-pups-inclusive-board-768.webp",
    alt: "Pet vaccination support with gentle handling",
    badge: "At home or at farm",
    stats: ["Core vaccines", "Booster reminders", "Record support"],
    benefits: [
      "We help plan age-appropriate and routine booster appointments.",
      "Gentle handling keeps the visit calmer for pets and parents.",
      "Records and due dates are kept clear so the next booster is easier to remember.",
      "Vaccination planning supports safer daycare, boarding, and grooming visits.",
    ],
    includes: ["Schedule review", "Vaccine visit", "Gentle restraint", "Record update", "Booster guidance", "Care notes"],
    packages: [
      ["Puppy or Kitten Start", "Early vaccine planning for young pets."],
      ["Annual Booster", "Routine booster scheduling and record support."],
      ["Boarding Requirement", "Vaccine readiness before farm stays."],
    ],
    steps: ["Share vaccine history", "Confirm what is due", "Book the visit", "Receive next due notes"],
    faqs: [
      ["Do I need records?", "Yes, please share previous vaccination records when available."],
      ["Can vaccines be done at home?", "Yes, where available and clinically suitable."],
      ["Are vaccines needed for boarding?", "Vaccination status helps us keep every pet safer at the farm."],
    ],
  },
};

const getServiceSlug = () => {
  const segments = window.location.pathname.split("/").filter(Boolean);
  const serviceIndex = segments.indexOf("services");

  if (serviceIndex >= 0 && segments[serviceIndex + 1]) {
    return segments[serviceIndex + 1].replace(".html", "");
  }

  return document.body.dataset.serviceSlug || "grooming";
};

const setText = (selector, text) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = text;
  });
};

const fillList = (selector, items, render) => {
  document.querySelectorAll(selector).forEach((list) => {
    list.innerHTML = items.map(render).join("");
  });
};

const initServicePage = () => {
  const slug = getServiceSlug();
  const service = servicePages[slug] || servicePages.grooming;

  if (document.title === "Service | Jolly Pups Paradise") {
    document.title = `${service.service} | Jolly Pups Paradise`;
  }
  document.querySelector("meta[name='description']")?.setAttribute("content", service.description);

  setText("[data-service-eyebrow]", service.eyebrow);
  setText("[data-service-title]", service.title);
  setText("[data-service-description]", service.description);
  setText("[data-service-badge]", service.badge);
  setText("[data-service-name]", service.service);

  document.querySelectorAll("[data-service-image]").forEach((image) => {
    image.src = service.image;
    image.alt = service.alt;
  });

  document.querySelectorAll("[data-service-book]").forEach((button) => {
    button.dataset.service = service.service;
  });

  fillList("[data-service-stats]", service.stats, (item) => `<span>${item}</span>`);
  fillList("[data-service-benefits]", service.benefits, (item) => `<li>${item}</li>`);
  fillList("[data-service-includes]", service.includes, (item) => `<span>${item}</span>`);
  fillList(
    "[data-service-packages]",
    service.packages,
    ([name, description]) => `<article><h3>${name}</h3><p>${description}</p><button class="catalog-action js-book" data-service="${service.service}" type="button">Book this <b>&nearr;</b></button></article>`
  );
  fillList(
    "[data-service-steps]",
    service.steps,
    (item, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><h3>${item}</h3></article>`
  );
  fillList(
    "[data-service-faqs]",
    service.faqs,
    ([question, answer]) => `<details><summary>${question}<span>+</span></summary><p>${answer}</p></details>`
  );
};

try {
  initServicePage();
} catch (error) {
  console.error(error);
}
