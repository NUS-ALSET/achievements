export const NoStartWhiteSpace = /^\S/;

/* eslint-disable no-useless-escape */
export const KeyboardInputs = /^[a-zA-Z0-9\t\n\s,./<>?;:"'`!@#$%^&*()\[\]{}_+=|\\-]*$/;

/* eslint-disable no-useless-escape */
export const AddName = /^[a-zA-Z0-9_+|\-,.?;:"'`()\s]{1,80}$/;

/* eslint-disable no-useless-escape */
export const CoursePswRule = /^[a-zA-Z0-9\t\n./<>?;:"'`!@#$%^&*()\[\]{}_+=|\\-]{2,16}$/;
