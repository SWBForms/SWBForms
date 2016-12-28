(function() {
  'use strict';

  angular
    .module('FST2015PM')
    .config(config)
    .run(run);

  config.$inject = ["$stateProvider", "$urlRouterProvider"];
  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('dashboard', {
        abstract: true,
        url: "/dashboard",
        templateUrl: "templates/container.html"
      })
      .state('dashboard.main', {
        url: "/",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {

          }
        },
        resolve: {
          menuItems: function() {
            return dashboardMenuItems;
          }
        }
      })
      .state('dashboard.gridster', {
        url: "/gridster",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/gridster.html',
            controller: "GridsterCtrl as gridster"
          }
        }
      })
      .state('admin', {
        abstract: true,
        url: "/admin",
        templateUrl: "templates/container.html"
      })
      .state('admin.main', {
        url: "/",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/admin.html'
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          }
        }
      })
      .state('admin.datasources', {
        url: "/datasources",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/datasources.html',
            controller: 'DataSourcesCtrl'
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          }
        }
      })
      .state('admin.datasourceedit', {
        url: '/datasources/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/codeeditor.html',
            controller: 'CodeEditorCtrl'
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            var fname = $stateParams.id, mode;
            if (fname.endsWith(".js")) mode = "javascript";
            if (fname.endsWith(".html")) mode = "html";

            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/codemirror/lib/codemirror.css',
                    'lib/codemirror/theme/ambiance.css',
                    'lib/codemirror/addon/hint/show-hint.css',
                    'lib/codemirror/addon/lint/lint.css',
                    'lib/codemirror/lib/codemirror.js',
                    'lib/codemirror/mode/'+mode+'/'+mode+'.js',
                    'lib/codemirror/addon/edit/matchbrackets.js',
                    'lib/codemirror/addon/edit/closebrackets.js',
                    'lib/codemirror/addon/selection/active-line.js',
                    'lib/codemirror/addon/comment/continuecomment.js',
                    'lib/codemirror/addon/hint/show-hint.js',
                    'lib/codemirror/addon/lint/lint.js',
                    'lib/codemirror/addon/hint/javascript-hint.js',
                    'lib/codemirror/addon/lint/javascript-lint.js',
                    'lib/jshint/dist/jshint.js'
                  ]
              }
            ]);
          }
        }
      });

    $urlRouterProvider.otherwise("/dashboard/");

    var adminMenuItems = [
      {
        label: "Usuarios y permisos",
        link: "#"
      },
      {
        label: "DataSources",
        link: "#",
        stateLink: 'admin.datasources'
      },
      {
        label: "APIs",
        link: "#",
        menuItems: [
          {
            label:"Administrar",
            link:"#"
          },
          {
            label:"Gestionar claves",
            link:"#"
          }
        ]
      }
    ];

    var dashboardMenuItems = [
      {
        label: "Visualizaciones",
        link: "#",
        menuItems: [
          {
            label: "Mapas"
          },
          {
            label: "Gráficas dinámicas"
          }
        ]
      },
      {
        label: "Estadísticas",
        link: "#"
      },
      {
        label: "Consultas",
        link: "#",
        menuItems: [
          {
            label:"Desagregada",
            link:"#"
          },
          {
            label:"Predefinida",
            link:"#"
          }
        ]
      },
      {
        label: "Indicadores",
        link: "#",
        menuItems: [
          {
            label:"Ambientales",
            link:"#"
          },
          {
            label:"Culturales",
            link:"#"
          },
          {
            label:"Demográficos",
            link:"#"
          }
        ]
      }
    ];
  };

  run.$inject = ["$rootScope", "$state", "$templateCache"];
  function run($rootScope, $state, $templateCache) {
    $rootScope.$state = $state;
  };

})();
