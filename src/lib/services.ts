export const servicesList = [
  {
    number: "01",
    title: "Laser sheet cutting",
    description: "Precision cuts on sheet metal with clean edges.",
    spec: "Up to 25 mm · TL Series TL4020",
  },
  {
    number: "02",
    title: "Sheet shearing",
    description: "Straight cuts for blanks and panels.",
    spec: "12 mm thick · 3 m wide · NC \"Genius\" series",
  },
  {
    number: "03",
    title: "Sheet bending",
    description: "Forming and folding to drawing specifications.",
    spec: "CNC Press Brake Hawk 150-31",
  },
  {
    number: "04",
    title: "Welding",
    description: "MIG/TIG welding for assemblies and frames.",
    spec: "In-house",
  },
  {
    number: "05",
    title: "Fabrication",
    description: "One-off parts and production runs under one roof.",
    spec: "One roof",
  },
  {
    number: "06",
    title: "Manufacturing machine parts",
    description: "Custom machine parts to your drawing.",
    spec: "To drawing",
  },
  {
    number: "07",
    title: "Product design",
    description: "Design support for manufacturability.",
    spec: "On request",
  },
] as const;

export const capacityTable = [
  { process: "Laser cutting", machine: "TL Series TL4020", capacity: "Up to 25 mm" },
  { process: "Shearing", machine: "NC \"Genius\" series", capacity: "12 mm thick · 3 m wide" },
  { process: "Bending", machine: "CNC Press Brake Hawk 150-31", capacity: "To drawing" },
] as const;

export const machines = [
  { name: "TL Series TL4020", role: "Laser cutting", desc: "Precision laser sheet cutting up to 25 mm." },
  { name: "CNC Press Brake Hawk 150-31", role: "Bending", desc: "Forming and bending for panels and brackets." },
  { name: "NC Shearing \"Genius\" series", role: "Shearing", desc: "Straight cuts up to 12 mm thick, 3 m wide." },
] as const;

export const processChain = [
  { number: "01", label: "Cut" },
  { number: "02", label: "Shear" },
  { number: "03", label: "Bend" },
  { number: "04", label: "Weld" },
  { number: "05", label: "Fabricate" },
] as const;
