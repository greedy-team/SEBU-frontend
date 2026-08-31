import { labHandlers } from "./labHandlers";
import { authHandlers } from "./authHandlers";
import { userHandlers } from "./userHandlers";
import { communityHandlers } from "./communityHandlers";

export const handlers = [
  ...labHandlers,
  ...authHandlers,
  ...userHandlers,
  ...communityHandlers,
];
