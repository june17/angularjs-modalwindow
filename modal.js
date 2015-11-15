   // Create an application module for our demo.
        var app = angular.module( "Demo", [ "ngAnimate" ] );
        app.controller(
            "AppController",
            function( $scope, modals ) {
                $scope.alertSomething = function() {
                    var promise = modals.open(
                        "alert",
                        {
                            message: "Are you sure?"
                        }
                    );
                };
              
            }
        );
        app.controller(
            "AlertModalController",
            function( $scope, modals ) {
                $scope.message = ( modals.params().message || "Whoa!" );
                $scope.close = modals.resolve;
            }
        );
       app.service(
            "modals",
            function( $rootScope, $q ) {
                var modal = {
                    deferred: null,
                    params: null
                };
                return({
                    open: open,
                    params: params,
                    reject: reject,
                    resolve: resolve
                });
                  function open( type, params) {
                    modal.deferred = $q.defer();
                    modal.params = params;
                    $rootScope.$emit( "modals.open", type );
                    return( modal.deferred.promise );
                }
                function params() {
                    return( modal.params || {} );
                }
                   function reject( reason ) {
                    if ( ! modal.deferred ) {
                        return;
                    }
                    modal.deferred.reject( reason );
                    modal.deferred = modal.params = null;
                    $rootScope.$emit( "modals.close" );
                }
                function resolve( response ) {
                    if ( ! modal.deferred ) {
                        return;
                    }
                    modal.deferred.resolve( response );
                    modal.deferred = modal.params = null;
                    $rootScope.$emit( "modals.close" );
                }
            }
        );
         app.directive(
            "modalAlert",
            function( $rootScope, modals ) {
                return{
                    link:link,
                    templateUrl: 'modal.html' 
                };
                function link( scope, element, attributes ) {
                    scope.subview = null;
                     element.on(
                        "click",
                        function handleClickEvent( event ) {
                            if ( element[ 0 ] !== event.target ) {
                                return;
                            }
                            scope.$apply( modals.reject );
                        }
                    );
                    $rootScope.$on(
                        "modals.open",
                        function handleModalOpenEvent( event, modalType ) {
                            scope.subview = modalType;
                        }
                    );
                    $rootScope.$on(
                        "modals.close",
                        function handleModalCloseEvent( event ) {
                            scope.subview = null;
                        }
                    );
                }
            }
        );