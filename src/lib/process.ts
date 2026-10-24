export type ProcessMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; alt: string };

export type ProcessStage = {
  id: string;
  number: string;
  label: string;
  description: string;
  fact?: string;
  media?: ProcessMedia;
};

export const processStages: ProcessStage[] = [
  {
    id: "raw-sheet",
    number: "01",
    label: "Raw sheet",
    description: "A plain metal sheet arrives, ready for layout.",
  },
  {
    id: "design",
    number: "02",
    label: "Design",
    description: "The part is drawn and laid out on the sheet.",
    fact: "CAD layout",
  },
  {
    id: "laser-cut",
    number: "03",
    label: "Laser cut",
    description: "The outline is cut on the TL4020 laser.",
    fact: "Up to 25 mm · TL Series TL4020",
  },
  {
    id: "shear",
    number: "04",
    label: "Shear",
    description: "Straight cuts bring the blank to size.",
    fact: "12 mm thick · 3 m wide · NC “Genius” series",
  },
  {
    id: "bend",
    number: "05",
    label: "Bend",
    description: "The flange is folded to the drawing.",
    fact: "CNC Press Brake Hawk 150-31",
  },
  {
    id: "weld",
    number: "06",
    label: "Weld",
    description: "The seam is welded and dressed.",
    fact: "In-house",
  },
  {
    id: "fabricate",
    number: "07",
    label: "Fabricate",
    description: "The finished part is ready for delivery within Delhi NCR.",
    fact: "One roof · Tughlakabad, New Delhi",
  },
];
