app.factory('facebookService', function($q) {

    var apiCall = function(url, fields) {
        var deferred = $q.defer();

        FB.api(url, fields,
            function (response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            }
        );
        return deferred.promise;
    };

    return {

        getPost: function (postId) {
            return apiCall("/" + FB_UID + "_" + postId, {fields: 'from,message,created_time'});
        },

        getUserObject: function(uid) {
            return apiCall("/" + uid, {fields: 'picture'});
        },

        getCommentsForPost: function(postId, offset, number) {
            return apiCall("/" + FB_UID + "_" + postId + "/comments?limit=" + number + "&offset=" + offset + "&summary=1",
                null);
        }
    }
});