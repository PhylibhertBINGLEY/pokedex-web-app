
//usage on linux:
//> MY_OWN_ENV_VAR=DontPanic node envDemo.js HIP HOP

//usage on windows and powershell (something like this)
//$env:MY_OWN_ENV_VAR=DontPanic ; node index.js HIP HOP

// see https://nodejs.org/api/process.html  for complete overview

/* Here is a demo of the "process" object */
/////////////////////
// events
process.on('exit', function(code) {
   // Following code will never execute.
   setTimeout(function() {
      console.log("This will not run");
   }, 0);
  
   console.log('About to exit with code:', code);
});



///////////////////////
// Properties & methods

// Printing to console
process.stdout.write("Hello World!" + "\n");

// Reading passed parameter
// Expected : "HIP" and "HOP"
process.argv.forEach(function(val, index, array) {
   console.log(index + ': ' + val);
});

// Getting executable path
console.log(process.execPath);

// Platform Information 
console.log(process.platform);

// Environment Variables
console.log(process.env.MY_OWN_ENV_VAR); // Should be "DontPanic"
console.log(process.env.PWD);

// Print the current directory
console.log('Current directory: ' + process.cwd());

// Print the process version
console.log('Current version: ' + process.version);

// Print the memory usage
console.log(process.memoryUsage());



///////////////////////
// to launch the exit event.
console.log("Program Ended");


