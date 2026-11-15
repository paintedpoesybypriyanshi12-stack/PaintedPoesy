/* ------------------------------------------------------------------
   Painted Poesy by Priyanshi: site content
   Edit this file to update artwork details. The Navarathna page, the
   artwork pop-ups and the contact form are all built from it.
   Leave a field as null to hide it.
------------------------------------------------------------------- */

window.SITE = {
  // While true, unconfirmed details carry a small "To confirm" tag and
  // bracketed template text stays visible. Set to false before launch.
  draft: true,

  // Contact form, delivered by Web3Forms (free plan) to the inbox the access
  // key was created for (paintedpoesybypriyanshi12@gmail.com).
  // The access key is a PUBLIC form identifier, not a password: it is sent
  // from the visitor's browser, so anyone can see it in the page source.
  // That is how Web3Forms is designed; the key can only deliver to the inbox
  // it was verified for. While accessKey is empty, the form says it is not
  // connected and sends nothing.
  web3forms: {
    endpoint: "https://api.web3forms.com/submit",
    accessKey: "a2dce3ab-458c-4b43-8254-f53101a63f39",
    subject: "New inquiry — Painted Poesy by Priyanshi",
    fromName: "Painted Poesy website", // display name on the notification, never the visitor's
    // Free hCaptcha spam check, loaded through Web3Forms' own script. It must
    // ALSO be switched on for this form in the Web3Forms dashboard.
    hcaptcha: true,
  },

  contactEmail: "paintedpoesybypriyanshi12@gmail.com",
  instagram: "https://www.instagram.com/priartgram",
};

/* Series order follows the traditional Navaratna sequence.
   gemConfirmed: true where the series copy describes this exact painting;
   false where the pairing is a provisional match by colour. */
