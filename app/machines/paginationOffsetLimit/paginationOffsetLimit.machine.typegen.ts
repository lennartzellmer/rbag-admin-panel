
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
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
          "assignDataToContext": "UPDATE_TOTAL_COUNT";
"assignPagesToContext": "" | "GO_TO_TARGET_PAGE" | "NEXT_PAGE" | "PREV_PAGE" | "UPDATE_TOTAL_COUNT" | "xstate.stop";
"goToNextPage": "NEXT_PAGE";
"goToPrevPage": "PREV_PAGE";
"goToTargetPage": "GO_TO_TARGET_PAGE";
"sendPageUpdated": "GO_TO_TARGET_PAGE" | "NEXT_PAGE" | "PREV_PAGE";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "canGoToNextPage": "NEXT_PAGE";
"canGoToPrevPage": "PREV_PAGE";
"hasTotalCount": "";
"newTotalCountIsValidValue": "UPDATE_TOTAL_COUNT";
"targetPageIsWithinBounds": "GO_TO_TARGET_PAGE";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "awaitingTotalCount" | "idle";
        tags: never;
      }
  
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
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
          "assignDataToContext": "UPDATE_TOTAL_COUNT";
"assignPagesToContext": "" | "GO_TO_TARGET_PAGE" | "NEXT_PAGE" | "PREV_PAGE" | "UPDATE_TOTAL_COUNT" | "xstate.stop";
"goToNextPage": "NEXT_PAGE";
"goToPrevPage": "PREV_PAGE";
"goToTargetPage": "GO_TO_TARGET_PAGE";
"sendPageUpdated": "GO_TO_TARGET_PAGE" | "NEXT_PAGE" | "PREV_PAGE";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "canGoToNextPage": "NEXT_PAGE";
"canGoToPrevPage": "PREV_PAGE";
"hasTotalCount": "";
"newTotalCountIsValidValue": "UPDATE_TOTAL_COUNT";
"targetPageIsWithinBounds": "GO_TO_TARGET_PAGE";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "awaitingTotalCount" | "idle";
        tags: never;
      }
  