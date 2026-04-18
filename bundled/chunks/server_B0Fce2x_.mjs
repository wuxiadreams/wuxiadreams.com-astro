globalThis.process ??= {};
globalThis.process.env ??= {};
import { p as pipelineSymbol } from "./sequence_BN2_VHP0.mjs";
import { A as AstroError, d as ActionCalledFromServerError } from "./transition_DzUAhAmX.mjs";
import { c as createActionsProxy } from "./worker-entry_BlhFEBb5.mjs";
const actions = createActionsProxy({
  handleAction: async (param, path, context) => {
    const pipeline = context ? Reflect.get(context, pipelineSymbol) : void 0;
    if (!pipeline) {
      throw new AstroError(ActionCalledFromServerError);
    }
    const action = await pipeline.getAction(path);
    if (!action) throw new Error(`Action not found: ${path}`);
    return action.bind(context)(param);
  }
});
export {
  actions as a
};