window.WORKS = [
  {
    id: "ruby", gem: "Ruby", gemConfirmed: true,
    association: "Sun · Surya",
    tagline: "The courage to take up space.",
    image: "images/works/ruby.jpg", alt: "Ruby, framed: a Navarathna painting in crimson and rose, with two crossing bands of deep red crystal.",
    views: [],
    statement: [
      "Ruby begins with a question about presence: what does it mean to stand fully within your own life?",
      "I approach this work through the idea of an inner center—the part of us that can remain steady without becoming rigid. I am interested in confidence that does not depend on spectacle, and strength that does not need to overpower everything around it.",
      "Rather than treating radiance as something that asks for attention, I think of it as something that comes from being deeply grounded in yourself.",
      "Within Navarathna, Ruby is my exploration of being visible without becoming someone else.",
    ],
  },
  {
    id: "pearl", gem: "Pearl", gemConfirmed: true,
    association: "Moon · Chandra",
    tagline: "Softness, with a presence of its own.",
    image: "images/works/pearl.jpg", alt: "Pearl, framed: a Navarathna painting in white, silver-grey, blush and lilac, scattered with raised pearl-like forms.",
    views: [],
    statement: [
      "Pearl is my study of quiet attention.",
      "White, silver-gray, and delicate traces of blush and lilac move across the surface, while raised pearl-like forms interrupt the flow. Their shadows become part of the composition: small reminders that even a pale surface can hold depth and contrast.",
      "I wanted to explore softness without treating it as absence. Here, restraint does not mean emptiness, and calm does not require everything to stand still.",
      "The scattered forms invite a slower way of looking, one detail at a time. Pearl holds a space for the feelings that arrive quietly—and still deserve to be noticed.",
    ],
  },
  {
    id: "red-coral", gem: "Red Coral", gemConfirmed: true,
    association: "Mars · Mangala",
    tagline: "Strength does not always arrive loudly.",
    image: "images/works/red-coral.jpg", alt: "Red Coral, framed: a Navarathna painting in blush pink and pale marbling, crossed by rose-toned crystal clusters.",
    views: [],
    statement: [
      "In Red Coral, I explore the possibility that tenderness and resolve can occupy the same space.",
      "Blush-pink currents and pale marbling move around rose-toned, light-catching clusters. The color feels gentle; the surface has a more insistent presence. I am interested in what happens when those qualities coexist rather than compete.",
      "The contrast is central to my interpretation. Courage need not announce itself through force or severity. It can exist within sensitivity, care, and the willingness to remain open.",
      "Sometimes strength is the quieter decision to begin, to continue, or to hold your ground without hardening yourself.",
    ],
  },
  {
    id: "emerald", gem: "Emerald", gemConfirmed: true,
    association: "Mercury · Budha",
    tagline: "A thought becoming a landscape.",
    image: "images/works/emerald.jpg", alt: "Emerald, framed: a Navarathna painting in emerald green with gold-veined currents and dark and bright green crystal clusters.",
    views: [],
    statement: [
      "Emerald is an exploration of connection.",
      "Green passages open into gold-veined currents, while darker and brighter clusters gather across the surface. My eye moves between them as though following an idea—finding a direction, losing it, and discovering another way through.",
      "The painting brings together flowing passages and concentrated forms without forcing them into a single rhythm. I think of it as a conversation between clarity and complexity.",
      "Not everything needs to become simple to become meaningful. Sometimes understanding begins when we notice the relationships within what first appears tangled.",
    ],
  },
  {
    id: "yellow-sapphire", gem: "Yellow Sapphire", gemConfirmed: true,
    association: "Jupiter · Brihaspati / Guru",
    tagline: "Making room for light.",
    image: "images/works/yellow-sapphire.jpg", alt: "Yellow Sapphire, framed: a Navarathna painting in gold and yellow currents around a concentrated field of reflective golden detail.",
    views: [],
    statement: [
      "Yellow Sapphire begins with luminosity, but I wanted to give that brightness substance.",
      "Gold and yellow currents spread across the canvas around a concentrated field of reflective detail. Open passages and dense texture offer two different ways of experiencing the same light: one expansive, the other gathered and held.",
      "For me, this painting is a meditation on generosity—not only what we give, but what we allow ourselves to receive.",
      "Time to learn. Space to grow. The possibility that there may be more ahead than we can presently see.",
      "I wanted the work to feel abundant without feeling crowded: a reminder that expansion can also mean making room.",
    ],
  },
  {
    id: "diamond", gem: "Diamond", gemConfirmed: true,
    association: "Venus · Shukra",
    tagline: "Clarity without simplicity.",
    image: "images/works/diamond.jpg", alt: "Diamond, framed: a Navarathna painting in silver and white marbling around a large faceted field of clear crystal.",
    views: [],
    statement: [
      "With Diamond, I am interested in a beauty that reveals itself through attention.",
      "The idea is not perfection as a flawless surface. It is the possibility that many facets—different, contrasting, sometimes difficult to reconcile—can belong to one whole.",
      "I think about clarity not as the removal of every complexity, but as a way of seeing those complexities more honestly. Strength and sensitivity need not diminish one another. Each can make the other more visible.",
      "Within Navarathna, Diamond becomes an exploration of how something can feel resolute while remaining responsive to what surrounds it.",
    ],
  },
  {
    id: "blue-sapphire", gem: "Blue Sapphire", gemConfirmed: true,
    association: "Saturn · Shani",
    tagline: "Depth asks us to stay.",
    image: "images/works/blue-sapphire.jpg", alt: "Blue Sapphire, framed: a Navarathna painting in sea green and white marbling crossed by sweeping bands of cobalt crystal.",
    views: [],
    statement: [
      "Blue Sapphire is my exploration of patience.",
      "I am drawn to the kind of understanding that cannot be hurried: the perspective that develops through repetition, attention, and time.",
      "Rather than treating stillness as an absence of movement, I think of it as the ability to remain present while something slowly becomes clearer. There is a particular strength in resisting the urge to resolve everything immediately.",
      "Within Navarathna, this work holds space for endurance without hardness—and for the possibility that depth is something we enter gradually.",
    ],
  },
  {
    id: "hessonite", gem: "Hessonite", gemConfirmed: true,
    association: "Rahu · Ascending lunar node",
    tagline: "Finding a way through uncertainty.",
    image: "images/works/hessonite.jpg", alt: "Hessonite, framed: a Navarathna painting in amber, rust and cream marbling with trails of orange and dark reflective fragments.",
    views: [
      { src: "images/detail/amber-1.jpg", label: "Detail: dark reflective fragments over the current" },
      { src: "images/detail/amber-2.jpg", label: "Detail: concentrated orange cluster" },
    ],
    statement: [
      "Hessonite does not begin with a promise of calm.",
      "Amber, rust, cream, and earthy marbling move around concentrated trails of orange and dark reflective fragments. The surface gathers, scatters, and changes direction, holding warmth and shadow within the same composition.",
      "I approach this work as an exploration of uncertainty: the pull of wanting to know, the discomfort of not knowing, and the possibility of moving forward without complete clarity.",
      "The contrasting passages are not problems to be reconciled. They are part of the same landscape.",
      "For me, transformation is not always a clean passage from darkness into light. Sometimes it is learning to see more honestly within both.",
    ],
  },
  {
    id: "cats-eye", gem: "Cat’s-eye", gemConfirmed: false,
    association: "Ketu · Descending lunar node",
    tagline: "What remains when the noise falls away.",
    image: "images/works/midnight.jpg", alt: "Navarathna painting in midnight blue, white and gold marbling around a deep blue crystal mass.",
    views: [],
    statement: [
      "Cat’s-eye begins with the idea of discernment.",
      "I am interested in the difference between looking for more and noticing what is already present. This work considers what happens when we loosen our attachment to a fixed outcome and allow another kind of attention to emerge.",
      "Letting go can sound like a loss of direction. I think it can also be a change in how we see: less insistence on a particular answer, more awareness of what we might otherwise overlook.",
      "Within Navarathna, Cat’s-eye is my reflection on release—not as disappearance, but as making room.",
    ],
  },
].map(w => Object.assign({
  title: null,                        // final artwork title; falls back to the gem name
  year: 2026,                         // year completed
  medium: "Mixed media on canvas",
  dimensions: "5 × 4 ft",
  availability: "Available",          // "Available" or "Sold"
}, w));
