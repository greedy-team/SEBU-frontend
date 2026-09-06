import { labHandlers } from "./labHandlers";
import { labReviewHandlers } from "./labReviewHandlers";
import { authHandlers } from "./authHandlers";
import { userHandlers } from "./userHandlers";
import { communityHandlers } from "./communityHandlers";

export const handlers = [
  ...labHandlers,
  ...labReviewHandlers,
  ...authHandlers,
  ...userHandlers,
  ...communityHandlers,
];
