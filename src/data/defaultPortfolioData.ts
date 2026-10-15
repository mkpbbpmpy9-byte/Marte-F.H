export interface ProjectStatCard {
  value: string;
  caption: string;
  isQuestion?: boolean;
  image?: string;
}

export interface ProjectGalleryItem {
  id: string;
  src: string;
  alt: string;
  orientation: 'landscape' | 'portrait' | 'square' | 'wide';
  backgroundColor?: string;
  caption?: string;
  label?: string;
  objectFit?: 'cover' | 'contain';
  padding?: string;
  zoom?: number;
  positionX?: number;
  positionY?: number;
}

export interface ProjectChapter {
  id: string;
  numberTitle: string; // e.g. "1.Document", "2.Analyze", "3.Act"
  layout: 'two-col' | 'three-col' | 'split-feature';
  items: ProjectGalleryItem[];
  bottomNoteLeft?: string;
  bottomNoteRight?: string;
}

export interface ProjectCalloutFeature {
  id: string;
  title: string;
  description: string;
  backgroundColor?: string;
  mainImage: string;
  secondaryImage?: string;
}

export interface ProjectProcessImage {
  id: string;
  src: string;
  caption?: string;
  aspect?: 'landscape' | 'portrait' | 'square';
  backgroundColor?: string;
  zoom?: number;
  positionX?: number;
  positionY?: number;
}

export interface ProjectData {
  id: string;
  slug: string;
  category: 'product' | 'packaging';
  hoverTitle: string;
  hoverTitleColor: 'dark' | 'light';
  pageTitleLines: string[];
  cardConfig: {
    aspect: 'tall' | 'landscape' | 'tall-480';
    backgroundColor: string;
    imageSrc: string;
    imageAlt: string;
    imageStyle?: {
      widthPercent?: number;
      heightPercent?: number;
      leftPercent?: number;
      topPercent?: number;
      objectFit?: 'cover' | 'contain';
      rotateDeg?: number;
      zoom?: number;
      positionX?: number;
      positionY?: number;
    };
    secondaryImageSrc?: string;
    secondaryImageStyle?: {
      widthPercent?: number;
      heightPercent?: number;
      leftPercent?: number;
      topPercent?: number;
      objectFit?: 'cover' | 'contain';
    };
  };
  headerMeta: {
    awardBadgeText?: string;
    awardBadgeLogo?: string;
    awardLines?: string[];
    brandLogoUrl?: string;
    brandLogoText?: string;
    contextLines: string[];
  };
  heroImage: {
    src: string;
    alt: string;
    backgroundColor?: string;
    objectPosition?: string;
    zoom?: number;
    positionX?: number;
    positionY?: number;
  };
  backgroundSection: {
    heading: string;
    paragraphs: string[];
    sideImage: string;
    sideImageAlt: string;
    sideImageContain?: boolean;
    zoom?: number;
    positionX?: number;
    positionY?: number;
  };
  statsRow?: [ProjectStatCard, ProjectStatCard, ProjectStatCard];
  chapters: ProjectChapter[];
  featureSections?: ProjectCalloutFeature[];
  processSection?: {
    heading: string;
    leadImage: string;
    sideImage: string;
    sideCaption: string;
    secondaryLeadImage?: string;
    secondarySideImage?: string;
    secondaryCaption?: string;
    bottomGridImages: ProjectProcessImage[];
  };
  flexibleBlocks?: ContentBlock[];
}

export type ContentBlockType =
  | 'full-image'
  | 'two-images'
  | 'text-section'
  | 'image-text';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  heading?: string;
  paragraphs?: string[];
  image1?: {
    src: string;
    alt: string;
    caption?: string;
  };
  image2?: {
    src: string;
    alt: string;
    caption?: string;
  };
}

export interface DesignerProfile {
  fullName: string;
  lowercaseName: string;
  initials: string;
  profession: string;
  navWorkLabel: string;
  navAboutLabel: string;
  headingProduct: string;
  headingPackaging: string;
  copyrightYear: string;
  aboutBio: string;
  aboutDateLocation: string;
  portraitImage: string;
  portraitAlt: string;
  portraitZoom?: number;
  portraitPositionX?: number;
  portraitPositionY?: number;
  education: string[];
  connect: {
    email: string;
    phone: string;
  };
  awards: string[];
  experience: string[];
}

export interface PortfolioState {
  profile: DesignerProfile;
  projects: ProjectData[];
}

