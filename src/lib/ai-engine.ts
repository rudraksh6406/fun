import { Activity, seedActivities } from "@/data/activities";
import { v4 as uuidv4 } from "uuid";

// AI Fun Engine - Learns from input activities and generates new ideas
// Uses weighted scoring, pattern matching, and combinatorial generation

interface UserPreferences {
  likedCategories: string[];
  likedTags: string[];
  energyPreference: ("low" | "medium" | "high")[];
  costPreference: ("free" | "cheap" | "moderate" | "expensive")[];
  indoorOutdoor: "indoor" | "outdoor" | "both";
}

interface RecommendationQuery {
  availableTime: number; // minutes
  numberOfPeople: number;
  availableMaterials: string[];
  location?: { lat: number; lng: number };
  mood?: string;
  preferences?: UserPreferences;
}

interface GeneratedActivity extends Activity {
  confidence: number;
  reasoning: string;
  isGenerated: boolean;
}

// Pattern templates for generating new activities
const activityTemplates = [
  {
    pattern: "{adjective} {base_activity} {modifier}",
    adjectives: ["Extreme", "Silent", "Reverse", "Giant", "Mini", "Glow-in-the-dark", "Speed", "Mystery", "Themed", "Championship"],
    modifiers: ["Challenge", "Tournament", "Marathon", "Relay", "Battle", "Quest", "Showdown", "Extravaganza", "Olympics", "Bonanza"],
  },
  {
    pattern: "{activity1} meets {activity2}",
    combineRules: [
      { cat1: "Active Games", cat2: "Food & Cooking", result: "Cook while doing physical challenges" },
      { cat1: "Creative", cat2: "Games", result: "Competitive art creation" },
      { cat1: "Adventure", cat2: "Puzzle & Brain", result: "Outdoor puzzle solving" },
      { cat1: "Dance & Music", cat2: "Games", result: "Musical gaming challenges" },
      { cat1: "Entertainment", cat2: "Creative", result: "Create your own show" },
    ],
  },
];

const moodModifiers: Record<string, { tags: string[]; energy: string[]; description: string }> = {
  excited: { tags: ["action", "competitive", "physical"], energy: ["high"], description: "high-energy" },
  relaxed: { tags: ["relaxing", "peaceful", "cozy"], energy: ["low"], description: "chill" },
  creative: { tags: ["creative", "artistic", "expressive"], energy: ["low", "medium"], description: "creative" },
  social: { tags: ["social", "party", "team"], energy: ["medium", "high"], description: "social" },
  adventurous: { tags: ["adventure", "exploration", "extreme"], energy: ["medium", "high"], description: "adventurous" },
  silly: { tags: ["funny", "comedy", "nostalgic"], energy: ["medium"], description: "hilarious" },
};

class FunAIEngine {
  private activities: Activity[];
  private userHistory: { activityId: string; rating: number; timestamp: number }[];
  private learnedPatterns: Map<string, number>;

  constructor() {
    this.activities = [...seedActivities];
    this.userHistory = [];
    this.learnedPatterns = new Map();
    this.initializePatterns();
  }

  private initializePatterns() {
    // Learn initial patterns from seed data
    for (const activity of this.activities) {
      for (const tag of activity.tags) {
        const current = this.learnedPatterns.get(tag) || 0;
        this.learnedPatterns.set(tag, current + activity.funScore);
      }
      const catKey = `cat:${activity.category}`;
      const current = this.learnedPatterns.get(catKey) || 0;
      this.learnedPatterns.set(catKey, current + activity.funScore);
    }
  }

  // Train the model on new user-submitted activities
  train(newActivities: Partial<Activity>[]) {
    for (const input of newActivities) {
      const activity: Activity = {
        id: uuidv4(),
        name: input.name || "Unnamed Activity",
        description: input.description || "",
        category: input.category || "General",
        minPeople: input.minPeople || 1,
        maxPeople: input.maxPeople || 10,
        minTime: input.minTime || 30,
        maxTime: input.maxTime || 120,
        materials: input.materials || [],
        indoor: input.indoor ?? true,
        outdoor: input.outdoor ?? true,
        energy: input.energy || "medium",
        cost: input.cost || "free",
        tags: input.tags || [],
        funScore: input.funScore || 7,
        image: input.image || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80",
      };

      this.activities.push(activity);

      // Update learned patterns
      for (const tag of activity.tags) {
        const current = this.learnedPatterns.get(tag) || 0;
        this.learnedPatterns.set(tag, current + activity.funScore);
      }
    }

    return this.activities.length;
  }

