'use strict';

var app = angular.module("COLT", [
	'colt.directives', 
	'log.view.directive',
	'log.visualizer.directives', 
	'ui.router', 
	'ngGrid'
	]);

app.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);

app.run(function($rootScope, $http) {

	$rootScope.$on('$stateChangeStart', function(event, toState){ 
		$rootScope.pageName = toState.pageName;
		$rootScope.pageIndex = toState.pageIndex;
	})

	$http.get('_autogenerated.colt',
		{transformResponse:function(data) {
			var x2js = new X2JS();
			var json = x2js.xml_str2json( data );
			return json;
		}
	})
	.then(function(res) {
		var model = $rootScope.model = res.data.xml;
		model.build['use-custom-output-path'] = model.build['use-custom-output-path'] === "true";
		model.live.live['live-html-edit'] = model.live.live['live-html-edit'] === "true";
		model.live.live.paused = model.live.live.paused === "true";
		model.live.live['disable-in-minified'] = model.live.live['disable-in-minified'] === "true";
		model.live.live['enable-debuger'] = model.live.live['enable-debuger'] === "true";
		model.build['use-real-time-transformation'] = model.build['use-real-time-transformation'] === "true";
		model.build.precompile['coffee-script'] = model.build.precompile['coffee-script'] === "true";
		model.build.precompile['type-script'] = model.build.precompile['type-script'] === "true";
		model.build.precompile['use-less'] = model.build.precompile['use-less'] === "true";
		model.build.precompile['use-sass'] = model.build.precompile['use-sass'] === "true";
		model.build['offline-cms']['integrate-mercury'] = model.build['offline-cms']['integrate-mercury'] === "true";
		model.build['offline-cms']['run-mercury'] = model.build['offline-cms']['run-mercury'] === "true";
		model.build.security['use-inspectable'] = model.build.security['use-inspectable'] === "true";
		model.live.settings['disconnect'] = model.live.settings['disconnect'] === "true";
		model.live.settings['clear-log'] = model.live.settings['clear-log'] === "true";
		console.log(model);
	});
});

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/settings");
	$stateProvider
	.state('settings', {
		url: "/settings",
		templateUrl: "partials/settings.html",
		pageName: "Project Settings",
		pageIndex: 0
	})
	.state('build', {
		url: "/build",
		templateUrl: "partials/build.html",
		pageName: "Production Build",
		pageIndex: 1
	})
	.state('log', {
		url: "/log",
		templateUrl: "partials/log.html",
		pageName: "Log",
		pageIndex: 2
	});
})

