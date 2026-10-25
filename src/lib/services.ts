export const servicesList = [
  {
    number: "01",
    title: "Laser sheet cutting",
    description: "Precision cuts on sheet metal with clean edges.",
    spec: "Up to 25 mm · TL Series TL4020",
    detail:
      "Sheet metal is cut on the TL Series TL4020. Send a DXF, DWG, PDF or STEP file with material and thickness; we confirm the cut against the 25 mm limit before quoting.",
    image: "/images/machines/laser-cutting-machine.webp",
  },
  {
    number: "02",
    title: "Sheet shearing",
    description: "Straight cuts for blanks and panels.",
    spec: "12 mm thick · 3 m wide · NC \"Genius\" series",
    detail:
      "Straight cuts for blanks and panels on the NC “Genius” series. The confirmed limit is up to 12 mm thick and 3 m wide. Include the finished size and quantity on the drawing.",
    image: "/images/machines/shearing-machine.webp",
  },
  {
    number: "03",
    title: "Sheet bending",
    description: "Forming and folding to drawing specifications.",
    spec: "CNC Press Brake Hawk 150-31",
    detail:
      "Forming and folding on the CNC Press Brake Hawk 150-31. Include bend lines, angles, and tolerances on the drawing so the part is set up correctly the first time.",
    image: "/images/machines/bending-machine.webp",
  },
  {
    number: "04",
    title: "Welding",
    description: "MIG/TIG welding for assemblies and frames.",
    spec: "MIG · TIG",
    detail:
      "MIG and TIG welding for assemblies and frames. Tell us the material and finish so the joint is set up correctly. Welding is quoted from the drawing with the rest of the part.",
    image: "/images/machines/laser-welding-machine.webp",
  },
  {
    number: "05",
    title: "Fabrication",
    description: "Parts and assemblies built to drawing.",
    spec: "Cut · Shear · Bend · Weld",
    detail:
      "Parts and assemblies built to drawing in Tughlakabad, New Delhi. Cutting, shearing, bending, and welding stay with one team, so one supplier answers for the finished part.",
    image: "/images/products/coversandpanels.webp",
  },
  {
    number: "06",
    title: "Manufacturing machine parts",
    description: "Custom machine parts to drawing.",
    spec: "As per drawing",
    detail:
      "Custom machine parts made from your drawing. Material, thickness, quantity, and tolerance decide the process. Send the file and tell us what the part has to do.",
    image: "/images/products/machine-parts.webp",
  },
  {
    number: "07",
    title: "Product design",
    description: "Design support for manufacturability.",
    spec: "As requested",
    detail:
      "Design support for manufacturability. Bring a sketch or a requirement and we review how it can be made, what material suits it, and which process fits the quantity.",
    image: "/images/products/frames.webp",
  },
] as const;

export const capacityTable = [
  { process: "Laser cutting", machine: "TL Series TL4020", capacity: "Up to 25 mm" },
  { process: "Shearing", machine: "NC \"Genius\" series", capacity: "12 mm thick · 3 m wide" },
  { process: "Bending", machine: "CNC Press Brake Hawk 150-31", capacity: "As per drawing" },
  { process: "Welding", machine: "MIG · TIG", capacity: "As per drawing" },
  { process: "Fabrication", machine: "In-house", capacity: "As per drawing" },
] as const;

export const processChain = [
  { number: "01", label: "Cut" },
  { number: "02", label: "Shear" },
  { number: "03", label: "Bend" },
  { number: "04", label: "Weld" },
  { number: "05", label: "Fabricate" },
] as const;
