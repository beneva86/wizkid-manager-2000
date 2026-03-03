export enum EmailTemplate {
  FIRED = 'FIRED',
  UNFIRED = 'UNFIRED',
}

export type EmailPayloadMap = {
  [EmailTemplate.FIRED]: { name: string };
  [EmailTemplate.UNFIRED]: { name: string };
};

export type RenderedEmail = {
  subject: string;
  bodyText: string;
};