  // Rate an activity to improve future recommendations
  rateActivity(activityId: string, rating: number) {
    this.userHistory.push({ activityId, rating, timestamp: Date.now() });

    const activity = this.activities.find((a) => a.id === activityId);
    if (activity) {
      const boost = (rating - 5) / 5; // -1 to 1
      for (const tag of activity.tags) {
        const current = this.learnedPatterns.get(tag) || 0;
        this.learnedPatterns.set(tag, current + boost * 3);
      }
    }
  }

  // Generate new activity ideas by combining patterns from existing ones
  generateNewIdeas(count: number = 5): GeneratedActivity[] {
    const generated: GeneratedActivity[] = [];
    const usedNames = new Set<string>();

    // Method 1: Combine two activities
    for (let i = 0; i < count * 2 && generated.length < count; i++) {
      const a1 = this.activities[Math.floor(Math.random() * this.activities.length)];
      const a2 = this.activities[Math.floor(Math.random() * this.activities.length)];
      if (a1.id === a2.id) continue;

      const name = this.generateCombinedName(a1, a2);
      if (usedNames.has(name)) continue;
      usedNames.add(name);

      const combined: GeneratedActivity = {
        id: uuidv4(),
        name,
        description: this.generateDescription(a1, a2),
        category: Math.random() > 0.5 ? a1.category : a2.category,
        minPeople: Math.min(a1.minPeople, a2.minPeople),
        maxPeople: Math.max(a1.maxPeople, a2.maxPeople),
        minTime: Math.round((a1.minTime + a2.minTime) / 2),
        maxTime: Math.round((a1.maxTime + a2.maxTime) / 2),
        materials: [...new Set([...a1.materials.slice(0, 2), ...a2.materials.slice(0, 2)])],
        indoor: a1.indoor || a2.indoor,
        outdoor: a1.outdoor || a2.outdoor,
        energy: this.combineEnergy(a1.energy, a2.energy),
        cost: this.combineCost(a1.cost, a2.cost),
        tags: [...new Set([...a1.tags.slice(0, 3), ...a2.tags.slice(0, 3)])],
        funScore: Math.round((a1.funScore + a2.funScore) / 2 + Math.random()),
        image: Math.random() > 0.5 ? a1.image : a2.image,
        confidence: 0.6 + Math.random() * 0.3,
        reasoning: `Mashup of "${a1.name}" and "${a2.name}" — combining the best of ${a1.category} and ${a2.category}!`,
        isGenerated: true,
      };
      generated.push(combined);
    }

    // Method 2: Template-based generation
    const template = activityTemplates[0];
    const adjectives = template.adjectives ?? [];
    const modifiers = template.modifiers ?? [];
    for (let i = 0; generated.length < count && i < count; i++) {
      const base = this.activities[Math.floor(Math.random() * this.activities.length)];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const mod = modifiers[Math.floor(Math.random() * modifiers.length)];
      const name = `${adj} ${base.name.split(" ").slice(0, 2).join(" ")} ${mod}`;
      if (usedNames.has(name)) continue;
      usedNames.add(name);

      generated.push({
        ...base,
        id: uuidv4(),
        name,
        description: `Take ${base.name} to the next level with this ${adj.toLowerCase()} ${mod.toLowerCase()} version! ${base.description}`,
        funScore: Math.min(10, base.funScore + 1),
        confidence: 0.5 + Math.random() * 0.3,
        reasoning: `An amplified version of "${base.name}" with a ${adj.toLowerCase()} twist!`,
        isGenerated: true,
      });
    }

    return generated;
  }

