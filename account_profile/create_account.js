module.exports = function(controller) {

  // using studio.after, we can tap into the moment when a conversation
  // has completed and do something useful, like store the account data in the database!
  controller.studio.after('create_profile', function(convo) {

      // first, check to ensure the conversation ended successfully
      // the user may have quit, or timed out without completing.
      if (convo.successful()) {

          // get the users answers.
          // profile_data will be an object with fields like
          // {
          //   'email': 'sample@email.com',
          //   'color': 'blue',
          //   'teeshirt': 'large'
          // }
          var profile_data = convo.extractResponses();

          // now, use Botkit's built in storage system to put this info in the db
          // the user id is stored in the convo.context object
          controller.storage.users.get(convo.context.user, function(err, user) {

              // if user was not found, create a new object
              if (!user) {
                  user = {
                      id: convo.context.user,
                  }
              }

              user.profile = profile_data;

              controller.storage.users.save(user);

          });


      }

  });


}
