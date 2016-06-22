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
    /*
    when('/mapa/:edificioId/:pavimentoId', {
      templateUrl: 'app/components/mapa/mapaView.html',
      controller: 'MapaController'
    }).
    */
    otherwise({
      redirectTo: '/home'
    });
});