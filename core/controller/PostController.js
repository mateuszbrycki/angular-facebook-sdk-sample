var COMMENTS_AMOUNT = 1;

app.controller('PostController', function ($scope, $rootScope, facebookService) {

    $scope.showLoadPostForm = true;
    $scope.offset = 0;

    $scope.loadPost = function () {
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                getPost($scope.postId);
                $scope.loadComments();

            } else {
                FB.login(function (response) {
                    getPost($scope.postId);
                }, {scope: ['user_posts', 'user_photos']});
            }
        });
    };

    $scope.loadComments = function() {
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                getComments($scope.postId, $scope.offset, COMMENTS_AMOUNT);

            } else {
                FB.login(function (response) {
                    getPost($scope.postId);
                }, {scope: ['user_posts', 'user_photos']});
            }
        });
    };

    var getPost = function(postId) {
        facebookService.getPost(postId)
            .then(

                function success(response) {
                    $scope.post = response;
                    $scope.post.created_time = dateFormat(new Date($scope.post.created_time), "dd-mm-yyyy, h:MM");

                    facebookService.getUserObject(FB_UID)
                        .then(function (response) {
                            $scope.post_picture = response.picture.data.url;
                        });


                    $scope.showLoadPostForm = false;
                },


                function error(response) {
                    console.log(response);
                }
            );
    };

    var getComments = function(postId, offset, number) {

        facebookService.getCommentsForPost(postId, offset, number)
            .then(
                function success(response) {
                    var comments = response.data;

                    comments.forEach(function (data) {

                        data.created_time = dateFormat(new Date(data.created_time), "dd-mm-yyyy, h:MM");

                        facebookService.getUserObject(data.from.id)
                            .then(function (response) {
                                data.from.picture = response.picture.data.url;
                            });
                    });

                    var newComments = comments;
                    if ($scope.comments != null) {
                        newComments = $scope.comments.concat(newComments);
                    }
                    $scope.comments = newComments;
                    $scope.offset = newComments.length;
                },
                function error(response) {
                    console.log(response);
                });
    };

});