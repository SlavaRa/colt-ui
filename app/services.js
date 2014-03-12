'use strict';

app.factory("nodeApp", function($scope) {
	if(!top['require'])return {
		loadProject : function() {},
		saveProject : function() {},
		sendToJava : function() {}
	}

	var gui = require('nw.gui'); 
	var win = gui.Window.get(); win.showDevTools();

	console.log("args: " + gui.App.argv);

	var startup = new Date().getTime();
	var spawn = require('child_process').spawn,

	java  = spawn('java', ['-jar', './java/colt.jar', '/Volumes/Archive/Projects/colt-ui/autogenerated.colt', '-ui'], {stdio:['ipc']});
	java.stdin.setEncoding = 'utf-8';

	java.on('close', function (code, signal) {
		console.log('child process terminated due to receipt of signal ' + signal);
		//win.close(true);
	});

	java.stdout.on('data', function (message) {
		try{
			message =  (message + "");
			message =  message.replace(/(\n|\r)+$/, "")
			message =  message.replace(/\\n/g, "\\n")
                              .replace(/\\'/g, "\\'")
                              .replace(/\\"/g, '\\"')
                              .replace(/\\&/g, "\\&")
                              .replace(/\\r/g, "\\r")
                              .replace(/\\t/g, "\\t")
                              .replace(/\\b/g, "\\b")
                              .replace(/\\f/g, "\\f");

			if(message.length > 6){
				console.log(message);
				var header = message.substr(0, 6);
				console.log("--------------" + header + "|")
				if(header == "-json:"){
					try{
						var messageText = message.substr(6);
						var json = JSON.parse(messageText);
					}catch(e){
						console.log("error parse json: |" + messageText + "|");
						return;
					}
					if(json.type == "log"){
						$scope.logMessages.push(json);
						$scope.updateFilters();
					}else if(json.type == "runSession"){
						$scope.sessionInProgress = true;
					}else if(json.type == "stopSession"){
						$scope.sessionInProgress = false;
					}else if(json.type == "exec"){
						var exec = require('child_process').exec;
					    var child = exec(json.exec,
						  function (error, stdout, stderr) {
						    if(("" + stdout).length)$scope.log('INFO', stdout);
						    if(("" + stderr).length)$scope.log('ERROR', stderr);
						    if (error !== null) {
						      $scope.log("ERROR", 'exec error: ' + error);
						    }
						});
					}
					$scope.$emit(json.type, json);
				}

			}

		}catch(e1){
			console.log("!!!!! " + e1)
		}
	});

	java.stderr.on('data', function (message) {
		console.log('stderr: '+ message);
	});

	win.on('close', function() {
		java.kill();
		this.close(true);
	});

	// var tray = new gui.Tray({ title: '', icon: './icons/colt_32.png' });
	// var menu = new gui.Menu();
	// menu.append(new gui.MenuItem({ type: 'checkbox', label: 'box1' }));
	// tray.menu = menu;

	var fs = require('fs');
	var Q = require('q');
	var x2js = new X2JS();

	return {
		loadProject : function(filePath){
			var d = Q.defer();
			fs.readFile(filePath, function(err, data) {
				if(err){
					d.reject(err);
				}else{
					var json = x2js.xml_str2json( data );
					d.resolve(json);
				}
			});
			return d.promise;
		},

		saveProject : function (filePath, data){
			var d = Q.defer();
			var xml = xml2js.json2xml(data);

			fs.writeFile(filePath, xml, function(err) {
				if(err) {
					d.reject(err);
				} else {
					d.resolve();
				}
			}); 
			return d.promise;
		},
		sendToJava: function(message) {
			java.stdin.write(message + "\n");
		}
}
})