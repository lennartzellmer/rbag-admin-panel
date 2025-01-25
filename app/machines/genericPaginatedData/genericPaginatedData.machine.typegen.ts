
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"done.invoke.genericFetchFilteredPaginatedDataMachine.ready.fetching:invocation[0]": { type: "done.invoke.genericFetchFilteredPaginatedDataMachine.ready.fetching:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.genericFetchFilteredPaginatedDataMachine.ready.fetching:invocation[0]": { type: "error.platform.genericFetchFilteredPaginatedDataMachine.ready.fetching:invocation[0]"; data: unknown };
"xstate.init": { type: "xstate.init" };
"xstate.stop": { type: "xstate.stop" };
        };
        invokeSrcNameMap: {
          "fetchData": "done.invoke.genericFetchFilteredPaginatedDataMachine.ready.fetching:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "appendOrAssignDataToContext": "done.invoke.genericFetchFilteredPaginatedDataMachine.ready.fetching:invocation[0]";
"assignErrorToContext": "error.platform.genericFetchFilteredPaginatedDataMachine.ready.fetching:invocation[0]";
"assignFilterToContext": "FILTER_UPDATED";
"assignLimitAndOffsetToContext": "PAGE_UPDATED";
"clearErrorMessageFromContext": "FILTER_RESET" | "FILTER_UPDATED" | "RETRY" | "xstate.stop";
"removeFilterFromContext": "FILTER_RESET";
"resetPaginationAndData": "FILTER_RESET" | "FILTER_UPDATED";
"sendTotalCountToPaginationMachine": "done.invoke.genericFetchFilteredPaginatedDataMachine.ready.fetching:invocation[0]";
"spawnFilterMachines": "xstate.init";
"spawnPaginationActor": "FILTER_RESET" | "FILTER_UPDATED" | "xstate.init";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "isDataAvailable": "done.invoke.genericFetchFilteredPaginatedDataMachine.ready.fetching:invocation[0]";
        };
        eventsCausingServices: {
          "fetchData": "" | "FILTER_RESET" | "FILTER_UPDATED" | "PAGE_UPDATED" | "RETRY" | "done.state.genericFetchFilteredPaginatedDataMachine.waitForInitialFilter";
        };
        matchesStates: "ready" | "ready.error" | "ready.fetching" | "ready.idle" | "ready.idle.dataAvailable" | "ready.idle.noData" | "waitForInitialFilter" | { "ready"?: "error" | "fetching" | "idle" | { "idle"?: "dataAvailable" | "noData"; }; };
        tags: never;
      }
  