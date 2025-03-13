declare module '*.js' {
  const value: unknown;
  export default value;
}

declare module '../loadmodels.js' {
  const value: unknown;
  export default value;
}

declare module '../dbconfig/databaseSequelize.js' {
  const value: unknown;
  export default value;
}

declare module '../swagger.js' {
  const value: unknown;
  export default value;
}

declare module 'socket.io/dist/typed-events' {
  interface DefaultEventsMap {
      [event: string]: (...args: unknown[]) => void;
  }
}