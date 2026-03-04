export const QUESTION_TYPES = {
  WELCOME_SCREEN: "welcome_screen",
  SHORT_TEXT: "short_text",
  LONG_TEXT: "long_text",
  EMAIL: "email",
  MULTIPLE_CHOICE: "multiple_choice",
  YES_NO: "yes_no",
  RATING: "rating",
  THANK_YOU_SCREEN: "thank_you_screen",
} as const;

export type QuestionType = (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES];

export interface ChoiceOption {
  id: string;
  label: string;
}

export interface WelcomeScreenProperties {
  buttonText?: string;
  showButton?: boolean;
}

export interface TextProperties {
  placeholder?: string;
  maxLength?: number;
}

export interface MultipleChoiceProperties {
  choices: ChoiceOption[];
  allowOther?: boolean;
}

export interface RatingProperties {
  steps: number;
  shape?: "star" | "heart" | "thumb";
}

export interface ThankYouScreenProperties {
  showButton?: boolean;
  buttonText?: string;
  buttonUrl?: string;
}

export type QuestionProperties =
  | WelcomeScreenProperties
  | TextProperties
  | MultipleChoiceProperties
  | RatingProperties
  | ThankYouScreenProperties
  | Record<string, unknown>;

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
}

export const DEFAULT_THEME: FormTheme = {
  primaryColor: "#2563eb",
  backgroundColor: "#ffffff",
  textColor: "#0f172a",
};

export interface FormSettings {
  showProgressBar: boolean;
  showQuestionNumbers: boolean;
}

export const DEFAULT_SETTINGS: FormSettings = {
  showProgressBar: true,
  showQuestionNumbers: true,
};

export interface QuestionWithParsedProperties {
  id: string;
  formId: string;
  type: QuestionType;
  title: string;
  description: string | null;
  required: boolean;
  properties: QuestionProperties;
  order: number;
}

export interface FormWithQuestions {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: "draft" | "published" | "closed";
  theme: FormTheme;
  settings: FormSettings;
  createdAt: Date;
  updatedAt: Date;
  questions: QuestionWithParsedProperties[];
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  welcome_screen: "Welcome Screen",
  short_text: "Short Text",
  long_text: "Long Text",
  email: "Email",
  multiple_choice: "Multiple Choice",
  yes_no: "Yes / No",
  rating: "Rating",
  thank_you_screen: "Thank You Screen",
};

export const QUESTION_TYPE_ICONS: Record<QuestionType, string> = {
  welcome_screen: "Hand",
  short_text: "Type",
  long_text: "AlignLeft",
  email: "Mail",
  multiple_choice: "List",
  yes_no: "ToggleLeft",
  rating: "Star",
  thank_you_screen: "Heart",
};

export function getDefaultProperties(type: QuestionType): QuestionProperties {
  switch (type) {
    case "welcome_screen":
      return { buttonText: "Start", showButton: true };
    case "short_text":
      return { placeholder: "Type your answer here..." };
    case "long_text":
      return { placeholder: "Type your answer here..." };
    case "email":
      return { placeholder: "name@example.com" };
    case "multiple_choice":
      return {
        choices: [
          { id: "1", label: "Option 1" },
          { id: "2", label: "Option 2" },
          { id: "3", label: "Option 3" },
        ],
        allowOther: false,
      };
    case "yes_no":
      return {};
    case "rating":
      return { steps: 5, shape: "star" };
    case "thank_you_screen":
      return { showButton: false };
    default:
      return {};
  }
}
