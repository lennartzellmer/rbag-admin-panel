
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.fetch-data": { type: "done.invoke.fetch-data"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.fetch-data": { type: "error.platform.fetch-data"; data: unknown };
"xstate.init": { type: "xstate.init" };
"xstate.stop": { type: "xstate.stop" };
        };
        invokeSrcNameMap: {
          "fetchData": "done.invoke.fetch-data";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "assignDataToContext": "done.invoke.fetch-data";
"assignErrorToContext": "error.platform.fetch-data";
"clearErrorMessageFromContext": "RETRY" | "xstate.stop";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "isNoDataAvailable": "done.invoke.fetch-data";
        };
        eventsCausingServices: {
          "fetchData": "RETRY" | "xstate.init";
        };
        matchesStates: "error" | "fetchedDataAvailable" | "fetchedNoData" | "fetching";
        tags: never;
      }
  