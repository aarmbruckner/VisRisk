import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();
 
// i18n.getTranslation("common.routes.home")
const routes = {
  '/': "dashboard",
  '/dashboard': "dashboard",
};
export default routes;
