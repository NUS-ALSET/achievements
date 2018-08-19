/**
 * This file currently used only for code-completion but someday it should
 * help to use Typescript
 */

export const ASSIGNMENT_TEXT = "Text";
export type ASSIGNMENT_TEXT = typeof ASSIGNMENT_TEXT;
export const ASSIGNMENT_PROFILE = "Profile";
export type ASSIGNMENT_PROFILE = typeof ASSIGNMENT_PROFILE;
export const ASSIGNMENT_CODECOMBAT = "CodeCombat";
export type ASSIGNMENT_CODECOMBAT = typeof ASSIGNMENT_CODECOMBAT;
export const ASSIGNMENT_CODECOMBAT_NUMBER = "CodeCombat_Number";
export type ASSIGNMENT_CODECOMBAT_NUMBER = typeof ASSIGNMENT_CODECOMBAT_NUMBER;
export const ASSIGNMENT_TEAMFORMATION = "TeamFormation";
export type ASSIGNMENT_TEAMFORMATION = typeof ASSIGNMENT_TEAMFORMATION;
export const ASSIGNMENT_TEAMTEXT = "TeamText";
export type ASSIGNMENT_TEAMTEXT = typeof ASSIGNMENT_TEAMTEXT;
export const ASSIGNMENT_PATHACTIVITY = "PathActivity";
export type ASSIGNMENT_PATHACTIVITY = typeof ASSIGNMENT_PATHACTIVITY;
export const ASSIGNMENT_PATHPROGRESS = "PathProgress";
export type ASSIGNMENT_PATHPROGRESS = typeof ASSIGNMENT_PATHPROGRESS;

export interface ICourseAssignmentBase {
  id: string;
  name: string;
  solutionVisible: boolean;
  deadline: string;
  details: string;
  open: string;
  orderIndex: number;
  visible: boolean;
  useTeams: boolean;
  teamFormation: string;
}

export interface ICourseAssignmentText extends ICourseAssignmentBase {
  questionType: ASSIGNMENT_TEXT;
}
export interface ICourseAssignmentProfile extends ICourseAssignmentBase {
  questionType: ASSIGNMENT_PROFILE;
}
export interface ICourseAssignmentCodeCombat extends ICourseAssignmentBase {
  level: string;
  questionType: ASSIGNMENT_CODECOMBAT;
}
export interface ICourseAssignmentCodeCombat_Number
  extends ICourseAssignmentBase {
  questionType: ASSIGNMENT_CODECOMBAT_NUMBER;
  number: number;
}
export interface ICourseAssignmentTeamFormation extends ICourseAssignmentBase {
  questionType: ASSIGNMENT_TEAMFORMATION;
}
export interface ICourseAssignmentTeamText extends ICourseAssignmentBase {
  questionType: ASSIGNMENT_TEAMTEXT;
}
export interface ICourseAssignmentPathActivity extends ICourseAssignmentBase {
  allowSolutionImport?: boolean;
  path: string;
  problem: string;
  questionType: ASSIGNMENT_PATHACTIVITY;
}
export interface ICourseAssignmentPathProgress extends ICourseAssignmentBase {
  path: string;
  questionType: ASSIGNMENT_PATHPROGRESS;
}

export type ICourseAssignment =
  | ICourseAssignmentText
  | ICourseAssignmentProfile
  | ICourseAssignmentCodeCombat
  | ICourseAssignmentCodeCombat_Number
  | ICourseAssignmentTeamFormation
  | ICourseAssignmentTeamText
  | ICourseAssignmentPathActivity
  | ICourseAssignmentPathProgress;

export interface ICourseMember {
  id: string;
  acceptedEULA?: boolean;
  consumerKey?: string;
  displayName: string;
  name: string;
  photoURL?: string;
  progress: {
    totalSolutions: number;
    lastSolutionTime: number;
  };
  solutions: {
    [assignmentId: string]: {
      createdAt: number;
      published: number;
      value: any;
      originalSolution?: any;
    };
  };
}

