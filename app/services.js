'use strict';

app.service("nodeApp", function($q, appMenu) {

this.buildNode = function($scope) {

$scope.getProjectPath = function() {return "_autogenerated.colt"};
$scope.saveProject = function() {};
$scope.sendToJava = function() {};
$scope.openPopup = function() {};
$scope.openJsDoc = function() {};
$scope.openBrowserWindow = function(url) {window.open(url)};

if(!top['require']){
	setTimeout(function() {
		$scope.$apply(function() {
			for (var i = 0; i <= 50; i++) {
				$scope.log("WARNING", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, saepe dolore esse voluptatem sunt voluptate? Voluptas, aliquid, obcaecati odit dignissimos excepturi repudiandae assumenda quod nemo aliquam porro reiciendis enim odio doloribus magnam incidunt quas dolorem. Sequi, perspiciatis, quis ex quaerat commodi itaque nisi id odit quod distinctio similique ab quia blanditiis qui fuga quae dicta iste veniam beatae natus repellat aspernatur voluptatem laborum magnam esse fugit officiis amet maiores quibusdam quasi sint corporis dignissimos sit aliquid iure maxime ducimus unde voluptate consectetur minima error voluptatum nam accusamus enim debitis deleniti in consequatur voluptatibus temporibus eveniet! Est, reprehenderit, vero, quam ut nihil temporibus illum accusantium impedit inventore fugiat suscipit adipisci odit excepturi consequuntur assumenda omnis et provident? Quos error similique eligendi. Officiis, explicabo vero eaque rem officia illum magni exercitationem quibusdam unde commodi. Tempora, ipsa, commodi, possimus, quaerat alias iure modi quis neque voluptate aliquam architecto excepturi cupiditate illum repellendus deleniti velit libero. Dignissimos, ratione, delectus, quis minus cupiditate atque saepe tempore ad excepturi praesentium suscipit vitae repellat accusantium odit tempora ab doloribus. Quis, modi, alias, nesciunt eius tenetur doloribus sit mollitia rerum id delectus esse assumenda voluptatum minus dolores quasi dolor corporis saepe quam eaque aspernatur nostrum reiciendis accusamus neque ea illum explicabo ab cupiditate fugit architecto iure nobis nemo rem ad sequi perspiciatis consequuntur laborum! Eveniet, magni, neque qui veritatis error voluptates odio molestiae maxime ex fugiat doloribus vitae blanditiis inventore quisquam nostrum sint dolor at dicta ipsum atque dolore nisi excepturi numquam temporibus ducimus rem velit aspernatur repellat laudantium repudiandae officiis nemo expedita corporis. Mollitia, debitis, sapiente, praesentium dolores tenetur veritatis libero inventore perspiciatis quos quasi veniam culpa rem architecto ab cupiditate eum tempore consequatur nesciunt ipsam qui dolorum soluta ad! Mollitia, distinctio, deserunt, corporis dolorem dolores laudantium ipsam error reiciendis laborum aut dolor est ut vero eos fugit deleniti libero illo cumque recusandae nobis quidem optio enim quam adipisci earum veritatis consectetur suscipit! In, et, facere minima laboriosam eos illo error molestiae veritatis repellendus magnam quasi suscipit harum cum veniam cupiditate eaque nihil assumenda eligendi cumque dolore perspiciatis fugiat adipisci hic enim iste accusantium aperiam odio consequuntur doloremque culpa incidunt quia beatae recusandae ullam quidem nostrum autem aliquam iure ipsa minus voluptas quo voluptatem dicta reprehenderit temporibus quis? Adipisci, fuga, laboriosam voluptatem molestias harum earum vitae architecto sequi quasi at unde est nam repellat ut mollitia officia assumenda. Vel, quos, corporis minima earum assumenda obcaecati sunt quasi.", "index.html");
			}
			$scope.loadProject($scope.getProjectPath());
		});
	}, 1000);
	return;
}

var gui = require('nw.gui');
var win = gui.Window.get(); win.showDevTools();
var os = require('os');
var path = require('path');
var app_path;
var demo_path;
if(os.platform() == "darwin") {
    app_path = path.dirname(process.execPath)
    while(path.basename(app_path) != 'node-webkit.app' && path.basename(app_path) != 'colt.app') {
        app_path = path.dirname(app_path)
    }
    if(path.basename(app_path) == 'colt.app') {
        demo_path = path.dirname(app_path) + path.sep + 'projects'
        app_path = path.dirname(app_path) + path.sep + 'Contents' + path.sep + 'Resources' + path.sep + 'app.nw' + path.sep;
    } else {
        app_path = path.dirname(app_path) + path.sep;
        demo_path = app_path + 'projects'
    }
} else {
    app_path = path.dirname(process.execPath) + path.sep;
    demo_path = app_path + 'projects'
}
$scope.demoProjectsDir = demo_path;
$scope.getAppPath = function(){
	return app_path
};
var jarPath = app_path + "java" + path.sep + "colt.jar";

var java;
var runJava = function (projectPath) {
	var spawn = require('child_process').spawn;
	if (projectPath) {
		java  = spawn('java', ['-jar', jarPath, projectPath, '-ui']);
	} else {
		java  = spawn('java', ['-jar', jarPath, '-ui']);//for debug '-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005'
	}

	java.on('close', function (code, signal) {
		console.log('child process terminated due to receipt of signal ' + signal);
		//win.close(true);
	});

	var trimMessage = function(message) {
		message =  (message + "");
		message =  message.replace(/^\[fileScanner\]\s+/, "");
		message =  message.replace(/(\n|\r)+$/, "");
		message =  message.replace(/\\n/g, "\\n")
                          .replace(/\\'/g, "\\'")
                          .replace(/\\"/g, '\\"')
                          .replace(/\\&/g, "\\&")
                          .replace(/\\r/g, "\\r")
                          .replace(/\\t/g, "\\t")
                          .replace(/\\b/g, "\\b")
                          .replace(/\\f/g, "\\f");
        return message;
	};

	var isPing = function(text) {
		var pingRegexp = /ping/g;
		return pingRegexp.exec(text) != null;
	};

	java.stdout.on('data', function (text) {
		text = (text+"");
		try{
			var regexp = /-json:(.+?)\/json/g;
			var match = regexp.exec(text);

			if(match){
				while(match) {
					var messageText = match[1];
					match = regexp.exec(text)
					// console.log("match: " + match);
					// console.log("message text", messageText);
					try{
						var json = JSON.parse(trimMessage(messageText));
						$scope.$apply(function() {
							switch(json.type) {
								case "log":
                                    $scope.logMessages.push(json);
                                    $scope.updateFilters();
									break;
								case "runSession":
                                    $scope.sessionInProgress = true;
                                    $scope.sessionStateSwitching = false;
									break;
								case "stopSession":
                                    $scope.sessionInProgress = false;
                                    $scope.sessionStateSwitching = false;
									break;
                                case "proxy":
                                    if (serviceDefers[json.type] != null) {
                                        serviceDefers[json.type].resolve(JSON.parse(json.message));
                                        serviceDefers[json.type] = null;
                                    }
                                    break;
								case "exec":
                                    var exec = require('child_process').exec;
                                    var child = exec(json.exec,
                                      function (error, stdout, stderr) {
                                        if(("" + stdout).length)$scope.log('INFO', trimMessage(stdout));
                                        if(("" + stderr).length)$scope.log('ERROR', trimMessage(stderr));
                                        if (error !== null) {
                                          $scope.log("ERROR", 'exec error: ' + error);
                                        }
                                    });
									break;
								case "serialNumber":
                                    switch(json.state){
                                        case "show":
                                            $scope.showPurchaseDialog().then(
                                                $scope.sendToJava,
                                                function() {
                                                    $scope.sendToJava("continue");
                                                },
                                                function(update) {
                                                    gui.Shell.openExternal(update);
                                                }
                                            );
                                            break;
                                        case "error":
                                            $scope.showMessageDialog("error", json.message)
                                            .then($scope.showSerialNumberDialog)
                                            .then($scope.sendToJava,
                                                function() {
                                                    $scope.sendToJava("continue");
                                                });
                                            break;
                                        case "success":
                                            $scope.showMessageDialog("app", json.message)
                                            break;
                                        case "demoMessage":
                                            $scope.showMessageDialog("info", json.message)
                                            break;
                                        case "demoCount":
                                            $scope.showContinueWithDemoDialog(json.message).then(
                                                $scope.sendToJava,
                                                function() {
                                                    $scope.sendToJava("continue");
                                                },
                                                function(update) {
                                                    gui.Shell.openExternal(update);
                                                }
                                            )
                                            break;
                                    }
									break;
								case "recentProjectsPaths":
                                    if (serviceDefers[json.type] != null) {
                                        serviceDefers[json.type].resolve(json.array);
                                        serviceDefers[json.type] = null;
                                    } else {
                                        appMenu.buildMenu($scope, json.array);
                                    }
									break;
								case "project":
                                    switch(json.state) {
                                        case "savedAs":
                                        case "load":
                                            projectFilePath = json.message;
                                            $scope.loadProject(projectFilePath);
                                            break;
                                        case "created":
                                            break;
                                        case "createError":
                                            break;
                                        case "loaded":
                                            break;
                                        case "loadError":
                                            break;
                                        case "saved":
                                            break;
                                        case "saveError":
                                            break;
                                    }
									break;
								case "javadoc":
									var jsdocPath = app_path + 'node_modules' + path.sep + '.bin' + path.sep + 'jsdoc';
									var jscfgPath = app_path + 'jsdoc' + path.sep + 'conf.json';

									console.log("About to run: " + jsdocPath + " -c " + jscfgPath);

									var fs = require('fs'), htmlFile = app_path + path.sep + 'jsdoc' + path.sep + 'out' + path.sep + 'global.html';
									try { fs.unlinkSync(htmlFile); } catch (whatever) {}

									/*var spawn = require('child_process').spawn, 
									jsdoc = spawn(jsdocPath, ['-c', jscfgPath, '-t', 'readable'], { cwd : app_path });

									jsdoc.on('error', function (err) {
										console.log('Jsdoc error:', err);
									});

									jsdoc.stdout.on('data', function (data) {
										console.log('jsdoc: ' + data);
									});

									jsdoc.on('close', function (code) {
										console.log('Jsdoc exited with code ' + code);
										if (code == 0) {
											// ok to show the file
											if (fs.existsSync(htmlFile)) {
												console.log('openJsDocFile(\"' + htmlFile +'\")')
												$scope.openJsDocFile(htmlFile);
											} else {
												console.log('Jsdoc failed to generate ' + htmlFile)
											}
										}
									});*/
									var exec = require('child_process').exec;
									exec(jsdocPath + " -c " + jscfgPath, function (error, stdout, stderr) {
										if (error !== null) {
											console.log('exec error: ' + error);
										} else {
											// ok to show the file
											if (fs.existsSync(htmlFile)) {
												console.log('openJsDocFile(\"' + htmlFile +'\")')
												$scope.openJsDocFile(htmlFile);
											} else {
												console.log('Jsdoc failed to generate ' + htmlFile)
											}
										}
									}, { cwd : app_path, env : { path : "/usr/local/bin:$PATH"} });

									break
							}
							$scope.$emit(json.type, json);
						});
						// console.log("json.type = ", json.type)
					}catch(e){
						console.error("error parse json: |" + messageText + "|", e);
						return;
					}
					
				}
			}else if(!isPing(text)){
				console.log("stdout:", text);
			}
			
			if(isPing(text)){
		    	$scope.sendToJava("pong");
		    }
		}catch(e){
			console.error("!!!!! ", e);
		}
	});

	java.stderr.on('data', function (message) {
		// console.log('stderr: '+ message);
		$scope.log("ERROR", trimMessage(message));
	});
};

win.on('close', function() {
	if(java) {
		java.kill();
	}
	this.close(true);
});

/**
 * [saveProject description]
 * @param  {[type]} filePath [description]
 * @param  {[type]} data     [description]
 * @return {[type]}          [description]
 */
$scope.saveProject = function (filePath, data){
	data = {xml:data};
	var d = $q.defer();
    var xml2js = new X2JS({
        escapeMode:false
    });
    var xml = xml2js.json2xml_str(data);
    var fs = require('fs');

	fs.writeFile(filePath, xml, function(err) {
		if(err) {
			d.reject(err);
		} else {
			d.resolve();
            $scope.sendToJava("save " + new Date().getTime())
		}
	}); 
	return d.promise;
};

var serviceDefers = {};
$scope.sendToJava = function(message, resolveType) {
	var d = serviceDefers[resolveType] || $q.defer();
	serviceDefers[resolveType] = d; 
	java.stdin.write(message + "\n");
	return d.promise;
};

$scope.openExternal = function (url) {
    gui.Shell.openExternal(url);
};

var getModalSise = function(modal) {
	var $ = modal.window.$;
	var popupWindow = $(".popup-window");
	if(!popupWindow.size())return [];
	return [$(popupWindow)[0].scrollWidth, $(popupWindow)[0].scrollHeight];
}

$scope.openPopup = function(html, title) {
	var modal = gui.Window.open('app://./'+ html,{
		toolbar: false,
        icon: "icons/colt_128.png"
	});
	modal.hide();
	win.hide();
	var popupObject = {};
	modal.on('loaded', function() {
		console.log("popup opened");
		// modal.showDevTools();
		modal.focus();
		modal.title = title;
		modal.x = win.x - 40;
		modal.y = win.y - 40;
		modal.setPosition("mouse");
		var size = getModalSise(modal);
		modal.resizeTo(size[0],size[1]);
		var $ = modal.window.$;
		var popupWindow = $(".popup-window");
		if(popupWindow.size() > 0){
			modal.resizeTo($(popupWindow)[0].scrollWidth, $(popupWindow)[0].scrollHeight+32);
		}else{
			console.log("popup window not found")
		}
		if(!modal.window.popup){
			modal.window.popup = popupObject;
		}else{
			modal.window.setPopup(popupObject);
		}
		modal.show();
		modal.focus();
	});
	modal.on('closed', function() {
		console.log("popup closed", popupObject);
		if(popupObject && popupObject.hasOwnProperty("close")){
			if(popupObject.close()){
				win.close();
			}
		}
		win.show();
		win.focus();
	});
	popupObject.window = modal;
	return popupObject;
};

var jsDocSize = {width:500, height:300};
var jsDocPosition = {x:win.x,y:win.y};

$scope.openJsDoc = function(html, title) {
	var modal = gui.Window.open('app://./popups.html#/js-doc-popup', {
	  position: 'mouse',
	  title:title,
	  width: jsDocSize.width,
	  height: jsDocSize.height,
	  frame: false
	});
	modal.hide();
	var popupObject = {
		title : title,
		html : html
	};
	modal.on('loaded', function() {
		modal.x = jsDocPosition.x;
		modal.y = jsDocPosition.y;
		if(!modal.window.popup){
			modal.window.popup = popupObject;
		}else{
			modal.window.setPopup(popupObject);
		}
		modal.show();
		modal.focus();
	});
	modal.on('blur', function() {
		var size = getModalSise(modal);
		if(size){
			jsDocSize = {width:Math.max(400, size[0]), height:Math.max(210, size[1])};
		}
		jsDocPosition.x = modal.x;
		jsDocPosition.y = modal.y;
		modal.close(true);
	});
};

$scope.openJsDocFile = function(url) {
	var modal = gui.Window.open('file://'+url, {
	  position: 'mouse',
	  width: jsDocSize.width,
	  height: jsDocSize.height,
	  frame: false
	});
	modal.hide();
	modal.on('loaded', function() {
		modal.x = jsDocPosition.x;
		modal.y = jsDocPosition.y;
		modal.show();
		modal.focus();
	});
	modal.on('blur', function() {
		jsDocSize = {width:Math.max(400, modal.width), height:Math.max(210, modal.height)};
		jsDocPosition = {x:modal.x,y:modal.y};
		modal.close(true);
	});
};

$scope.getProjectPath = function(){
    console.log(projectFilePath);
	return projectFilePath;
};

$scope.openBrowserWindow = function(url) {
	gui.Shell.openExternal(url)
}

appMenu.buildMenu($scope, []);

console.log("app args:", gui.App.argv);
var projectFilePath = gui.App.argv[0];
if(projectFilePath) {
	runJava(projectFilePath);
    $scope.sendToJava("getRecentProjectsPaths");
} else {
	runJava();
	$scope.sendToJava("getRecentProjectsPaths", "recentProjectsPaths")
	.then(function (array) {
		if (array.length > 0) {
			projectFilePath = array[0];
			$scope.sendToJava("load -file:" + projectFilePath)
		} else {
			$scope.showWelcomeScreen([], true)
		}
	})
}
		
	} 
});  
