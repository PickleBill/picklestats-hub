export interface Clip {
  id: string;
  name: string;
  video: string;
  quality: number;
  viral: number;
  arc: string;
  arcColor: string;
  brands: string[];
  badges: string[];
  commentary: {
    espn: string;
    hype: string;
    ronBurgundy: string;
    chuckNorris: string;
  };
}

export const clips: Clip[] = [
  {
    id: "1",
    name: "Baseline Rally Masterclass",
    video: "https://cdn.courtana.com/files/production/u/01915c59-9bb7-4683-bd53-e28bddcae12e/0b225575-5bd7-4e7b-ac84-8b59a86cb811.mp4",
    quality: 7,
    viral: 5,
    arc: "pure_fun",
    arcColor: "bg-blue-500",
    brands: ["LIFE TIME PICKLEBALL", "JOOLA"],
    badges: ["Teaching Moment"],
    commentary: {
      espn: "Players engage in a steady rally, exchanging consistent drives from the baseline, showcasing solid fundamental play in this indoor pickleball match.",
      hype: "ABSOLUTE FIREPOWER from the baseline! This rally is NEXT LEVEL!",
      ronBurgundy: "By the beard of Zeus, this pickleball contest is a symphony of precision and power! The players, with their unwavering focus, deliver a spectacle of athletic prowess that truly defines 'stay classy, San Diego' on the court.",
      chuckNorris: "Chuck Norris doesn't play pickleball; pickleball plays Chuck Norris.",
    },
  },
  {
    id: "2",
    name: "Drive Drop Dink Sequence",
    video: "https://cdn.courtana.com/files/production/u/01915c59-9bb7-4683-bd53-e28bddcae12e/f415729c-153e-4024-bdc3-9a9836752e4e.mp4",
    quality: 7,
    viral: 4,
    arc: "teaching_moment",
    arcColor: "bg-primary",
    brands: ["LIFE TIME PICKLEBALL", "JOOLA"],
    badges: ["Aggressive Driver"],
    commentary: {
      espn: "A well-executed sequence of drives transitioning into drops and dinks, showing tactical versatility at the net.",
      hype: "THE TRANSITION GAME IS UNREAL! Drive, drop, dink — LETHAL combo!",
      ronBurgundy: "Good heavens, what a display of athleticism and paddle prowess!",
      chuckNorris: "Chuck Norris once dinked so hard, the ball apologized.",
    },
  },
  {
    id: "3",
    name: "Quick Rally Gone Wrong",
    video: "https://cdn.courtana.com/files/production/u/01915c59-9bb7-4683-bd53-e28bddcae12e/c30b464e-25b4-4029-ba30-49b1f3877f42.mp4",
    quality: 7,
    viral: 5,
    arc: "error_highlight",
    arcColor: "bg-destructive",
    brands: ["LIFE TIME PICKLEBALL", "JOOLA"],
    badges: ["Error Highlight"],
    commentary: {
      espn: "A brief exchange that ends with an unforced error, highlighting the importance of patience and shot selection.",
      hype: "OH NO! The rally COLLAPSES in spectacular fashion!",
      ronBurgundy: "Well, that was certainly a pickleball rally. Not quite a symphony of dinks, nor a ballet of volleys, but a rally nonetheless.",
      chuckNorris: "Chuck Norris never makes errors. Errors make Chuck Norris.",
    },
  },
];

export const featuredClip = {
  video: "https://cdn.courtana.com/files/production/u/01915c59-9bb7-4683-bd53-e28bddcae12e/ce00696b-9f9b-465a-971c-dbf1334e556c.mp4",
  commentary: {
    espn: "Players engage in a steady rally, exchanging consistent drives from the baseline, showcasing solid fundamental play in this indoor pickleball match.",
    hype: "ABSOLUTE FIREPOWER from the baseline! This rally is NEXT LEVEL!",
    ronBurgundy: "By the beard of Zeus, this pickleball contest is a symphony of precision and power! The players, with their unwavering focus, deliver a spectacle of athletic prowess that truly defines 'stay classy, San Diego' on the court.",
    chuckNorris: "Chuck Norris doesn't play pickleball; pickleball plays Chuck Norris.",
  },
};

export const radarData = [
  { stat: "Court Coverage", value: 6.0 },
  { stat: "Kitchen Mastery", value: 5.0 },
  { stat: "Power Game", value: 6.0 },
  { stat: "Touch & Feel", value: 5.3 },
  { stat: "Athleticism", value: 6.3 },
  { stat: "Creativity", value: 4.0 },
  { stat: "Court IQ", value: 5.7 },
];

export const brandData = [
  { name: "LIFE TIME PICKLEBALL", count: 3 },
  { name: "JOOLA", count: 3 },
];
