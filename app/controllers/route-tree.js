import Ember from "ember";
import checkCurrentRoute from "ember-inspector/utils/check-current-route";
import searchMatch from "ember-inspector/utils/search-match";

const { Controller, computed, inject: { controller }, get } = Ember;

export default Controller.extend({
  application: controller(),

  queryParams: ['hideRoutes'],

  currentRoute: null,
  hideRoutes: computed.alias('options.hideRoutes'),

  options: {
    hideRoutes: false
  },

  searchText: '',

  model: computed(() => []),

  filtered: computed('model.[]', 'options.hideRoutes', 'currentRoute', 'searchText', function() {
    return this.get('model').filter(routeItem => {
      let currentRoute = this.get('currentRoute');
      let hideRoutes = this.get('options.hideRoutes');

      let shouldContinue = true;
      if (hideRoutes && currentRoute) {
        shouldContinue = checkCurrentRoute(currentRoute, routeItem.value.name);
      }

      if (!shouldContinue) {
        return false;
      }

      return searchMatch(get(routeItem, 'value.name'), this.get('searchText'));
    });
  }),

  actions: {
    inspectRoute(name) {
      this.get('port').send('objectInspector:inspectRoute', { name });
    },
    sendRouteHandlerToConsole(name) {
      this.get('port').send('objectInspector:sendRouteHandlerToConsole', { name });
    },
    inspectController(controller) {
      if (!controller.exists) {
        return;
      }
      this.get('port').send('objectInspector:inspectController', { name: controller.name });
    },
    sendControllerToConsole(name) {
      this.get('port').send('objectInspector:sendControllerToConsole', { name });
    }
  }
});
