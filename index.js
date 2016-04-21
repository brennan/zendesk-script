var request = require('request');
var fs = require('fs');

// this script pulls the first 30 community posts from ZenDesk's community, then iterates through each post
// to return comments associated with each post; both are written to separate files using the
// FS node module

(function getData() {

  request.get('https://segment.zendesk.com/api/v2/community/posts.json', {
    'auth': {
      'user': 'YOUR EMAIL',
      'pass': 'YOUR ZENDESK PASSWORD'
    }
  }, function(error, response, body) {

    fs.writeFile('community_posts.json', body, (err) => {
      if (err) throw err;
    });

    var json = JSON.parse(body);
    var posts = json.posts

    for ( var i = 0; i < posts.length; i++ ) {

      request.get('https://segment.zendesk.com/api/v2/community/posts/' + posts[i].id + '/comments.json?per_page=300', {
        'auth': {
          'user': 'YOUR EMAIL',
          'pass': 'YOUR ZENDESK PASSWORD'
        }
      }, function(error, response, body) {

        fs.appendFile('community_comments.json', body, (err) => {
          if (err) throw err;
        });

      });

    }

  });

})();
