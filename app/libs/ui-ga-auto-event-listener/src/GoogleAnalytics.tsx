import * as React from 'react';
import ReactGA from 'react-ga';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('ui-ga-auto-event-listener:GoogleAnalytics');

// So we can write code like:
//
// <Button
//   ga-event-category="demo"
//   ga-event-action="expand"
// >
//   Foo
// </Button>
function handleClick(event) {
  let element = event.target;

  while (element && element !== document) {
    const category = element.getAttribute('data-ga-event-category');

    // We reach a tracking element, no need to look higher in the dom tree.
    if (category) {
      const split = parseFloat(element.getAttribute('data-ga-event-split'));

      if (split && split < Math.random()) {
        return;
      }

      ReactGA.send({
        hitType: 'event',
        eventCategory: category,
        eventAction: element.getAttribute('data-ga-event-action'),
        eventLabel: element.getAttribute('data-ga-event-label'),
      });
      break;
    }

    element = element.parentElement;
  }
}

let bound = false;

function GoogleAnalytics() {
  debug(`render`);

  React.useEffect(() => {
    // Wait for the title to be updated.
    // setTimeout(() => {
    //   ReactGA.set({ page: window.location.pathname })
    //   ReactGA.send({ hitType: 'pageview' })
    // })

    if (bound) {
      return;
    }
    bound = true;
    document.addEventListener('click', handleClick);
  }, []);
  return null;
}

if (process.env.NODE_ENV !== 'production') {
  GoogleAnalytics.displayName = 'ui_ga_auto_event_listener__GoogleAnalytics';
}

GoogleAnalytics.defaultProps = {};

export default GoogleAnalytics;

