app.config(function($routeProvider) {
  $routeProvider.
    when('/home', {
      templateUrl: 'app/components/home/homeView.html',
      controller: 'HomeController'
    }).
    when('/mapa/:edificioId/:pavimentoId', {
      templateUrl: 'app/components/mapa/mapaView.html',
      controller: 'MapaController'
    }).
    otherwise({
      redirectTo: '/home'
    });
});