export const initialDesignerProfile: DesignerProfile = {
  fullName: 'Marte Frantzen Håheim',
  lowercaseName: 'marte frantzen håheim',
  initials: 'mfh',
  profession: 'Industrial / Product Designer',
  navWorkLabel: 'work',
  navAboutLabel: 'about',
  headingProduct: '',
  headingPackaging: 'packaging design',
  copyrightYear: '2026',
  aboutBio:
    'Marte is a strategic industrial and product designer who operates at the intersection of analytical problem-solving and artistic intuition. Guided by the core values of clarity, honesty, and functionality, she strives to balance engineering reality with creative exploration to generate genuine consumer desire. Currently working across consumer hardware, mobility, and tactile product systems.',
  aboutDateLocation: '12102026 Oslo',
  portraitImage: '',
  portraitAlt: 'Marte Frantzen Håheim studio portrait',
  portraitZoom: 1,
  portraitPositionX: 50,
  portraitPositionY: 50,
  education: [
    'Oslo School of Architecture and Design',
    'Norwegian University of Science and Technology',
  ],
  connect: {
    email: 'martehaaheim@hotmail.com',
    phone: '+47 90 00 00 00',
  },
  awards: ['BraunPrize 2024', 'Ung Svensk Form 2024', 'Core77 2024'],
  experience: ['Bang&Olufsen', 'Holscher Design', 'No Picnic', 'X-Shore'],
};

