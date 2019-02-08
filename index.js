// ****************************************************************************************************
// Init
// ****************************************************************************************************

// native dependencies
const spawn = require('child_process').spawn;


// ****************************************************************************************************
// Module Exports
// ****************************************************************************************************

module.exports = function(){

	// constructor variables
	let children = {};
	let self = this;

	// get command array for node spawn
	this.getCommand = function(cmdString){
		return cmdString.replace(/\[\r\n]/gm, "").replace(/\s\s+/g, ' ').trim().split(" ")
	}

	// get child instances
	this.getInstances = function(childName){
		if(!children.hasOwnProperty(childName)){
			children[childName] = [];
		}
		return children[childName];
	}

	// kill child instances
	this.killInstances = function(childName){
		if(childName && children.hasOwnProperty(childName) && children[childName].length){
			children[childName] = children[childName].filter(function(child){
				child.kill()
				return false;
			})
			return true;
		} else {
			return false;
		}
	}

	// spawn a new child instance
	this.startInstance = function(childName, cmd){
		// console.log('starting new instance');
		let cmdArr = self.getCommand(cmd)
		let subProcess = spawn(cmdArr[0], cmdArr.slice(1), [], {
			stdio: 'inherit'
		})
		subProcess.stdout.on('data', function(data){
			console.log(data.toString().replace(/\n$/,""));
		})
		children[childName] = Array.isArray(children[childName]) ? children[childName] : [];
		children[childName].push(subProcess);
		subProcess.on('exit', function(code, signal){
			children[childName] = children[childName].filter(function(childProcess){
				return subProcess.pid != childProcess.pid;
			})
		})
		return subProcess;
	}

	// spawn a new child instance, killing old ones.
	this.singleInstance = async function(childName, cmd){
		return new Promise(function(resolve, reject) {
			if(self.getInstances(childName).length){
				self.getInstances(childName)[0].on('exit', function(code, signal){
					resolve(self.startInstance(childName, cmd));
				});
				self.killInstances(childName);
			} else {
				resolve(self.startInstance(childName, cmd));
			}
		});
	}

	// kill all child instances
	this.killAll = function(){
		let rslt = false;
		Object.keys(children).forEach(function(childName){
			let status = self.killInstances(childName)
			rslt = rslt || status;
		})
		return rslt;
	}

	// get all child instances
	this.getAll = function(){
		return children;
	}

}