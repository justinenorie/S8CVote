import { registerAuthHandlers } from "./auth";
import { registerElectionHandlers } from "./elections";

export function registerIpcHandlers(): void {
  registerAuthHandlers();
  registerElectionHandlers();
}
