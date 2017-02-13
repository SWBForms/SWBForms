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
      .state('dashboard.maps', {
        url: "/maps",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/maps.html',
            controller: "MapsCtrl as maps"
          }
        },
        resolve: {
          menuItems: function() {
            return dashboardMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/leaflet/dist/leaflet.css',
                    'lib/leaflet/dist/leaflet.js',
                    'lib/google-maps/lib/Google.min.js',
                    'js/dataviz/constants.js',
                    'js/dataviz/charts.js',
                    'js/dataviz/maps.js',
                    'js/dataviz/datatables.js',
                    'js/dataviz/dataviz.js',
                  ]
              }
            ]);
          }
        }
      })
      .state('dashboard.charts', {
        url: "/charts",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/charts.html',
            controller: "ChartsCtrl as charts"
          }
        },
        resolve: {
          menuItems: function() {
            return dashboardMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/d3/d3.min.js',
                    'js/dataviz/constants.js',
                    'js/dataviz/charts.js',
                    'js/dataviz/maps.js',
                    'js/dataviz/datatables.js',
                    'js/dataviz/dataviz.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('dashboard.datatables', {
        url: "/datatables",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/datatables.html',
            controller: "DataTablesCtrl as datatables"
          }
        },
        resolve: {
          menuItems: function() {
            return dashboardMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/gijgo/dist/combined/js/gijgo.min.js',
                    'lib/gijgo/dist/combined/js/gijgo.js',
                    'js/dataviz/constants.js',
                    'js/dataviz/charts.js',
                    'js/dataviz/maps.js',
                    'js/dataviz/datatables.js',
                    'js/dataviz/dataviz.js'
                  ]
              }
            ]);
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
      .state('admin.pmcatalog', {
        url: "/pmcatalog",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/pmcatalog.html',
            controller: "PMCatalog"//as PM
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'js/dataviz/constants.js',
                    'js/dataviz/charts.js',
                    'js/dataviz/maps.js',
                    'js/dataviz/datatables.js',
                    'js/dataviz/dataviz.js',
                    'js/controllers/pmcatalog.controller.js',
                    'js/services/pmcatalog.service.js',
                    'lib/bootbox/bootbox.js',
                    'lib/ng-file-upload/ng-file-upload-shim.min.js',
                    'lib/ng-file-upload/ng-file-upload.min.js'
                  ]
              }
            ]);
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
      .state('admin.users', {
        url: '/users',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/users.html',
            controller: 'UsersCtrl'
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.roles', {
        url: '/roles',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/roles.html',
            controller: 'RolesCtrl'
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.adduser', {
        url: '/users/add/:action',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/usersAdd.html',
            controller: 'UsersCtrl'
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js'
                  ]
              }
            ]);
          }
        }
      }).state('admin.edituser', {
        url: '/users/edit/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/usersEdit.html',
            controller: 'UsersCtrl'
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.addrole', {
        url: '/role/add/:action',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/roleAdd.html',
            controller: 'RolesCtrl'
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js'
                  ]
              }
            ]);
          }
        }
      }).state('admin.editrole', {
        url: '/role/edit/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/roleEdit.html',
            controller: 'RolesCtrl'
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js'
                  ]
              }
            ]);
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
                  insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/codemirror/lib/codemirror.css',
                    'lib/codemirror/theme/ambiance.css',
                    'lib/codemirror/addon/hint/show-hint.css',
                    'lib/codemirror/addon/lint/lint.css',
                    'lib/AngularJS-Toaster/toaster.min.css',
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
                    'lib/jshint/dist/jshint.js',
                    'lib/AngularJS-Toaster/toaster.min.js'
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
        menuItems: [
          {
            label:"Usuarios",
            stateLink: 'admin.users'
          },
          {
            label:"Roles",
            stateLink: 'admin.roles'
          }
        ]
      },
      {
        label: "Fuentes de datos",
        menuItems: [
          {
            label:"Extractores",
            stateLink: 'admin.dataextractors'
          },
          {
            label:"Catálogos",
            stateLink: 'admin.catalogs'
          },
          {
            label:"DataSources",
            stateLink: 'admin.datasources'
          }
        ]
      },
      {
        label: "Catálogo de PM",
        link: "#",
        stateLink: 'admin.pmcatalog'
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
      },
      {
        label: "Bitácora",
        link: '#'
      },
    ];

    var dashboardMenuItems = [
      {
        label: "Visualizaciones",
        link: "#",
        menuItems: [
          {
            label: "Mapas",
            stateLink: 'dashboard.maps'
          },
          {
            label: "Gráficas dinámicas",
            stateLink: 'dashboard.charts'
          }
        ]
      },
      {
        label: "Estadísticas",
        link: "#",
        stateLink: 'dashboard.datatables'
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