export interface ICourseAssignmentsMap {
  [id: string]: ICourseAssignment;
}

export interface ICourseMembersMap {
  [id: string]: ICourseMember;
}

export interface ICourse {
  id: string;
  description: string;
  instructorName: string;
  name: string;
  owner: string;
  members: {
    [id: string]: ICourseMember;
  };
  totalAssignments: number;
  assignments: ICourseAssignment[];
}

export interface IPathInfo {
  id: string;
  name: string;
  owner: string;
  totalActivities: number;
}

/**
 * Super interface for path activities particular interfaces
 */
export interface IPathActivityBase {
  id: string;
  name: string;
  description: string;
  owner: string;
  path: string;
  solved: boolean;
}

// Type guards for activities
export const ACTIVITY_TEXT = "text";
export type ACTIVITY_TEXT = typeof ACTIVITY_TEXT;
export const ACTIVITY_PROFILE = "profile";
export type ACTIVITY_PROFILE = typeof ACTIVITY_PROFILE;
export const ACTIVITY_CODECOMBAT = "codeCombat";
export type ACTIVITY_CODECOMBAT = typeof ACTIVITY_CODECOMBAT;
export const ACTIVITY_CODECOMBATNUMBER = "codeCombatNumber";
export type ACTIVITY_CODECOMBATNUMBER = typeof ACTIVITY_CODECOMBATNUMBER;
export const ACTIVITY_JUPYTER = "jupyter";
export type ACTIVITY_JUPYTER = typeof ACTIVITY_JUPYTER;
export const ACTIVITY_JUPYTERINLINE = "jupyterInline";
export type ACTIVITY_JUPYTERINLINE = typeof ACTIVITY_JUPYTERINLINE;
export const ACTIVITY_YOUTUBE = "youtube";
export type ACTIVITY_YOUTUBE = typeof ACTIVITY_YOUTUBE;
export const ACTIVITY_GAME = "game";
export type ACTIVITY_GAME = typeof ACTIVITY_GAME;

/**
 * Text activity
 */
export interface IPathActivityText extends IPathActivityBase {
  type: ACTIVITY_TEXT;
  question: string;
}

/**
 * Profile activity
 */
export interface IPathActivityProfile extends IPathActivityBase {
  type: ACTIVITY_PROFILE;
}

/**
 * CodeCombat activity
 */
export interface IPathActivityCodeCombat extends IPathActivityBase {
  type: ACTIVITY_CODECOMBAT;
  level: string;
}

/**
 * CodeCombatNumber activity
 */
export interface IPathActivityCodeCombatNumber extends IPathActivityBase {
  type: ACTIVITY_CODECOMBATNUMBER;
  count: number;
}

/**
 * Jupyter colaboratory activity
 */
export interface IPathActivityJupyter extends IPathActivityBase {
  type: ACTIVITY_JUPYTER;
  frozen: number;
  problemURL: string;
  solutionURL: string;
}

/**
 * Jupyter Inline activity
 */
export interface IPathActivityJupyterInline extends IPathActivityBase {
  type: ACTIVITY_JUPYTERINLINE;
  code: number;
  frozen: number;
  problemURL: string;
  solutionURL: string;
}

/**
 * Youtube activity
 */
export interface IPathActivityYoutube extends IPathActivityBase {
  type: ACTIVITY_YOUTUBE;
  topics: boolean;
  questionAfter: boolean;
  questionAnswer: boolean;
  questionCustom: boolean;
  customText?: string;
  youtubeURL: string;
}

/**
 * Game activity
 */
export interface IPathActivityGame extends IPathActivityBase {
  type: ACTIVITY_GAME;
}

export type PathActivity = IPathActivityText |
  IPathActivityProfile |
  IPathActivityCodeCombat |
  IPathActivityCodeCombatNumber |
  IPathActivityJupyter |
  IPathActivityJupyterInline |
  IPathActivityYoutube;

export interface IPathActivities {
  path: IPathInfo;
  activities: PathActivity[]
}

export interface ITeamFormationInfo {
  assignmentId: string;
  name: string;
}
