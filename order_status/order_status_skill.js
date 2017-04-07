/*

Botkit Studio Skill module to enhance the "status" script

*/




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


module.exports = function(controller) {

    // Validate user input: user_email
    controller.studio.validate('status','user_email', function(convo, next) {

        var value = convo.extractResponse('user_email');
        // Slack wraps the email address in a link! we just want the raw email
       value = value.replace(/.*\<.*?\|(.*?)\>.*/,'$1');
      
      // look up an order in our database
      // (pretending for now)
      fakeLookupOrder(value).then(function(order_record) {
            
            // allow conversation to reference the order object as {{vars.order.<field>}}
            convo.setVar('order', order_record);
          
        }).catch(function(err) {
            
            // no order found!
            convo.gotoThread('does_not_exist');
        });
      
        // always call next!
        next();

    });

}