app.controller("AppCtrl", function($scope) {
	
	$scope.logMessages = [];
	// for (var i = 0; i <= 100; i++) {
	// 	var message = {level:"LOG", message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, saepe dolore esse voluptatem sunt voluptate? Voluptas, aliquid, obcaecati odit dignissimos excepturi repudiandae assumenda quod nemo aliquam porro reiciendis enim odio doloribus magnam incidunt quas dolorem. Sequi, perspiciatis, quis ex quaerat commodi itaque nisi id odit quod distinctio similique ab quia blanditiis qui fuga quae dicta iste veniam beatae natus repellat aspernatur voluptatem laborum magnam esse fugit officiis amet maiores quibusdam quasi sint corporis dignissimos sit aliquid iure maxime ducimus unde voluptate consectetur minima error voluptatum nam accusamus enim debitis deleniti in consequatur voluptatibus temporibus eveniet! Est, reprehenderit, vero, quam ut nihil temporibus illum accusantium impedit inventore fugiat suscipit adipisci odit excepturi consequuntur assumenda omnis et provident? Quos error similique eligendi. Officiis, explicabo vero eaque rem officia illum magni exercitationem quibusdam unde commodi. Tempora, ipsa, commodi, possimus, quaerat alias iure modi quis neque voluptate aliquam architecto excepturi cupiditate illum repellendus deleniti velit libero. Dignissimos, ratione, delectus, quis minus cupiditate atque saepe tempore ad excepturi praesentium suscipit vitae repellat accusantium odit tempora ab doloribus. Quis, modi, alias, nesciunt eius tenetur doloribus sit mollitia rerum id delectus esse assumenda voluptatum minus dolores quasi dolor corporis saepe quam eaque aspernatur nostrum reiciendis accusamus neque ea illum explicabo ab cupiditate fugit architecto iure nobis nemo rem ad sequi perspiciatis consequuntur laborum! Eveniet, magni, neque qui veritatis error voluptates odio molestiae maxime ex fugiat doloribus vitae blanditiis inventore quisquam nostrum sint dolor at dicta ipsum atque dolore nisi excepturi numquam temporibus ducimus rem velit aspernatur repellat laudantium repudiandae officiis nemo expedita corporis. Mollitia, debitis, sapiente, praesentium dolores tenetur veritatis libero inventore perspiciatis quos quasi veniam culpa rem architecto ab cupiditate eum tempore consequatur nesciunt ipsam qui dolorum soluta ad! Mollitia, distinctio, deserunt, corporis dolorem dolores laudantium ipsam error reiciendis laborum aut dolor est ut vero eos fugit deleniti libero illo cumque recusandae nobis quidem optio enim quam adipisci earum veritatis consectetur suscipit! In, et, facere minima laboriosam eos illo error molestiae veritatis repellendus magnam quasi suscipit harum cum veniam cupiditate eaque nihil assumenda eligendi cumque dolore perspiciatis fugiat adipisci hic enim iste accusantium aperiam odio consequuntur doloremque culpa incidunt quia beatae recusandae ullam quidem nostrum autem aliquam iure ipsa minus voluptas quo voluptatem dicta reprehenderit temporibus quis? Adipisci, fuga, laboriosam voluptatem molestias harum earum vitae architecto sequi quasi at unde est nam repellat ut mollitia officia assumenda. Vel, quos, corporis minima earum assumenda obcaecati sunt quasi.", source: "index.js", timestamp:"01.09.2013"};
	// 	$scope.logMessages.push(message);
	// };

	$scope.filter = {};
	$scope.filter.errorsCount = 0;
	$scope.filter.errorsCount = 0;
	$scope.filter.warningCount = 0;
	$scope.filter.infoCount = 0;
	$scope.filter.liveCount = 0;

	$scope.selectLogFilter = function(filter) {
		$scope.filter.filter = filter;
	}

	// node-webkit

	var nodeApp;

	if(top['require']){

		var gui = require('nw.gui'); 
		var win = gui.Window.get(); win.showDevTools();

		console.log("args: " + gui.App.argv);

		var startup = new Date().getTime();
		var spawn = require('child_process').spawn,

		java  = spawn('java', ['-jar', './java/colt.jar', '/Volumes/Archive/Projects/colt-ui/autogenerated.colt', '-ui'], {stdio:['ipc']});

		java.on('close', function (code, signal) {
			console.log('child process terminated due to receipt of signal ' + signal);
		//win.close(true);
		});

		java.stdout.on('data', function (message) {
			try{
				message = (message + "").replace(/(\r\n|\n|\r)/gm,"");
				if(message.length > 6){
					console.log(message);
					var header = message.substr(0, 6);
					console.log("--------------" + header + "|")
					if(header == "-json:"){
						try{
							var bodyText = message.substr(6);
							var body = eval(bodyText);
						}catch(e){
							console.log("error parse json: |" + bodyText + "|");
							return;
						}

						if(body.type == "log"){
							$scope.logMessages.push(body);
						}
					}

				}

			}catch(e1){
				console.log("!!!!! " + e1)
			}

		//-json:type=log
		//-json:type=event
		//java.send("runSession")
		//console.log('[' + (new Date().getTime() - startup) + ']: '+ message);
		});

		java.stderr.on('data', function (message) {
			console.log('stderr: '+ message);
		});

		win.on('close', function() {
			java.kill();
			this.close(true);
		});

		var tray = new gui.Tray({ title: '', icon: './icons/colt_32.png' });
		var menu = new gui.Menu();
		menu.append(new gui.MenuItem({ type: 'checkbox', label: 'box1' }));
		tray.menu = menu;

		var fs = require('fs');
		var Q = require('q');
		var x2js = new X2JS();

		nodeApp = {
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
			}
		}

		nodeApp.loadProject("./test-project.colt").then(function(data) {
			console.log("PROJECT:");
			console.log(data);			
		});
	}


})