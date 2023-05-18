(function (window) {
    window.__env = window.__env || {};
  
    // API url
    window.__env.apiUrl = 'http://api.leap-tel.com/api/';
    window.__env.production = false;
    if (window.__env.production) {
    window.__env.documentPath = "https://dev.crystalmatrix.in/vmd-drive";
    } else {
      window.__env.documentPath = "/assets/uploads";
    }
  
    // Whether or not to enable debug mode
    // Setting this to false will disable console output
    window.__env.enableDebug = true;
  }(this));