/* jshint globalstrict:true */
'use strict';

var ng = require('ng');

ng.module('kloy.router', []).
  constant('KLOY_ROUTER_EVENTS', {
    'ROUTE_CHANGE_START': 'kloyRouteChangeStart',
    'ROUTE_CHANGE_SUCCESS': 'kloyRouteChangeSuccess',
    'ROUTE_CHANGE_ERROR': 'kloyRouteChangeError',
    'ROUTE_CHANGE_REQUEST': 'kloyRouteChangeRequest'
  }).
  provider('kloyRouter', require('./router')).
  provider('kloyLayoutManager', require('./layout-manager')).
  factory('kloyRoute', require('./route')).
  directive('krRoute', require('./route-directive')).
  run(/*@ngInject*/function (
    kloyLayoutManager, $rootScope, KLOY_ROUTER_EVENTS
  ) {

    // Expose sections to scope
    $rootScope.section = function (section) {

      return kloyLayoutManager.sections()[section] || null;
    };

    // Update layout when route changes
    $rootScope.$on(KLOY_ROUTER_EVENTS.ROUTE_CHANGE_SUCCESS, function () {

      kloyLayoutManager.sync();
    });
  }).
  run(/*@ngInject*/function (
    $rootScope, KLOY_ROUTER_EVENTS, kloyRouter, $location, kloyRoute
  ) {

    // Update route when change request event is heard
    $rootScope.$on(
      KLOY_ROUTER_EVENTS.ROUTE_CHANGE_REQUEST,
      function routeListener (e, routeName, params) {

        kloyRouter.toRoute(routeName, params);
      }
    );

    $rootScope.$on('$locationChangeSuccess', function (e, newUrl, oldUrl) {

      var path = $location.path(),
          routePath = kloyRoute.path(),
          firstChange = true;

      // Checks if first change heard
      // Checks if route's path is not new path
      // Checks if new URL is not old URL
      if (
        (firstChange === true && path !== routePath) ||
        (path !== routePath && newUrl !== oldUrl)
      ) {
        path = $location.path();
        kloyRouter.toPath(path);
      }

      firstChange = false;
    });
  });
