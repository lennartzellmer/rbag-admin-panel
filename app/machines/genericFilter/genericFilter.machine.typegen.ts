
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "xstate.after(800)#(machine).waitingForAnotherEvent": { type: "xstate.after(800)#(machine).waitingForAnotherEvent" };
"xstate.init": { type: "xstate.init" };
"xstate.stop": { type: "xstate.stop" };
        };
        invokeSrcNameMap: {

        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "assignFilterValue": "SET_FILTER" | "SET_FILTER_DEBOUNCED";
"assignInitialStateFromURLParam": "xstate.init";
"informParentMachine": "CONFIRM" | "SET_FILTER" | "xstate.after(800)#(machine).waitingForAnotherEvent" | "xstate.init" | "xstate.stop";
"setOrDeleteURLParam": "CONFIRM" | "SET_FILTER" | "xstate.after(800)#(machine).waitingForAnotherEvent" | "xstate.stop";
        };
        eventsCausingDelays: {

        };
        eventsCausingGuards: {

        };
        eventsCausingServices: {

        };
        matchesStates: "idle" | "waitingForAnotherEvent";
        tags: never;
      }
