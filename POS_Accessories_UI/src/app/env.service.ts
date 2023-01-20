export class EnvService {

    // The values that are defined here are the default values that can
    // be overridden by env.js
    win: any = window;
    // API url
    public apiUrl = this.win["__env"]["apiUrl"];

    public documentPath = this.win["__env"]["documentPath"];
    
    // Whether or not to enable debug mode
    public enableDebug = this.win["__env"]["enableDebug"];
  
    constructor() {
    }
  
  }