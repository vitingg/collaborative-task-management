import type { UserProperties } from "@collab-task-management/types";

export type loginUserResponse = {
  token: string;
  refresh: string;
  user: UserProperties;
};
