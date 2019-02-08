// dependencies
const InstanceCtrl = require('./index.js')

// create new controller
let instanceCtrl = new InstanceCtrl();

// start new child instances with name string, returns node native <ChildProcess>
let subProcess = instanceCtrl.startInstance('nodeApp', `node example-process.js`)
let subProcess2 = instanceCtrl.startInstance('nodeApp', `node example-process.js`)

// let's get a console log when process exited
subProcess.on('exit', (code, signal) => {
	console.log(`subProcess exited with code: '${code}', signal: '${signal}'`);
});

// get all instances under 'nodeApp' child name, returns: array of <ChildProcess>'s
let instances = instanceCtrl.getInstances('nodeApp');

// kill all instances under 'nodeApp' child name, returns: true if any kill signal sent
let killStatus = instanceCtrl.killInstances('nodeApp');

// get all instances, returns: object with child name as property, process arrays as value
let allInstances = instanceCtrl.getAll();

// kill all instances, returns: object with child name as property, process arrays as value
// let killStatusAll = instanceCtrl.killAll();

// start another instance to test global functions
(async function() {
  let subProcess = await instanceCtrl.singleInstance('nodeApp', `node example-process.js`);
	let subProcess2 = await instanceCtrl.singleInstance('nodeApp', `node example-process.js`);
	let subProcess3 = await instanceCtrl.singleInstance('nodeApp', `node example-process.js`);
})();