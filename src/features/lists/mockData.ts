export interface MockListItem {
  id: number;
  name: string;
  role: string;
  department: "Engineering" | "Design" | "DevOps" | "Product" | "Security" | "Data";
  email: string;
  status: "Active" | "Away" | "Offline" | "Busy";
  performanceScore: number;
  tasksCompleted: number;
  joinDate: string;
  location: string;
  avatarBg: string;
}

const FIRST_NAMES = [
  "Alex", "Jordan", "Taylor", "Morgan", "Sam", "Chris", "Pat", "Riley", "Casey", "Avery",
  "Dakota", "Reese", "Quinn", "Skyler", "Cameron", "Jesse", "Jamie", "Logan", "Hayden", "Rowan",
  "Aditya", "Elena", "Marcus", "Priya", "Chen", "Fatima", "Liam", "Sophia", "Noah", "Olivia",
  "Ethan", "Emma", "Lucas", "Ava", "Mateo", "Mia", "Leo", "Isabella", "Aria", "Kai"
];

const LAST_NAMES = [
  "Chen", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez",
  "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson",
  "Patel", "Srivastava", "Sharma", "Kim", "Tanaka", "Ivanov", "Dubois", "Müller", "Silva", "Kowalski"
];

const ROLES = [
  { title: "Senior React Architect", dept: "Engineering" },
  { title: "Frontend Performance Specialist", dept: "Engineering" },
  { title: "Full-Stack Engineer", dept: "Engineering" },
  { title: "UI/UX Systems Designer", dept: "Design" },
  { title: "Design Technologist", dept: "Design" },
  { title: "Kubernetes & DevOps Lead", dept: "DevOps" },
  { title: "Site Reliability Engineer", dept: "DevOps" },
  { title: "Principal Product Manager", dept: "Product" },
  { title: "Technical Product Owner", dept: "Product" },
  { title: "Application Security Analyst", dept: "Security" },
  { title: "Infra Security Specialist", dept: "Security" },
  { title: "Big Data & ML Engineer", dept: "Data" },
  { title: "Analytics Infrastructure Lead", dept: "Data" },
] as const;

const LOCATIONS = [
  "San Francisco, CA", "New York, NY", "London, UK", "Bengaluru, IN",
  "Berlin, DE", "Tokyo, JP", "Toronto, CA", "Amsterdam, NL", "Austin, TX", "Remote"
];

const STATUSES: Array<"Active" | "Away" | "Offline" | "Busy"> = ["Active", "Away", "Offline", "Busy"];

const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-purple-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-fuchsia-500 to-rose-600",
];

// Deterministic generator to avoid memory explosion when generating up to 100,000 items
export function generateMockItem(index: number): MockListItem {
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(Math.floor(index / FIRST_NAMES.length) + index) % LAST_NAMES.length];
  const roleObj = ROLES[index % ROLES.length];
  const location = LOCATIONS[(index * 3) % LOCATIONS.length];
  const status = STATUSES[(index * 7) % STATUSES.length];
  const avatarBg = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  const score = 65 + ((index * 13) % 35);
  const tasks = 15 + ((index * 29) % 320);

  const year = 2020 + (index % 5);
  const month = String(1 + ((index * 2) % 12)).padStart(2, "0");
  const day = String(1 + ((index * 5) % 28)).padStart(2, "0");

  return {
    id: index + 1,
    name: `${firstName} ${lastName}`,
    role: roleObj.title,
    department: roleObj.dept,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index > 100 ? index : ""}@techstack.io`,
    status,
    performanceScore: score,
    tasksCompleted: tasks,
    joinDate: `${year}-${month}-${day}`,
    location,
    avatarBg,
  };
}

// Generate an array of mock items
export function generateMockDataset(count: number): MockListItem[] {
  const dataset = new Array<MockListItem>(count);
  for (let i = 0; i < count; i++) {
    dataset[i] = generateMockItem(i);
  }
  return dataset;
}

// Pre-generated static dataset for pagination demos (500 items is ideal for realistic 50 pages of 10 items)
export const PAGINATION_DATASET: MockListItem[] = generateMockDataset(500);