export const initialProjects: ProjectData[] = [
  // 1. PLATE PAL
  {
    id: 'platepal',
    slug: 'platepal',
    category: 'product',
    hoverTitle: 'Unlocking Personalised Nutrition',
    hoverTitleColor: 'dark',
    pageTitleLines: ['Unlocking', 'Personalised Nutrition'],
    cardConfig: {
      aspect: 'tall',
      backgroundColor: '#FDCB18',
      imageSrc: '',
      imageAlt: 'Plate Pal wearable nutrition sensor base',
      imageStyle: {
        leftPercent: 15.4,
        topPercent: 39.2,
        widthPercent: 68.8,
        heightPercent: 42.8,
        objectFit: 'contain',
      },
      secondaryImageSrc: '',
      secondaryImageStyle: {
        leftPercent: 30.0,
        topPercent: 16.7,
        widthPercent: 39.8,
        heightPercent: 38.3,
        objectFit: 'contain',
      },
    },
    headerMeta: {
      awardBadgeLogo: '',
      awardLines: [],
      brandLogoUrl: '',
      contextLines: ['Thesis Project', 'Bachelor Degree', 'Umeå Institute of Design'],
    },
    heroImage: {
      src: '',
      alt: 'Plate Pal wearable device showing 4,5 mmol/L blood glucose curve',
      backgroundColor: '#FDCB18',
    },
    backgroundSection: {
      heading: 'Background',
      paragraphs: [
        'Recent breakthroughs in nutritional science show that there is great individual variation in how we react to what we eat. The same meal consumed by two different people will produce vastly different responses in blood glucose, energy, and long-term metabolic health.',
        'Plate Pal bridges the gap between clinical continuous glucose monitoring and everyday intuitive food journaling through a non-invasive NIRS optical wearable.',
      ],
      sideImage: '',
      sideImageAlt: 'Nutritional response comparison diagram',
      sideImageContain: true,
    },
    statsRow: [
      {
        value: '2 Billion',
        caption: 'people are overweight, including 40 million children under 5 years old.',
      },
      {
        value: '80%',
        caption: 'of people who diet gain back all lost weight within 12 months.',
      },
      {
        value: 'What is the best diet for me?',
        isQuestion: true,
        caption:
          'Your unique reaction is decided by millions of factors, including genes, lifestyle and age.',
        image: '',
      },
    ],
    chapters: [
      {
        id: 'ch-doc',
        numberTitle: '1.Document',
        layout: 'two-col',
        items: [
          {
            id: 'it-doc-1',
            src: '',
            alt: 'Documenting meal with smartphone camera',
            orientation: 'landscape',
            caption: 'Document your food by taking a picture of your plate.',
          },
          {
            id: 'it-doc-2',
            src: '',
            alt: 'Checking wearable glucose sensor while dining',
            orientation: 'landscape',
            caption:
              'By monitoring blood glucose you gain insights into how your body processes and utilizes nutrients.',
          },
        ],
      },
      {
        id: 'ch-ana',
        numberTitle: '2.Analyze',
        layout: 'two-col',
        items: [
          {
            id: 'it-ana-1',
            src: '',
            alt: 'Near infrared light sensor module analysis',
            orientation: 'landscape',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            padding: '2.5vw',
            caption:
              'Plate Pal monitors your blood glucose in the fluid between your blood vessels and your skin. Using near infrared light (NIRS) the documentation is completely non-invasive.',
          },
          {
            id: 'it-ana-2',
            src: '',
            alt: 'Ingredient glucose response breakdown',
            orientation: 'landscape',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            padding: '3vw',
            caption:
              'Analyze how each ingredient is processed by your gut and how it affects your blood glucose.',
          },
        ],
      },
      {
        id: 'ch-act',
        numberTitle: '3.Act',
        layout: 'three-col',
        items: [
          {
            id: 'it-act-1',
            src: '',
            alt: 'Meal Feedback mobile interface',
            orientation: 'portrait',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            padding: '2.5vw',
            label: 'Meal Feedback',
          },
          {
            id: 'it-act-2',
            src: '',
            alt: 'Lifestyle Feedback mobile interface',
            orientation: 'portrait',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            padding: '2.5vw',
            label: 'Lifestyle Feedback',
          },
          {
            id: 'it-act-3',
            src: '',
            alt: 'Personal Recipes mobile interface',
            orientation: 'portrait',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            padding: '2.5vw',
            label: 'Personal Recipes',
          },
        ],
        bottomNoteLeft:
          'The aim of the project was to provide feedback that was actionable. Either specific details regarding an ingredient that could be added to a meal, or broader lifestyle adjustments.',
      },
    ],
    featureSections: [
      {
        id: 'feat-eink',
        title: 'Stay updated with the e-ink interface.',
        description:
          'The NIRS sensor reads your blood glucose levels in real time. The E-ink interface changes as your levels increase or decrease, providing calm, glanceable feedback without screen fatigue.',
        backgroundColor: '#F6F6F6',
        mainImage: '',
        secondaryImage: '',
      },
      {
        id: 'feat-mod',
        title: 'Modular Design',
        description:
          'The sensor can be ejected from the wrist interface and placed in a medical-grade silicone patch that adheres directly to the skin when you prefer not to wear a watch.',
        backgroundColor: '#F6F6F6',
        mainImage: '',
        secondaryImage: '',
      },
      {
        id: 'feat-cgm',
        title: 'CGM Sensor',
        description:
          'The removable sensor is the heart of Plate Pal, housing the NIRS optical array, pulse sensor, reflector, and magnetic charging connectors.',
        backgroundColor: '#F6F6F6',
        mainImage: '',
        secondaryImage: '',
      },
    ],
    processSection: {
      heading: 'Process',
      leadImage: '',
      sideImage: '',
      sideCaption:
        "Working with wearable tech it's been crucial to evaluate ideas through physical models. Prototypes were CNC milled and tested continuously in real-world environments.",
      secondaryLeadImage: '',
      secondarySideImage: '',
      secondaryCaption:
        'A two-week field test of an existing CGM was conducted to understand the physical and emotional experience of long-term blood glucose tracking.',
      bottomGridImages: [
        {
          id: 'proc-1',
          src: '',
          aspect: 'square',
        },
        {
          id: 'proc-2',
          src: '',
          aspect: 'square',
        },
        {
          id: 'proc-3',
          src: '',
          aspect: 'square',
        },
      ],
    },
  },

  // 2. THE REMARKABLE, REIMAGINED
  {
    id: 'beolab90',
    slug: 'remarkable-reimagined',
    category: 'product',
    hoverTitle: 'The Remarkable, Reimagined',
    hoverTitleColor: 'dark',
    pageTitleLines: ['The Remarkable,', 'Reimagined'],
    cardConfig: {
      aspect: 'landscape',
      backgroundColor: '#E5E2DC',
      imageSrc: '',
      imageAlt: 'Sculptural wooden acoustic fins and brushed aluminum frame',
    },
    headerMeta: {
      brandLogoText: 'ATELIER EDITIONS',
      contextLines: ['Acoustic Architecture', 'Anniversary Collection', 'Industrial Design'],
    },
    heroImage: {
      src: '',
      alt: 'Precision CNC-milled walnut acoustic fins and brushed gold bezel',
      backgroundColor: '#E5E2DC',
    },
    backgroundSection: {
      heading: 'Background',
      paragraphs: [
        'Exploring bespoke materiality and acoustic precision for flagship residential sound systems. By combining CNC-milled hardwood lamellas with warm anodized aluminum and acoustic textiles, the architecture transforms functional sound dispersion into a sculptural centerpiece.',
        'Every radius and louver angle was refined to eliminate acoustic diffraction while celebrating craft.',
      ],
      sideImage: '',
      sideImageAlt: 'Sculptural speaker prototype with walnut louvers',
    },
    statsRow: [
      {
        value: '18',
        caption: 'individually calibrated acoustic drivers housed within a unified sculptural chassis.',
      },
      {
        value: '0.2mm',
        caption: 'machining tolerance across book-matched walnut lamella assemblies.',
      },
      {
        value: 'Form Follows Acoustics',
        isQuestion: true,
        caption:
          'Each wooden fin acts as an acoustic wave guide while visually softening the presence of the cabinet in living spaces.',
      },
    ],
    chapters: [
      {
        id: 'ch-mat',
        numberTitle: '1.Materiality',
        layout: 'two-col',
        items: [
          {
            id: 'it-mat-1',
            src: '',
            alt: 'Close-up of wooden lamellas and brushed aluminum',
            orientation: 'landscape',
            caption: 'Warm walnut fins paired with bead-blasted champagne anodized aluminum.',
          },
          {
            id: 'it-mat-2',
            src: '',
            alt: 'Acoustic textile and wood louver transition',
            orientation: 'landscape',
            caption: 'Seamless transition between woven acoustic fabric and structural timber.',
          },
        ],
      },
    ],
  },

  // 3. BEOSOUND TABLEAU
  {
    id: 'tableau',
    slug: 'beosound-tableau',
    category: 'product',
    hoverTitle: 'Beosound Tableau (Confidential)',
    hoverTitleColor: 'light',
    pageTitleLines: ['Beosound Tableau', 'Architectural Audio'],
    cardConfig: {
      aspect: 'landscape',
      backgroundColor: '#140F0C',
      imageSrc: '',
      imageAlt: 'Beosound Tableau dark architectural audio monolith',
    },
    headerMeta: {
      brandLogoText: 'TABLEAU',
      contextLines: ['Concept Exploration', 'Home Audio System', 'Industrial Design'],
    },
    heroImage: {
      src: '',
      alt: 'Beosound Tableau in atmospheric lighting',
      backgroundColor: '#140F0C',
    },
    backgroundSection: {
      heading: 'Background',
      paragraphs: [
        'Designed as an architectural silhouette that rests effortlessly against walls or stands freely in open rooms, Tableau explores quiet luxury and monolithic surface tension.',
        'Subtle proximity-sensing illumination reveals controls only when approached, keeping the exterior pure and uninterrupted when at rest.',
      ],
      sideImage: '',
      sideImageAlt: 'Acoustic material study',
    },
    chapters: [
      {
        id: 'ch-sil',
        numberTitle: '1.Silhouette',
        layout: 'two-col',
        items: [
          {
            id: 'it-sil-1',
            src: '',
            alt: 'Atmospheric surface study',
            orientation: 'landscape',
            caption: 'Brushed dark bronze aluminum meets deep acoustic weave.',
          },
          {
            id: 'it-sil-2',
            src: '',
            alt: 'Precision joinery detail',
            orientation: 'landscape',
            caption: 'Precision joinery between metal and organic dampening elements.',
          },
        ],
      },
    ],
  },

  // 4. EINRIDE
  {
    id: 'einride',
    slug: 'einride',
    category: 'product',
    hoverTitle: 'Electrifying Industrial Harbors',
    hoverTitleColor: 'dark',
    pageTitleLines: ['Battery swapping for', 'industrial harbors'],
    cardConfig: {
      aspect: 'landscape',
      backgroundColor: '#F5F5F5',
      imageSrc: '',
      imageAlt: 'Einride autonomous electric harbor battery swapping vehicle',
      imageStyle: {
        leftPercent: 5.6,
        topPercent: 6.9,
        widthPercent: 89.6,
        heightPercent: 90.1,
        objectFit: 'contain',
      },
    },
    headerMeta: {
      brandLogoText: 'einride',
      contextLines: ['Term Project', 'Autonomous Mobility', 'Umeå Institute of Design'],
    },
    heroImage: {
      src: '',
      alt: 'Verto autonomous battery swapping vehicle side profile',
      backgroundColor: '#F5F5F5',
    },
    backgroundSection: {
      heading: 'Background',
      paragraphs: [
        'How might we design a seamless system for charging and handling of electric vehicle batteries in a semi-autonomous harbor? During field visits to industrial ports, we found heavy logistics preparing for electrification, but hindered by long charging downtime.',
        'Verto is an autonomous battery-swapping vehicle that exchanges heavy AEV battery modules directly in the harbor yard in under 4 minutes.',
      ],
      sideImage: '',
      sideImageAlt: 'Autonomous harbor transport unit profile',
      sideImageContain: true,
    },
    statsRow: [
      {
        value: '2.5h',
        caption: 'charging downtime per 12h shift with conventional plug-in harbor vehicles.',
      },
      {
        value: '-$60,000',
        caption: 'cost per day and ship when port operations exceed allowed laytime.',
      },
      {
        value: '"We can\'t rely on electric vehicles today"',
        isQuestion: true,
        caption:
          'Long static charging is incompatible with the unpredictable, fast-paced work done in an industrial harbor.',
      },
    ],
    chapters: [
      {
        id: 'ch-sys',
        numberTitle: '1.System',
        layout: 'two-col',
        items: [
          {
            id: 'it-sys-1',
            src: '',
            alt: 'Verto autonomous carrier with 3 battery bays',
            orientation: 'landscape',
            backgroundColor: '#F5F5F5',
            objectFit: 'contain',
            padding: '2vw',
            caption: 'Verto carries three modular battery packs (01, 02, 03) to service working harbor vehicles.',
          },
          {
            id: 'it-sys-2',
            src: '',
            alt: 'Harbor vehicle side elevation',
            orientation: 'landscape',
            backgroundColor: '#F5F5F5',
            objectFit: 'contain',
            caption: 'Low-profile bidirectional chassis designed for tight container yard maneuvering.',
          },
        ],
      },
    ],
  },

  // 5. SCOUT RESQ
  {
    id: 'scoutresq',
    slug: 'scoutresq',
    category: 'product',
    hoverTitle: 'Urban Extraction',
    hoverTitleColor: 'light',
    pageTitleLines: ['Urban', 'Extraction'],
    cardConfig: {
      aspect: 'landscape',
      backgroundColor: '#020202',
      imageSrc: '',
      imageAlt: 'SCOUT ResQ Fold compact rescue board',
      imageStyle: {
        leftPercent: 10.0,
        topPercent: 0,
        widthPercent: 79.4,
        heightPercent: 100,
        objectFit: 'contain',
      },
    },
    headerMeta: {
      brandLogoUrl: '',
      contextLines: ['Conceptual Product Design', 'Emergency Medical Hardware', 'Umeå Institute of Design'],
    },
    heroImage: {
      src: '',
      alt: 'SCOUT ResQ Fold emergency extraction board',
      backgroundColor: '#020202',
    },
    backgroundSection: {
      heading: 'Background',
      paragraphs: [
        '71% of cardiac arrests happen in the home. In dense urban apartment buildings with narrow stairwells and compact elevators, paramedics struggle to extract patients rapidly using conventional rigid stretchers.',
        'SCOUT ResQ Fold is a high-strength, articulated composite extraction board rated for 160kg that folds into a compact, ergonomic carry form for rapid stairwell navigation.',
      ],
      sideImage: '',
      sideImageAlt: 'SCOUT ResQ Fold folded detail',
      sideImageContain: true,
    },
    statsRow: [
      {
        value: '71%',
        caption: 'of out-of-hospital cardiac arrests happen in residential homes (American Red Cross).',
      },
      {
        value: '160kg',
        caption: 'maximum load capacity per handle with reinforced carbon-polyamide hinge locks.',
      },
      {
        value: 'Every Floor Counts',
        isQuestion: true,
        caption:
          'Survival chances drop sharply above the 3rd floor due to extraction delays in cramped staircases.',
      },
    ],
    chapters: [
      {
        id: 'ch-ext',
        numberTitle: '1.Extraction',
        layout: 'two-col',
        items: [
          {
            id: 'it-ext-1',
            src: '',
            alt: 'SCOUT ResQ Fold deployed configuration',
            orientation: 'landscape',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            padding: '2vw',
            caption: 'High-contrast safety graphics guide rapid strap attachment under high-stress conditions.',
          },
          {
            id: 'it-ext-2',
            src: '',
            alt: 'SCOUT ResQ Fold hinge mechanism',
            orientation: 'landscape',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            padding: '2vw',
            caption: 'Glove-friendly oversized grip zones rated for 160kg load distribution.',
          },
        ],
      },
    ],
  },

  // 6. SPARK
  {
    id: 'spark',
    slug: 'spark',
    category: 'product',
    hoverTitle: 'A Lifelong Love of Learning',
    hoverTitleColor: 'dark',
    pageTitleLines: ['A Lifelong', 'Love of Learning'],
    cardConfig: {
      aspect: 'tall',
      backgroundColor: '#DCEBFB',
      imageSrc: '',
      imageAlt: 'Spark interactive optical projection learning companion',
      imageStyle: {
        leftPercent: 3.0,
        topPercent: 12.1,
        widthPercent: 92.2,
        heightPercent: 87.9,
        objectFit: 'contain',
      },
    },
    headerMeta: {
      brandLogoText: 'spark',
      contextLines: ['Strategic Design', 'w/ Lenz Bätzing', 'Umeå Institute of Design'],
    },
    heroImage: {
      src: '',
      alt: 'Spark tabletop projector with knitted textile crown',
      backgroundColor: '#DCEBFB',
      objectPosition: 'center bottom',
    },
    backgroundSection: {
      heading: 'Background',
      paragraphs: [
        'In the classroom children can rely on guidance through teachers and friends to play with. It is a safe environment to ask questions and learn. But at the end of the day kids go home and lose so much of these collaborative resources.',
        'Spark transforms solitary screen-bound homework into an interactive, tabletop projection surface where physical books, drawings, and objects become part of the learning dialogue.',
      ],
      sideImage: '',
      sideImageAlt: 'Spark projection optics detail',
      sideImageContain: true,
    },
    chapters: [
      {
        id: 'ch-sprk',
        numberTitle: '1.Interact',
        layout: 'three-col',
        items: [
          {
            id: 'it-spk-1',
            src: '',
            alt: 'Spark projection mode',
            orientation: 'square',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            padding: '2vw',
            label: 'Dual Light Projection',
          },
          {
            id: 'it-spk-2',
            src: '',
            alt: 'Spark tactile textile top',
            orientation: 'square',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            padding: '2vw',
            label: 'Tactile Acoustic Top',
          },
          {
            id: 'it-spk-3',
            src: '',
            alt: 'Spark camera recognition',
            orientation: 'square',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            padding: '2vw',
            label: 'Object Recognition',
          },
        ],
        bottomNoteLeft:
          'By combining light sources, Dual Light technology provides a brighter, more vibrant projection directly onto the desk surface, even in well-lit rooms.',
      },
    ],
  },

  // 7. FJÄLLRÄVEN
  {
    id: 'fjallraven',
    slug: 'fjallraven',
    category: 'product',
    hoverTitle: 'Designed for Refurbishment',
    hoverTitleColor: 'dark',
    pageTitleLines: ['Designed for', 'Refurbishment'],
    cardConfig: {
      aspect: 'tall-480',
      backgroundColor: '#9CC8F6',
      imageSrc: '',
      imageAlt: 'Modular outdoor hardware designed for circular refurbishment',
    },
    headerMeta: {
      brandLogoText: 'FJÄLLRÄVEN',
      contextLines: ['Circular Hardware', 'Design for Disassembly', 'Industrial Design'],
    },
    heroImage: {
      src: '',
      alt: 'Outdoor equipment engineered for modular repair',
      backgroundColor: '#9CC8F6',
    },
    backgroundSection: {
      heading: 'Background',
      paragraphs: [
        'Outdoor gear is subjected to extreme mechanical wear, yet a single broken buckle, zipper, or housing often condemns an entire product to landfill.',
        'This project establishes a circular hardware architecture where every high-wear mechanical component can be disassembled, refurbished, or replaced with standard hand tools in under two minutes.',
      ],
      sideImage: '',
      sideImageAlt: 'Exploded mechanical assembly',
      sideImageContain: true,
    },
    chapters: [
      {
        id: 'ch-ass',
        numberTitle: '1.Assembly',
        layout: 'two-col',
        items: [
          {
            id: 'it-ass-1',
            src: '',
            alt: 'Exploded shell and optics architecture',
            orientation: 'landscape',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            padding: '2vw',
            caption: 'Snap-free mechanical fasteners allow repeated service cycles without fatiguing polymer threads.',
          },
          {
            id: 'it-ass-2',
            src: '',
            alt: 'Component detail',
            orientation: 'landscape',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            padding: '2vw',
            caption: 'Mono-material shell halves molded without permanent adhesives or coatings.',
          },
        ],
      },
    ],
  },

  // 8. DIVING MODULE
  {
    id: 'divemodule',
    slug: 'divemodule',
    category: 'product',
    hoverTitle: 'Diving Module',
    hoverTitleColor: 'light',
    pageTitleLines: ['X-Shore Pro', 'Diving Module'],
    cardConfig: {
      aspect: 'tall-480',
      backgroundColor: '#242519',
      imageSrc: '',
      imageAlt: 'X-Shore Pro modular deck diving unit',
      imageStyle: {
        leftPercent: 22.2,
        topPercent: 3.3,
        widthPercent: 55.6,
        heightPercent: 96.7,
        objectFit: 'contain',
      },
    },
    headerMeta: {
      brandLogoUrl: '',
      contextLines: ['Internship Project', 'In Production 2024', 'X-Shore Marine'],
    },
    heroImage: {
      src: '',
      alt: 'X-Shore Pro vessel equipped with Diving Module',
      backgroundColor: '#242519',
    },
    backgroundSection: {
      heading: 'Background',
      paragraphs: [
        '"The diving module immediately widens industrial use cases of X-Shore vessels." Designed for production in 2024, the modular deck system integrates directly into the deck rail system of X-Shore Pro and Eelex 8000 electric vessels.',
        'Constructed from marine-grade anodized aluminum, cork composite decking, and rapid-lock tank brackets to secure diving gear in rough sea states.',
      ],
      sideImage: '',
      sideImageAlt: 'Diving module deck integration',
    },
    chapters: [
      {
        id: 'ch-prod',
        numberTitle: '1.Production',
        layout: 'two-col',
        items: [
          {
            id: 'it-prod-1',
            src: '',
            alt: 'Diving Module CAD and production details',
            orientation: 'landscape',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            padding: '2vw',
            caption: 'Available for X-Shore Pro and Eelex 8000 electric vessels.',
          },
          {
            id: 'it-prod-2',
            src: '',
            alt: 'Tank locking mechanism',
            orientation: 'landscape',
            caption: 'Integrated bench seating and quick-release scuba cylinder retention.',
          },
        ],
      },
    ],
  },

  // 9. DOMESTIC ROBOTS
  {
    id: 'domesticrobots',
    slug: 'domesticrobots',
    category: 'product',
    hoverTitle: 'Home Appliances for Domestic Robots',
    hoverTitleColor: 'dark',
    pageTitleLines: ['Home Appliances for', 'Domestic Robots'],
    cardConfig: {
      aspect: 'landscape',
      backgroundColor: '#EAE8E3',
      imageSrc: '',
      imageAlt: 'Home Appliances for Domestic Robots',
    },
    headerMeta: {
      brandLogoUrl: '',
      contextLines: ['Design Sprint', 'Domestic Robotics', 'Umeå Institute of Design'],
    },
    heroImage: {
      src: '',
      alt: 'Domestic robot home appliance ecosystem',
      backgroundColor: '#EAE8E3',
    },
    backgroundSection: {
      heading: 'Background',
      paragraphs: [
        '“Almost 40% of domestic tasks could be done by robots within a decade.” Rather than designing humanoid robots that struggle to use human tools, how might we rethink everyday household appliances so they collaborate seamlessly with both humans and domestic robots?',
        'Designed for active independent living, the system pairs warm residential furniture language with standardized robotic docking interfaces.',
      ],
      sideImage: '',
      sideImageAlt: 'Robotic appliance interaction',
    },
    chapters: [
      {
        id: 'ch-eco',
        numberTitle: '1.Ecosystem',
        layout: 'two-col',
        items: [
          {
            id: 'it-eco-1',
            src: '',
            alt: 'Domestic robot dock in living environment',
            orientation: 'landscape',
            caption: 'Appliances sit flush within domestic architecture while offering magnetic guide rails for robot helpers.',
          },
          {
            id: 'it-eco-2',
            src: '',
            alt: 'Tactile control module',
            orientation: 'landscape',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            padding: '2vw',
            caption: 'Intuitive physical controls for human residents alongside automated scheduling.',
          },
        ],
      },
    ],
  },

  // 10. SOFT MESSAGES
  {
    id: 'softmessages',
    slug: 'softmessages',
    category: 'product',
    hoverTitle: 'Soft Messages',
    hoverTitleColor: 'dark',
    pageTitleLines: ['Soft', 'Messages'],
    cardConfig: {
      aspect: 'landscape',
      backgroundColor: '#F4F4F2',
      imageSrc: '',
      imageAlt: 'Soft Messages tactile acoustic voice tiles',
    },
    headerMeta: {
      brandLogoUrl: '',
      contextLines: ['Tactile Interaction', 'Connected Home Hardware', 'Industrial Design'],
    },
    heroImage: {
      src: '',
      alt: 'Soft Messages wall-mounted tactile communication tiles',
      backgroundColor: '#F4F4F2',
    },
    backgroundSection: {
      heading: 'Background',
      paragraphs: [
        'Digital messaging in the home is trapped behind glass screens and notification banners. Soft Messages reimagines family voice notes as calm, physical wall tiles covered in soft acoustic textiles.',
        'Lift a tile to record a voice message; when a message arrives, the tile gently pivots outward, inviting a family member to press it to listen.',
      ],
      sideImage: '',
      sideImageAlt: 'Soft Messages tile interaction',
    },
    chapters: [
      {
        id: 'ch-ges',
        numberTitle: '1.Gesture',
        layout: 'two-col',
        items: [
          {
            id: 'it-ges-1',
            src: '',
            alt: 'Lift tile to record a message',
            orientation: 'landscape',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            caption: 'Lift tile to record a message.',
          },
          {
            id: 'it-ges-2',
            src: '',
            alt: 'Press tile to listen to the message',
            orientation: 'landscape',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            caption: 'Press tile to listen to the message.',
          },
        ],
      },
    ],
  },

  // 11. ÅTGÅ / INTERIOR PAINT
  {
    id: 'atga',
    slug: 'interior-paint',
    category: 'packaging',
    hoverTitle: 'Interior Paint',
    hoverTitleColor: 'dark',
    pageTitleLines: ['ÅTGÅ', 'paint system'],
    cardConfig: {
      aspect: 'tall',
      backgroundColor: '#E5E5E5',
      imageSrc: '',
      imageAlt: 'ÅTGÅ modular interior paint packaging system',
    },
    headerMeta: {
      brandLogoUrl: '',
      contextLines: ['Term Project', 'ArtCenter College of Design', 'Packaging Design'],
    },
    heroImage: {
      src: '',
      alt: 'ÅTGÅ interior paint containers and roller trays',
      backgroundColor: '#E5E5E5',
    },
    backgroundSection: {
      heading: 'Concept',
      paragraphs: [
        'Exploring a family of paints and tools for circular home furnishing. With ÅTGÅ, worn furniture can be given new life instead of being discarded.',
        'Colors are curated seasonally, while the square-profile molded containers stack efficiently on flat-pack warehouse pallets and double as integrated pouring and roller trays.',
      ],
      sideImage: '',
      sideImageAlt: 'ÅTGÅ color palette and structural packaging',
    },
    chapters: [
      {
        id: 'ch-atga-sys',
        numberTitle: '1.System',
        layout: 'two-col',
        items: [
          {
            id: 'it-atga-1',
            src: '',
            alt: 'ÅTGÅ paint vessels and brushes',
            orientation: 'landscape',
            caption: 'Ergonomic pouring geometry eliminates drips and messy rim buildup.',
          },
          {
            id: 'it-atga-2',
            src: '',
            alt: 'Powder Blue and Interior Primer cans',
            orientation: 'landscape',
            caption: 'Clear typographic hierarchy and color-coded caps for effortless studio selection.',
          },
        ],
      },
    ],
  },

  // 12. GRAM CHOCOLATE
  {
    id: 'gram',
    slug: 'gram-chocolate',
    category: 'packaging',
    hoverTitle: 'GRAM Chocolate (WIP)',
    hoverTitleColor: 'dark',
    pageTitleLines: ['New Look for an', 'Oldschool Treat'],
    cardConfig: {
      aspect: 'tall',
      backgroundColor: '#DCD9D2',
      imageSrc: '',
      imageAlt: 'GRAM Chocolate geometric bar and structural sleeve',
    },
    headerMeta: {
      brandLogoText: 'GRAM',
      contextLines: ['Term Project', 'ArtCenter College of Design', 'Packaging Design'],
    },
    heroImage: {
      src: '',
      alt: 'GRAM Chocolate packaging lineup',
      backgroundColor: '#DCD9D2',
    },
    backgroundSection: {
      heading: 'Background',
      paragraphs: [
        '"Redefine chocolate for a younger consumer." Few young people buy dark chocolate as an everyday functional snack, despite its rich nutritional profile.',
        'GRAM pairs a tactile, snap-apart geometric chocolate mold with a resealable architectural paperboard sleeve designed for pockets, backpacks, and life on the go.',
      ],
      sideImage: '',
      sideImageAlt: 'GRAM Chocolate bar geometry',
      sideImageContain: true,
    },
    chapters: [
      {
        id: 'ch-gram-str',
        numberTitle: '1.Structure',
        layout: 'two-col',
        items: [
          {
            id: 'it-gram-1',
            src: '',
            alt: 'GRAM Chocolate structural dieline and sleeve',
            orientation: 'landscape',
            backgroundColor: '#F6F6F6',
            objectFit: 'contain',
            caption: 'One-piece folded paperboard structure with zero glue points.',
          },
          {
            id: 'it-gram-2',
            src: '',
            alt: 'GRAM Chocolate tactile unboxing',
            orientation: 'landscape',
            caption: 'Always on the go — portioned geometry for clean single-hand sharing.',
          },
        ],
      },
    ],
  },
];
