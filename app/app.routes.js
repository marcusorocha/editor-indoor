app.config(function($routeProvider) {
  $routeProvider.
    when('/home', {
      templateUrl: 'app/components/home/homeView.html',
      controller: 'HomeController'
    }).
    when('/mapas', {
      templateUrl: 'app/components/mapas/mapasView.html',
      controller: 'MapasController'
    }).
    when('/campus', {
      templateUrl: 'app/components/campus/campusListView.html',
      controller: 'CampusListController'
    }).
    when('/campus/new', {
      templateUrl: 'app/components/campus/campusFormView.html',
      controller: 'CampusFormController'
    }).
    when('/campus/edit/:id', {
      templateUrl: 'app/components/campus/campusFormView.html',
      controller: 'CampusFormController'
    }).
    when('/blocos', {
      templateUrl: 'app/components/blocos/blocoListView.html',
      controller: 'BlocoListController'
    }).
    when('/blocos/new', {
      templateUrl: 'app/components/blocos/blocoFormView.html',
      controller: 'BlocoFormController'
    }).
    when('/blocos/edit/:id', {
      templateUrl: 'app/components/blocos/blocoFormView.html',
      controller: 'BlocoFormController'
    }).
    when('/pavimentos', {
      templateUrl: 'app/components/pavimentos/pavimentoListView.html',
      controller: 'PavimentoListController'
    }).
    when('/pavimentos/new', {
      templateUrl: 'app/components/pavimentos/pavimentoFormView.html',
      controller: 'PavimentoFormController'
    }).
    when('/pavimentos/edit/:id', {
      templateUrl: 'app/components/pavimentos/pavimentoFormView.html',
      controller: 'PavimentoFormController'
    }).
    otherwise({
      redirectTo: '/home'
    });
});