  // Get personalized recommendations based on context
  getRecommendations(query: RecommendationQuery): (Activity & { score: number; matchReasons: string[] })[] {
    const allActivities = [...this.activities, ...this.generateNewIdeas(3)];

    const scored = allActivities.map((activity) => {
      let score = activity.funScore * 10;
      const matchReasons: string[] = [];

      // Time filter
      if (query.availableTime >= activity.minTime && query.availableTime <= activity.maxTime * 1.5) {
        score += 20;
        matchReasons.push(`Fits in ${query.availableTime} min`);
      } else if (query.availableTime < activity.minTime) {
        score -= 30;
      }

      // People filter
      if (query.numberOfPeople >= activity.minPeople && query.numberOfPeople <= activity.maxPeople) {
        score += 25;
        matchReasons.push(`Perfect for ${query.numberOfPeople} people`);
      } else if (query.numberOfPeople === 1 && activity.minPeople === 1) {
        score += 15;
        matchReasons.push("Great solo activity");
      } else {
        score -= 20;
      }

      // Materials match
      if (query.availableMaterials.length > 0) {
        const matchedMaterials = activity.materials.filter((m) =>
          query.availableMaterials.some((qm) => m.toLowerCase().includes(qm.toLowerCase()) || qm.toLowerCase().includes(m.toLowerCase()))
        );
        if (matchedMaterials.length > 0) {
          score += matchedMaterials.length * 10;
          matchReasons.push(`You have: ${matchedMaterials.join(", ")}`);
        }
        if (activity.materials.length === 0 || (activity.materials.length === 1 && activity.materials[0].includes("Nothing"))) {
          score += 15;
          matchReasons.push("No materials needed!");
        }
      }

      // Mood modifier
      if (query.mood && moodModifiers[query.mood]) {
        const mod = moodModifiers[query.mood];
        const moodMatch = activity.tags.filter((t) => mod.tags.includes(t)).length;
        score += moodMatch * 8;
        if (moodMatch > 0) matchReasons.push(`Matches your ${mod.description} mood`);
      }

      // Preference scoring
      if (query.preferences) {
        const p = query.preferences;
        if (p.likedCategories.includes(activity.category)) score += 15;
        const tagMatch = activity.tags.filter((t) => p.likedTags.includes(t)).length;
        score += tagMatch * 5;
        if (p.energyPreference.includes(activity.energy)) score += 10;
        if (p.costPreference.includes(activity.cost)) score += 10;
        if (p.indoorOutdoor === "both" || (p.indoorOutdoor === "indoor" && activity.indoor) || (p.indoorOutdoor === "outdoor" && activity.outdoor)) {
          score += 5;
        }
      }

      // Learned pattern boost
      for (const tag of activity.tags) {
        const patternScore = this.learnedPatterns.get(tag) || 0;
        score += patternScore * 0.5;
      }

      // Recency penalty (don't recommend recently done activities)
      const recentlyDone = this.userHistory.find((h) => h.activityId === activity.id && Date.now() - h.timestamp < 7 * 24 * 60 * 60 * 1000);
      if (recentlyDone) score -= 30;

      return { ...activity, score: Math.round(score), matchReasons };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  // Get all activities
  getAllActivities(): Activity[] {
    return [...this.activities];
  }

  // Get stats
  getStats() {
    return {
      totalActivities: this.activities.length,
      categories: [...new Set(this.activities.map((a) => a.category))].length,
      avgFunScore: Math.round((this.activities.reduce((sum, a) => sum + a.funScore, 0) / this.activities.length) * 10) / 10,
      totalPatterns: this.learnedPatterns.size,
      trainingHistory: this.userHistory.length,
    };
  }

  private generateCombinedName(a1: Activity, a2: Activity): string {
    const combos = [
      `${a1.name.split(" ")[0]} ${a2.name.split(" ").slice(-1)[0]} Fusion`,
      `The Ultimate ${a1.category} × ${a2.category} Experience`,
      `${a1.name.split(" ")[0]}-${a2.name.split(" ")[0]} Combo`,
    ];
    return combos[Math.floor(Math.random() * combos.length)];
  }

  private generateDescription(a1: Activity, a2: Activity): string {
    return `What happens when you combine ${a1.name} with ${a2.name}? Pure magic! Start with elements of ${a1.description.split(".")[0].toLowerCase()}, then mix in ${a2.description.split(".")[0].toLowerCase()}. The result is an unforgettable experience!`;
  }

  private combineEnergy(e1: Activity["energy"], e2: Activity["energy"]): Activity["energy"] {
    const levels = { low: 1, medium: 2, high: 3 };
    const avg = (levels[e1] + levels[e2]) / 2;
    if (avg < 1.5) return "low";
    if (avg < 2.5) return "medium";
    return "high";
  }

  private combineCost(c1: Activity["cost"], c2: Activity["cost"]): Activity["cost"] {
    const levels = { free: 0, cheap: 1, moderate: 2, expensive: 3 };
    const max = Math.max(levels[c1], levels[c2]);
    return (["free", "cheap", "moderate", "expensive"] as const)[max];
  }
}

// Singleton instance
export const funAI = new FunAIEngine();
export type { RecommendationQuery, GeneratedActivity, UserPreferences };
