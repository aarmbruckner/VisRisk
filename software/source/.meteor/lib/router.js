import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/', {
  name: 'index',
  action() {
    // Render a template using Blaze
    this.render('Home');

    // Can be used with BlazeLayout,
    // and ReactLayout for React-based apps
  }
});

FlowRouter.route('/test', {
    action: function(params, queryParams) {
        console.log("Yeah! We are on the test page");
    }
});

// Create 404 route (catch-all)
FlowRouter.route('*', {
  action() {
    // Show 404 error page using Blaze
    this.render('Page 404');

    // Can be used with BlazeLayout,
    // and ReactLayout for React-based apps
  }
});