/*

Botkit Studio Skill module to enhance the "order_status" script

*/

module.exports = function(controller) {

  
    // using studio.validate, we can tap into the moment when the user has just
    // responded with a valid email address, and do something useful like look up their
    // order in the database.
    controller.studio.validate('order_status','user_email', function(convo, next) {

        // get the value of the `user_email` variable that was configured in the Botkit UI
        var value = convo.extractResponse('user_email');

        // Slack wraps the email address in a link! we just want the raw email
        // this line cleans up the value and strips it down to _just an email_
        value = value.replace(/.*\<.*?\|(.*?)\>.*/,'$1');
      
        // look up an order in our database
        // (pretending for now)
        fakeLookupOrder(value).then(function(order_record) {

              // we got an order!
              // using setVar, we make this object available to the templates 
              // allowing messages to reference the order object as {{vars.order.<field>}}
              convo.setVar('order', order_record);

          }).catch(function(err) {

              // no order found!
              // use gotoThread to transition to an error message
              convo.gotoThread('does_not_exist');
          });

          // always call next!
          next();

    });

}



// This is a placeholder function for doing an asynchronous lookup of order information
// You can use this pattern to do any sort of API call or database lookup
// Resolve the promise with the successfully results
// Reject the promise to cause the bot to show a not found error
function fakeLookupOrder(email) {
  
    return new Promise(function(resolve, reject) {
      
        if (email == 'fail@fail.com') {
                reject();
        } else {

          // in real life we would do a database call here
          resolve({
            id: '123456789',
            item: 'Cool Technology Widget',
            date: 'April 20, 2017',
            email: email,
            image: 'http://placekitten.com/500/200',
            address: {
                name:  'Joe Sample',
                line1: '123 Main Street',
                line2: 'Austin, TX 78704'
            },
            payment: {
              last4: '1234',
              logo: 'https://d3kgr2cjl1zxw7.cloudfront.net/mastercard_logo.png',
            
            },
            status: 'Arriving Saturday, April 8'            
          });
        }      
      
    });
  
  
}

