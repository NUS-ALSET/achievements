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
